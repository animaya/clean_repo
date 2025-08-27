import React, { useState, useCallback, useRef } from 'react'
import { isValidUrl, isAudioUrl } from '@/lib/file-utils'

interface UrlUploadProps {
  onUrlUpload: (url: string) => void
  onError: (error: Error) => void
  disabled?: boolean
  maxSize?: number
}

interface ValidationState {
  isValid: boolean
  error?: string
  isValidating: boolean
}

const UrlUpload: React.FC<UrlUploadProps> = ({
  onUrlUpload,
  onError,
  disabled = false,
  maxSize = 300 * 1024 * 1024, // 300MB
}) => {
  const [url, setUrl] = useState('')
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    isValidating: false,
  })
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Validate URL format and file type
  const validateUrl = useCallback(async (urlToValidate: string) => {
    if (!urlToValidate.trim()) {
      setValidation({ isValid: false, isValidating: false })
      return
    }

    setValidation({ isValid: false, isValidating: true })

    try {
      // Basic URL format validation
      if (!isValidUrl(urlToValidate)) {
        setValidation({
          isValid: false,
          error: 'Please enter a valid URL',
          isValidating: false,
        })
        return
      }

      // Check if URL points to an audio file
      if (!isAudioUrl(urlToValidate)) {
        setValidation({
          isValid: false,
          error: 'URL must point to an audio file (MP3, WAV, M4A, FLAC, OGG, AAC)',
          isValidating: false,
        })
        return
      }

      // Check for known hosting platforms that don't support direct downloads
      const url = new URL(urlToValidate)
      const unsupportedHosts = [
        'kaggle.com',
        'www.kaggle.com',
        'github.com', // Repository pages, not GitHub Pages
        'www.github.com',
        'drive.google.com',
        'dropbox.com',
        'onedrive.live.com'
      ]
      
      // Allow GitHub Pages sites (*.github.io) but block main GitHub
      const isGitHubPages = url.hostname.endsWith('.github.io')
      const shouldBlock = unsupportedHosts.includes(url.hostname) && !isGitHubPages
      
      if (shouldBlock) {
        setValidation({
          isValid: false,
          error: 'Please use a direct download link. Dataset pages and file sharing platforms are not supported.',
          isValidating: false,
        })
        return
      }

      // Optional: Check file size via HEAD request (skip CORS-blocked domains)
      try {
        const response = await fetch(urlToValidate, { method: 'HEAD' })
        
        if (!response.ok) {
          setValidation({
            isValid: false,
            error: 'Unable to access the audio file. Please check the URL.',
            isValidating: false,
          })
          return
        }
        
        const contentLength = response.headers.get('content-length')
        const contentType = response.headers.get('content-type')
        
        // Verify it's actually an audio file
        if (contentType) {
          const audioContentTypes = [
            'audio/',
            'application/ogg',
            'video/ogg', // OGG can be video/ogg but contain only audio
          ]
          
          const isAudioType = audioContentTypes.some(type => contentType.includes(type))
          
          if (!isAudioType) {
            setValidation({
              isValid: false,
              error: `URL does not point to an audio file (Content-Type: ${contentType})`,
              isValidating: false,
            })
            return
          }
        }
        
        if (contentLength) {
          const fileSize = parseInt(contentLength, 10)
          if (fileSize > maxSize) {
            setValidation({
              isValid: false,
              error: `File size exceeds 300MB limit (${Math.round(fileSize / 1024 / 1024)}MB)`,
              isValidating: false,
            })
            return
          }
        }
      } catch (error: any) {
        // Handle CORS and network errors more gracefully
        if (error.message?.includes('CORS')) {
          setValidation({
            isValid: false,
            error: 'Cannot validate this URL due to CORS restrictions. Please use a direct download link.',
            isValidating: false,
          })
          return
        }
        // If HEAD request fails for other reasons, we'll still allow the URL
        // The actual download will handle any network issues
      }

      setValidation({
        isValid: true,
        isValidating: false,
      })
    } catch (error) {
      setValidation({
        isValid: false,
        error: 'Unable to validate URL',
        isValidating: false,
      })
    }
  }, [maxSize])

  // Debounced validation
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl)

    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }

    // Debounce validation
    if (newUrl.trim()) {
      validationTimeoutRef.current = setTimeout(() => {
        validateUrl(newUrl)
      }, 500)
    } else {
      setValidation({ isValid: false, isValidating: false })
    }
  }, [validateUrl])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validation.isValid || isUploading || disabled) {
      return
    }

    setIsUploading(true)

    try {
      await onUrlUpload(url.trim())
      setUrl('') // Clear input on success
      setValidation({ isValid: false, isValidating: false })
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Upload failed'))
    } finally {
      setIsUploading(false)
    }
  }, [url, validation.isValid, isUploading, disabled, onUrlUpload, onError])

  // Handle Enter key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validation.isValid && !isUploading) {
      handleSubmit(e as any)
    }
  }, [validation.isValid, isUploading, handleSubmit])

  // Handle paste event
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text/plain')
    if (pastedText) {
      setUrl(pastedText)
      handleUrlChange(pastedText)
    }
  }, [handleUrlChange])

  const inputId = 'url-input'
  const errorId = 'url-error'
  const helpId = 'url-help'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload from URL
        </h3>
        <p className="text-sm text-gray-600" id={helpId}>
          Supports direct download links to audio files (MP3, WAV, M4A, FLAC, OGG, AAC)
        </p>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            Audio File URL
          </label>
          
          <div className="relative">
            <input
              ref={inputRef}
              id={inputId}
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="https://example.com/audio.mp3"
              disabled={disabled || isUploading}
              aria-invalid={validation.error ? 'true' : 'false'}
              aria-describedby={`${helpId} ${validation.error ? errorId : ''}`}
              className={`
                custom-input w-full px-3 py-2 border rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${validation.error 
                  ? 'border-red-300 bg-red-50' 
                  : validation.isValid 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 bg-white'
                }
                ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
                xs:text-sm
                sm:text-base
              `.trim().replace(/\s+/g, ' ')}
            />
            
            {/* Validation Status Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {validation.isValidating && (
                <div className="animate-spin w-4 h-4 text-gray-400">
                  ⭮
                </div>
              )}
              {validation.isValid && !validation.isValidating && (
                <div className="w-4 h-4 text-green-500">
                  ✓
                </div>
              )}
              {validation.error && !validation.isValidating && (
                <div className="w-4 h-4 text-red-500">
                  ⚠
                </div>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {validation.isValidating && (
            <p className="mt-2 text-sm text-blue-600">
              Validating URL...
            </p>
          )}
          
          {validation.error && (
            <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
              {validation.error}
            </p>
          )}
          
          {validation.isValid && !validation.isValidating && (
            <p className="mt-2 text-sm text-green-600">
              Valid audio file URL
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!validation.isValid || isUploading || disabled}
          aria-describedby={helpId}
          className={`
            custom-button w-full px-4 py-2 text-sm font-medium rounded-md
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-colors duration-200
            ${validation.isValid && !isUploading && !disabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            xs:py-3
            sm:py-2
            md:text-base
          `.trim().replace(/\s+/g, ' ')}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⭮</span>
              Downloading...
            </span>
          ) : (
            'Upload from URL'
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Supported URL Formats
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Direct download links to audio files (ending in .mp3, .wav, etc.)</li>
          <li>• Maximum file size: 300MB</li>
          <li>• Files must be publicly accessible without authentication</li>
          <li>• Dataset pages (Kaggle, GitHub) are not supported - use direct links</li>
          <li>• Files are downloaded and processed locally for privacy</li>
        </ul>
      </div>
    </div>
  )
}

export default UrlUpload