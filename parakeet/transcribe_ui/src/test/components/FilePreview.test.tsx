import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import FilePreview from '@/components/FilePreview'

// Mock file size formatting utility
vi.mock('@/lib/file-utils', () => ({
  formatFileSize: vi.fn((size: number) => `${Math.round(size / 1024)}KB`),
  formatDuration: vi.fn((duration: number) => `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`),
}))

describe('FilePreview', () => {
  const mockOnRemove = vi.fn()
  const mockOnRetry = vi.fn()

  const createMockFile = (name: string, size: number = 1024 * 1024) => {
    const file = new File(['mock content'], name, { type: 'audio/mpeg' })
    Object.defineProperty(file, 'size', { value: size })
    return file
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays file information correctly', () => {
    const mockFile = createMockFile('test-audio.mp3', 2048 * 1024)
    
    render(
      <FilePreview
        file={mockFile}
        status="pending"
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('test-audio.mp3')).toBeInTheDocument()
    expect(screen.getByText('2MB')).toBeInTheDocument()
  })

  it('shows pending status correctly', () => {
    const mockFile = createMockFile('pending.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="pending"
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/pending/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('shows uploading status with progress', () => {
    const mockFile = createMockFile('uploading.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="uploading"
        progress={45}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/uploading/i)).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows converting status with progress', () => {
    const mockFile = createMockFile('converting.wav')
    
    render(
      <FilePreview
        file={mockFile}
        status="converting"
        progress={75}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/converting/i)).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows completed status', () => {
    const mockFile = createMockFile('completed.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="completed"
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/completed/i)).toBeInTheDocument()
    expect(screen.getByText(/✓/)).toBeInTheDocument()
  })

  it('shows error status with retry option', () => {
    const mockFile = createMockFile('error.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="error"
        error="Upload failed"
        onRemove={mockOnRemove}
        onRetry={mockOnRetry}
      />
    )

    expect(screen.getByText(/error/i)).toBeInTheDocument()
    expect(screen.getByText('Upload failed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('handles file removal', async () => {
    const mockFile = createMockFile('remove-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="pending"
        onRemove={mockOnRemove}
      />
    )

    const removeButton = screen.getByRole('button', { name: /remove/i })
    await userEvent.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledWith(mockFile)
  })

  it('handles retry action', async () => {
    const mockFile = createMockFile('retry-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="error"
        error="Network error"
        onRemove={mockOnRemove}
        onRetry={mockOnRetry}
      />
    )

    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledWith(mockFile)
  })

  it('displays audio duration when available', () => {
    const mockFile = createMockFile('with-duration.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="completed"
        duration={125} // 2:05
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('2:05')).toBeInTheDocument()
  })

  it('shows file format icon', () => {
    const mockFile = createMockFile('audio.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="pending"
        onRemove={mockOnRemove}
      />
    )

    // Look for music/audio icon
    const icon = screen.getByTestId('audio-icon')
    expect(icon).toBeInTheDocument()
  })

  it('displays different icons for different audio formats', () => {
    const formats = [
      { name: 'test.mp3', type: 'audio/mpeg' },
      { name: 'test.wav', type: 'audio/wav' },
      { name: 'test.m4a', type: 'audio/mp4' },
      { name: 'test.flac', type: 'audio/flac' },
    ]

    formats.forEach(({ name, type }) => {
      const mockFile = new File(['content'], name, { type })
      
      const { unmount } = render(
        <FilePreview
          file={mockFile}
          status="pending"
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByTestId('audio-icon')).toBeInTheDocument()
      unmount()
    })
  })

  it('shows progress bar with correct aria attributes', () => {
    const mockFile = createMockFile('progress-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="uploading"
        progress={60}
        onRemove={mockOnRemove}
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '60')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    expect(progressBar).toHaveAttribute('aria-label')
  })

  it('is keyboard accessible', async () => {
    const mockFile = createMockFile('keyboard-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="error"
        error="Test error"
        onRemove={mockOnRemove}
        onRetry={mockOnRetry}
      />
    )

    // Tab to remove button
    await userEvent.tab()
    const removeButton = screen.getByRole('button', { name: /remove/i })
    expect(removeButton).toHaveFocus()

    // Tab to retry button
    await userEvent.tab()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toHaveFocus()

    // Test Enter key activation
    await userEvent.keyboard('{Enter}')
    expect(mockOnRetry).toHaveBeenCalledWith(mockFile)
  })

  it('has proper ARIA labels for accessibility', () => {
    const mockFile = createMockFile('aria-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="uploading"
        progress={30}
        onRemove={mockOnRemove}
      />
    )

    const container = screen.getByRole('listitem')
    expect(container).toHaveAttribute('aria-label')

    const removeButton = screen.getByRole('button', { name: /remove/i })
    expect(removeButton).toHaveAttribute('aria-label')

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-label')
  })

  it('handles file size formatting edge cases', () => {
    const testCases = [
      { size: 0, expected: '0KB' },
      { size: 512, expected: '1KB' },
      { size: 1024, expected: '1KB' },
      { size: 1536, expected: '2KB' },
      { size: 1024 * 1024, expected: '1024KB' },
    ]

    testCases.forEach(({ size, expected }) => {
      const mockFile = createMockFile(`test-${size}.mp3`, size)
      
      const { unmount } = render(
        <FilePreview
          file={mockFile}
          status="pending"
          onRemove={mockOnRemove}
        />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('shows upload speed when provided', () => {
    const mockFile = createMockFile('speed-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="uploading"
        progress={50}
        uploadSpeed={1024 * 1024} // 1MB/s
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/1024KB\/s/)).toBeInTheDocument()
  })

  it('shows estimated time remaining', () => {
    const mockFile = createMockFile('eta-test.mp3')
    
    render(
      <FilePreview
        file={mockFile}
        status="uploading"
        progress={25}
        estimatedTimeRemaining={90} // 1:30
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText(/1:30.*remaining/i)).toBeInTheDocument()
  })
})