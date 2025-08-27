import React from 'react'
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone'

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void
  onFileReject: (rejectedFiles: FileRejection[]) => void
  accept?: DropzoneOptions['accept']
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  children?: React.ReactNode
}

const DropZone: React.FC<DropZoneProps> = ({
  onFilesDrop,
  onFileReject,
  accept = { 
    'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.wma'],
    'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
  },
  maxSize = 300 * 1024 * 1024, // 300MB
  maxFiles = 10,
  disabled = false,
  children,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept,
    maxSize,
    maxFiles,
    disabled,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        onFilesDrop(acceptedFiles)
      }
      if (rejectedFiles.length > 0) {
        onFileReject(rejectedFiles)
      }
    },
  })

  // Dynamic styling based on drag state
  const getDropzoneClasses = () => {
    let baseClasses = `
      custom-dropzone border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      xs:p-8
      sm:p-10
      md:p-12
      lg:p-14
    `

    if (disabled) {
      baseClasses += ' cursor-not-allowed opacity-50'
    } else if (isDragReject) {
      baseClasses += ' border-red-400 bg-red-50 text-red-600'
    } else if (isDragAccept) {
      baseClasses += ' border-blue-400 bg-blue-50 text-blue-600'
    } else if (isDragActive) {
      baseClasses += ' border-blue-400 bg-blue-50'
    } else {
      baseClasses += ' border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
    }

    return baseClasses.trim().replace(/\s+/g, ' ')
  }

  const getAriaLabel = () => {
    if (isDragReject) return 'Drop zone (rejecting invalid files)'
    if (isDragAccept) return 'Drop zone (accepting files)'
    if (isDragActive) return 'Drop zone (drag active)'
    return 'Drop zone for audio and video files'
  }

  return (
    <div
      {...getRootProps()}
      data-testid="dropzone"
      className={getDropzoneClasses()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={getAriaLabel()}
      aria-disabled={disabled}
    >
      <input {...getInputProps()} data-testid="file-input" />
      {children || (
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">
            {isDragReject ? '⚠️' : isDragAccept ? '✅' : '🎵'}
          </div>
          <div>
            {isDragReject && (
              <p className="text-red-600 font-medium">
                Invalid file type - Please drop audio or video files only
              </p>
            )}
            {isDragAccept && (
              <p className="text-blue-600 font-medium">
                Drop your audio or video files here
              </p>
            )}
            {!isDragActive && (
              <>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag and drop audio or video files here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
              </>
            )}
          </div>
          {!isDragActive && (
            <div className="text-xs text-gray-400">
              <p>Audio: MP3, WAV, M4A, FLAC, OGG, WMA • Video: MP4, AVI, MOV, MKV, WEBM • Max: 300MB • Files: {maxFiles}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DropZone