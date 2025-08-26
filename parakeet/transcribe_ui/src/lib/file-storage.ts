import { promises as fs } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

export type StorageConfig = {
  uploadsDir: string
  maxStorageSize?: number // in bytes
  organizationStrategy: 'flat' | 'date-based' | 'hash-based'
}

export type StorageInfo = {
  total: number
  free: number
  used: number
  usagePercentage: number
}

export type FileStorageResult = {
  success: boolean
  filePath?: string
  error?: string
}

const DEFAULT_CONFIG: StorageConfig = {
  uploadsDir: process.env.UPLOAD_DIR || './uploads',
  maxStorageSize: 10 * 1024 * 1024 * 1024, // 10GB default
  organizationStrategy: 'date-based'
}

/**
 * Ensures that a storage directory exists, creating it if necessary
 */
export async function ensureStorageDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Calculates the storage path for a file based on organization strategy
 */
export function calculateStoragePath(
  filename: string, 
  uploadDate: Date = new Date(),
  config: StorageConfig = DEFAULT_CONFIG
): string {
  const { uploadsDir, organizationStrategy } = config

  switch (organizationStrategy) {
    case 'flat':
      return path.join(uploadsDir, filename)

    case 'date-based':
      const year = uploadDate.getFullYear().toString()
      const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0')
      const day = uploadDate.getDate().toString().padStart(2, '0')
      return path.join(uploadsDir, year, month, day, filename)

    case 'hash-based':
      const hash = filename.slice(-8) // Use last 8 chars as simple hash
      const firstLevel = hash.substring(0, 2)
      const secondLevel = hash.substring(2, 4)
      return path.join(uploadsDir, firstLevel, secondLevel, filename)

    default:
      return path.join(uploadsDir, filename)
  }
}

/**
 * Moves a file from source to target location in storage
 */
export async function moveFileToStorage(
  sourcePath: string, 
  targetPath: string
): Promise<string> {
  try {
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath)
    await ensureStorageDirectory(targetDir)

    // Move the file
    await fs.rename(sourcePath, targetPath)
    
    return targetPath
  } catch (error) {
    throw new Error(`Failed to move file to storage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Copies a file to storage location (keeps original)
 */
export async function copyFileToStorage(
  sourcePath: string, 
  targetPath: string
): Promise<string> {
  try {
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath)
    await ensureStorageDirectory(targetDir)

    // Copy the file
    await fs.copyFile(sourcePath, targetPath)
    
    return targetPath
  } catch (error) {
    throw new Error(`Failed to copy file to storage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Checks available storage space
 */
export async function checkStorageSpace(dirPath: string = DEFAULT_CONFIG.uploadsDir): Promise<StorageInfo> {
  try {
    // Use df command to check disk space (Unix/Linux/macOS)
    const { stdout } = await execAsync(`df -B1 "${dirPath}"`)
    const lines = stdout.trim().split('\n')
    const dataLine = lines[lines.length - 1].split(/\s+/)
    
    const total = parseInt(dataLine[1], 10)
    const used = parseInt(dataLine[2], 10)
    const free = parseInt(dataLine[3], 10)
    
    return {
      total,
      free,
      used,
      usagePercentage: Math.round((used / total) * 100)
    }
  } catch (error) {
    // Fallback: estimate based on directory size
    try {
      const dirStats = await getDirectorySize(dirPath)
      const estimatedTotal = 100 * 1024 * 1024 * 1024 // 100GB estimate
      return {
        total: estimatedTotal,
        used: dirStats,
        free: estimatedTotal - dirStats,
        usagePercentage: Math.round((dirStats / estimatedTotal) * 100)
      }
    } catch {
      throw new Error(`Failed to check storage space: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Gets the total size of a directory recursively
 */
export async function getDirectorySize(dirPath: string): Promise<number> {
  try {
    const stats = await fs.stat(dirPath)
    
    if (stats.isFile()) {
      return stats.size
    } else if (stats.isDirectory()) {
      const entries = await fs.readdir(dirPath)
      let totalSize = 0
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry)
        totalSize += await getDirectorySize(fullPath)
      }
      
      return totalSize
    }
    
    return 0
  } catch {
    return 0
  }
}

/**
 * Validates that there's enough space for a file upload
 */
export async function validateStorageSpace(
  fileSize: number, 
  config: StorageConfig = DEFAULT_CONFIG
): Promise<{ hasSpace: boolean; availableSpace: number; message?: string }> {
  try {
    const storageInfo = await checkStorageSpace(config.uploadsDir)
    const requiredSpace = fileSize * 1.1 // Add 10% buffer
    
    const hasSpace = storageInfo.free >= requiredSpace
    
    return {
      hasSpace,
      availableSpace: storageInfo.free,
      message: hasSpace 
        ? undefined 
        : `Not enough storage space. Required: ${formatBytes(requiredSpace)}, Available: ${formatBytes(storageInfo.free)}`
    }
  } catch (error) {
    return {
      hasSpace: false,
      availableSpace: 0,
      message: `Failed to check storage space: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Stores an uploaded file in the appropriate location
 */
export async function storeUploadedFile(
  tempFilePath: string,
  originalFilename: string,
  sanitizedFilename: string,
  config: StorageConfig = DEFAULT_CONFIG
): Promise<FileStorageResult> {
  try {
    // Calculate target path
    const targetPath = calculateStoragePath(sanitizedFilename, new Date(), config)
    
    // Check if file already exists at target path
    try {
      await fs.access(targetPath)
      return {
        success: false,
        error: `File already exists at target location: ${targetPath}`
      }
    } catch {
      // File doesn't exist, which is good
    }
    
    // Check storage space
    const fileStats = await fs.stat(tempFilePath)
    const spaceValidation = await validateStorageSpace(fileStats.size, config)
    
    if (!spaceValidation.hasSpace) {
      return {
        success: false,
        error: spaceValidation.message || 'Insufficient storage space'
      }
    }
    
    // Move file to storage location
    const storedPath = await moveFileToStorage(tempFilePath, targetPath)
    
    return {
      success: true,
      filePath: storedPath
    }
  } catch (error) {
    return {
      success: false,
      error: `Storage operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Retrieves a file from storage
 */
export async function getStoredFile(filePath: string): Promise<Buffer> {
  try {
    return await fs.readFile(filePath)
  } catch (error) {
    throw new Error(`Failed to retrieve stored file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Deletes a file from storage
 */
export async function deleteStoredFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
    
    // Try to remove empty parent directories
    await cleanupEmptyDirectories(path.dirname(filePath))
  } catch (error) {
    throw new Error(`Failed to delete stored file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Removes empty directories recursively up the tree
 */
async function cleanupEmptyDirectories(dirPath: string, rootPath: string = DEFAULT_CONFIG.uploadsDir): Promise<void> {
  if (dirPath === rootPath || dirPath === '.' || dirPath === '/') {
    return
  }
  
  try {
    const entries = await fs.readdir(dirPath)
    if (entries.length === 0) {
      await fs.rmdir(dirPath)
      await cleanupEmptyDirectories(path.dirname(dirPath), rootPath)
    }
  } catch {
    // Directory might not be empty or might not exist, which is fine
  }
}

/**
 * Lists all files in storage with optional filtering
 */
export async function listStoredFiles(
  dirPath: string = DEFAULT_CONFIG.uploadsDir,
  options: {
    recursive?: boolean
    extension?: string
    maxDepth?: number
  } = {}
): Promise<string[]> {
  const { recursive = true, extension, maxDepth = 10 } = options
  
  async function listDir(currentPath: string, currentDepth: number = 0): Promise<string[]> {
    if (currentDepth >= maxDepth) {
      return []
    }
    
    try {
      const entries = await fs.readdir(currentPath)
      const files: string[] = []
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry)
        const stats = await fs.stat(fullPath)
        
        if (stats.isFile()) {
          if (!extension || fullPath.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
            files.push(fullPath)
          }
        } else if (stats.isDirectory() && recursive) {
          const subFiles = await listDir(fullPath, currentDepth + 1)
          files.push(...subFiles)
        }
      }
      
      return files
    } catch {
      return []
    }
  }
  
  return listDir(dirPath)
}

/**
 * Gets storage statistics for monitoring
 */
export async function getStorageStatistics(
  config: StorageConfig = DEFAULT_CONFIG
): Promise<{
  totalFiles: number
  totalSize: number
  storageInfo: StorageInfo
  filesByExtension: Record<string, number>
  averageFileSize: number
}> {
  try {
    const files = await listStoredFiles(config.uploadsDir)
    const storageInfo = await checkStorageSpace(config.uploadsDir)
    
    let totalSize = 0
    const filesByExtension: Record<string, number> = {}
    
    for (const filePath of files) {
      try {
        const stats = await fs.stat(filePath)
        totalSize += stats.size
        
        const ext = path.extname(filePath).toLowerCase()
        filesByExtension[ext] = (filesByExtension[ext] || 0) + 1
      } catch {
        // Skip files that can't be accessed
      }
    }
    
    return {
      totalFiles: files.length,
      totalSize,
      storageInfo,
      filesByExtension,
      averageFileSize: files.length > 0 ? Math.round(totalSize / files.length) : 0
    }
  } catch (error) {
    throw new Error(`Failed to get storage statistics: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Formats bytes into human-readable format
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * Creates a backup of critical storage data
 */
export async function createStorageBackup(
  backupPath: string,
  config: StorageConfig = DEFAULT_CONFIG
): Promise<void> {
  try {
    await ensureStorageDirectory(path.dirname(backupPath))
    
    // Create tar archive of uploads directory
    const command = `tar -czf "${backupPath}" -C "${path.dirname(config.uploadsDir)}" "${path.basename(config.uploadsDir)}"`
    await execAsync(command)
  } catch (error) {
    throw new Error(`Failed to create storage backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}