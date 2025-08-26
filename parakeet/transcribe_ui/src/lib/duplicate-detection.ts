import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

export type DuplicatePolicy = 'skip' | 'replace' | 'keep_both' | 'prompt_user'

export type FileIdentifier = {
  id?: number
  filename: string
  size: number
  checksum: string
  filePath?: string
}

export type SimilarityResult = {
  isExactMatch: boolean
  checksumMatch: boolean
  sizeMatch: boolean
  filenameMatch: boolean
  similarityScore: number // 0-1, where 1 is identical
}

export type DuplicateCheckResult = {
  hasDuplicates: boolean
  exactMatches: FileIdentifier[]
  similarFiles: Array<{
    file: FileIdentifier
    similarity: SimilarityResult
  }>
  recommendations: {
    action: DuplicatePolicy
    reason: string
  }[]
}

export type DuplicateResolution = {
  action: 'skip' | 'replace' | 'keep_both'
  existingFileId?: number
  replaceFileId?: number
  newFilename?: string
  message: string
}

/**
 * Finds duplicate files by checksum
 */
export async function findDuplicatesByChecksum(
  checksum: string,
  prisma: PrismaClient
): Promise<FileIdentifier[]> {
  try {
    const duplicates = await prisma.uploadedFiles.findMany({
      where: {
        checksum: checksum
      },
      select: {
        id: true,
        filename: true,
        fileSize: true,
        checksum: true,
        filePath: true
      }
    })

    return duplicates.map(file => ({
      id: file.id,
      filename: file.filename,
      size: file.fileSize,
      checksum: file.checksum || '',
      filePath: file.filePath
    }))
  } catch (error) {
    throw new Error(`Failed to find duplicates by checksum: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Finds similar files by size and filename patterns
 */
export async function findSimilarFiles(
  targetFile: Omit<FileIdentifier, 'id'>,
  prisma: PrismaClient,
  similarityThreshold: number = 0.7
): Promise<Array<{ file: FileIdentifier; similarity: SimilarityResult }>> {
  try {
    // Get files with similar size (within 10% range)
    const sizeRange = targetFile.size * 0.1
    const minSize = targetFile.size - sizeRange
    const maxSize = targetFile.size + sizeRange

    const candidates = await prisma.uploadedFiles.findMany({
      where: {
        fileSize: {
          gte: minSize,
          lte: maxSize
        }
      },
      select: {
        id: true,
        filename: true,
        fileSize: true,
        checksum: true,
        filePath: true
      }
    })

    const similarFiles: Array<{ file: FileIdentifier; similarity: SimilarityResult }> = []

    for (const candidate of candidates) {
      const candidateFile: FileIdentifier = {
        id: candidate.id,
        filename: candidate.filename,
        size: candidate.fileSize,
        checksum: candidate.checksum || '',
        filePath: candidate.filePath
      }

      const similarity = compareFileSimilarity(targetFile, candidateFile)
      
      if (similarity.similarityScore >= similarityThreshold) {
        similarFiles.push({
          file: candidateFile,
          similarity
        })
      }
    }

    return similarFiles.sort((a, b) => b.similarity.similarityScore - a.similarity.similarityScore)
  } catch (error) {
    throw new Error(`Failed to find similar files: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Compares two files for similarity
 */
export function compareFileSimilarity(
  file1: Omit<FileIdentifier, 'id'>,
  file2: FileIdentifier
): SimilarityResult {
  // Checksum comparison (most reliable)
  const checksumMatch = file1.checksum === file2.checksum && file1.checksum !== ''
  
  // Size comparison (exact match)
  const sizeMatch = file1.size === file2.size
  
  // Filename comparison (normalized)
  const filename1 = normalizeFilename(file1.filename)
  const filename2 = normalizeFilename(file2.filename)
  const filenameMatch = filename1 === filename2
  
  // Calculate filename similarity score using Levenshtein distance
  const filenameSimilarity = calculateStringSimilarity(filename1, filename2)
  
  // Calculate overall similarity score
  let similarityScore = 0
  
  if (checksumMatch) {
    similarityScore = 1.0 // Exact match
  } else {
    // Weight different factors
    similarityScore = (
      (sizeMatch ? 0.3 : 0) +
      (filenameMatch ? 0.4 : filenameSimilarity * 0.4) +
      (filenameMatch ? 0.3 : 0)
    )
  }
  
  return {
    isExactMatch: checksumMatch && sizeMatch,
    checksumMatch,
    sizeMatch,
    filenameMatch,
    similarityScore: Math.min(1.0, Math.max(0.0, similarityScore))
  }
}

/**
 * Performs comprehensive duplicate check for a file
 */
export async function checkForDuplicates(
  targetFile: Omit<FileIdentifier, 'id'>,
  prisma: PrismaClient,
  options: {
    includeChecksum?: boolean
    includeSimilar?: boolean
    similarityThreshold?: number
  } = {}
): Promise<DuplicateCheckResult> {
  const {
    includeChecksum = true,
    includeSimilar = true,
    similarityThreshold = 0.7
  } = options

  const result: DuplicateCheckResult = {
    hasDuplicates: false,
    exactMatches: [],
    similarFiles: [],
    recommendations: []
  }

  try {
    // Find exact matches by checksum
    if (includeChecksum && targetFile.checksum) {
      result.exactMatches = await findDuplicatesByChecksum(targetFile.checksum, prisma)
      
      if (result.exactMatches.length > 0) {
        result.hasDuplicates = true
        result.recommendations.push({
          action: 'skip',
          reason: `Identical file already exists (checksum match): ${result.exactMatches[0].filename}`
        })
      }
    }

    // Find similar files if no exact matches
    if (includeSimilar && result.exactMatches.length === 0) {
      result.similarFiles = await findSimilarFiles(targetFile, prisma, similarityThreshold)
      
      if (result.similarFiles.length > 0) {
        result.hasDuplicates = true
        
        const topMatch = result.similarFiles[0]
        if (topMatch.similarity.similarityScore > 0.9) {
          result.recommendations.push({
            action: 'prompt_user',
            reason: `Very similar file found (${Math.round(topMatch.similarity.similarityScore * 100)}% similar): ${topMatch.file.filename}`
          })
        } else {
          result.recommendations.push({
            action: 'keep_both',
            reason: `Similar file found but differences detected: ${topMatch.file.filename}`
          })
        }
      }
    }

    // If no duplicates found
    if (!result.hasDuplicates) {
      result.recommendations.push({
        action: 'keep_both',
        reason: 'No duplicates found, safe to upload'
      })
    }

  } catch (error) {
    result.recommendations.push({
      action: 'keep_both',
      reason: `Duplicate check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  return result
}

/**
 * Resolves duplicate file conflict based on policy
 */
export function resolveDuplicatePolicy(
  duplicateInfo: {
    isExactMatch: boolean
    existingFile: FileIdentifier
    newFile: Omit<FileIdentifier, 'id'>
  },
  policy: DuplicatePolicy
): DuplicateResolution {
  const { isExactMatch, existingFile, newFile } = duplicateInfo

  switch (policy) {
    case 'skip':
      return {
        action: 'skip',
        existingFileId: existingFile.id,
        message: `Skipped upload. File already exists: ${existingFile.filename}`
      }

    case 'replace':
      return {
        action: 'replace',
        replaceFileId: existingFile.id,
        message: `Replacing existing file: ${existingFile.filename}`
      }

    case 'keep_both':
      const newFilename = generateNonConflictingFilename(newFile.filename, existingFile.filename)
      return {
        action: 'keep_both',
        newFilename,
        message: `Keeping both files. New file renamed to: ${newFilename}`
      }

    case 'prompt_user':
    default:
      return {
        action: 'keep_both',
        newFilename: generateNonConflictingFilename(newFile.filename, existingFile.filename),
        message: `User intervention required for duplicate: ${existingFile.filename}`
      }
  }
}

/**
 * Generates a non-conflicting filename
 */
export function generateNonConflictingFilename(
  originalFilename: string,
  conflictingFilename: string
): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  
  // Extract extension
  const lastDot = originalFilename.lastIndexOf('.')
  const name = lastDot > 0 ? originalFilename.substring(0, lastDot) : originalFilename
  const extension = lastDot > 0 ? originalFilename.substring(lastDot) : ''
  
  // Generate unique suffix
  const suffix = `${timestamp % 10000}${random.toString().padStart(3, '0')}`
  
  return `${name}-${suffix}${extension}`
}

/**
 * Normalizes filename for comparison
 */
function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^\w\s.-]/g, '') // Remove special characters except dots, hyphens, and underscores
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens from start and end
}

/**
 * Calculates string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0
  
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1.0
  
  const distance = levenshteinDistance(str1, str2)
  return 1 - (distance / maxLength)
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Creates a duplicate detection strategy based on file characteristics
 */
export function createDuplicateDetectionStrategy(
  fileSize: number,
  fileType: string
): {
  useChecksum: boolean
  useSimilarity: boolean
  similarityThreshold: number
  recommendedPolicy: DuplicatePolicy
} {
  // For large files, rely more heavily on checksum
  if (fileSize > 50 * 1024 * 1024) { // 50MB
    return {
      useChecksum: true,
      useSimilarity: false,
      similarityThreshold: 0.95,
      recommendedPolicy: 'skip'
    }
  }
  
  // For audio files, use both methods
  if (fileType.startsWith('audio/')) {
    return {
      useChecksum: true,
      useSimilarity: true,
      similarityThreshold: 0.8,
      recommendedPolicy: 'prompt_user'
    }
  }
  
  // Default strategy
  return {
    useChecksum: true,
    useSimilarity: true,
    similarityThreshold: 0.7,
    recommendedPolicy: 'keep_both'
  }
}

/**
 * Batch processes duplicate detection for multiple files
 */
export async function batchCheckDuplicates(
  files: Array<Omit<FileIdentifier, 'id'>>,
  prisma: PrismaClient
): Promise<Record<string, DuplicateCheckResult>> {
  const results: Record<string, DuplicateCheckResult> = {}
  
  for (const file of files) {
    try {
      const checkResult = await checkForDuplicates(file, prisma)
      results[file.filename] = checkResult
    } catch (error) {
      results[file.filename] = {
        hasDuplicates: false,
        exactMatches: [],
        similarFiles: [],
        recommendations: [{
          action: 'keep_both',
          reason: `Duplicate check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      }
    }
  }
  
  return results
}

/**
 * Generates a report of duplicate files in the system
 */
export async function generateDuplicateReport(
  prisma: PrismaClient
): Promise<{
  totalFiles: number
  duplicateGroups: Array<{
    checksum: string
    files: FileIdentifier[]
    totalSize: number
    potentialSavings: number
  }>
  totalDuplicates: number
  totalWastedSpace: number
}> {
  try {
    // Get all files with their checksums
    const allFiles = await prisma.uploadedFiles.findMany({
      select: {
        id: true,
        filename: true,
        fileSize: true,
        checksum: true,
        filePath: true
      },
      where: {
        checksum: {
          not: null
        }
      }
    })

    // Group files by checksum
    const checksumGroups: Record<string, FileIdentifier[]> = {}
    
    for (const file of allFiles) {
      if (file.checksum) {
        if (!checksumGroups[file.checksum]) {
          checksumGroups[file.checksum] = []
        }
        checksumGroups[file.checksum].push({
          id: file.id,
          filename: file.filename,
          size: file.fileSize,
          checksum: file.checksum,
          filePath: file.filePath
        })
      }
    }

    // Find duplicate groups (groups with more than one file)
    const duplicateGroups = Object.entries(checksumGroups)
      .filter(([, files]) => files.length > 1)
      .map(([checksum, files]) => {
        const totalSize = files.reduce((sum, file) => sum + file.size, 0)
        const potentialSavings = (files.length - 1) * files[0].size
        
        return {
          checksum,
          files,
          totalSize,
          potentialSavings
        }
      })

    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.files.length - 1, 0)
    const totalWastedSpace = duplicateGroups.reduce((sum, group) => sum + group.potentialSavings, 0)

    return {
      totalFiles: allFiles.length,
      duplicateGroups,
      totalDuplicates,
      totalWastedSpace
    }
  } catch (error) {
    throw new Error(`Failed to generate duplicate report: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}