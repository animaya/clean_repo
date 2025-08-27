import path from 'path'
import { promises as fs } from 'fs'

export interface StorageConfig {
  uploadDir: string
  maxFileSize: number
  allowedFormats: string[]
}

const defaultConfig: StorageConfig = {
  uploadDir: 'uploads',
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFormats: ['.mp3', '.wav', '.m4a', '.flac'],
}

/**
 * Create upload directory if it doesn't exist
 */
export async function createUploadDirectory(uploadDir?: string): Promise<string> {
  const dir = uploadDir || defaultConfig.uploadDir
  const fullPath = path.resolve(process.cwd(), dir)

  try {
    await fs.access(fullPath)
  } catch {
    await fs.mkdir(fullPath, { recursive: true })
  }

  return fullPath
}

/**
 * Store file to local storage
 */
export async function storeFile(
  sourceFilePath: string, 
  filename: string, 
  config?: Partial<StorageConfig>
): Promise<string> {
  const storageConfig = { ...defaultConfig, ...config }
  const uploadDir = await createUploadDirectory(storageConfig.uploadDir)
  const destinationPath = path.join(uploadDir, filename)

  try {
    await fs.copyFile(sourceFilePath, destinationPath)
    return destinationPath
  } catch (error) {
    throw new Error(`Failed to store file: ${error}`)
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    // File might not exist, which is okay
    console.warn(`Could not delete file ${filePath}:`, error)
  }
}

/**
 * Get file size
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath)
  return stats.size
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}