import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import UrlUpload from '@/components/UrlUpload'

// Mock fetch for URL validation and download
global.fetch = vi.fn()

describe('UrlUpload', () => {
  const mockOnUrlUpload = vi.fn()
  const mockOnError = vi.fn()

  const defaultProps = {
    onUrlUpload: mockOnUrlUpload,
    onError: mockOnError,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true }),
    })
  })

  it('renders the URL input interface', () => {
    render(<UrlUpload {...defaultProps} />)
    
    expect(screen.getByLabelText(/audio.*url/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload.*url/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/https:\/\/example.com\/audio\.mp3/i)).toBeInTheDocument()
  })

  it('shows supported URL formats', () => {
    render(<UrlUpload {...defaultProps} />)
    
    expect(screen.getByText(/supports.*direct.*links.*audio.*files/i)).toBeInTheDocument()
    expect(screen.getByText(/mp3.*wav.*m4a.*flac/i)).toBeInTheDocument()
  })

  it('validates URL format on input', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    
    // Test invalid URL
    await userEvent.type(input, 'not-a-url')
    await userEvent.tab() // Trigger blur
    
    await waitFor(() => {
      expect(screen.getByText(/please.*enter.*valid.*url/i)).toBeInTheDocument()
    })
  })

  it('accepts valid URLs', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const validUrl = 'https://example.com/audio.mp3'
    
    await userEvent.type(input, validUrl)
    await userEvent.tab()
    
    // Should not show error for valid URL
    expect(screen.queryByText(/please.*enter.*valid.*url/i)).not.toBeInTheDocument()
  })

  it('validates audio file extensions', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const nonAudioUrl = 'https://example.com/document.pdf'
    
    await userEvent.type(input, nonAudioUrl)
    await userEvent.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/url.*must.*point.*audio.*file/i)).toBeInTheDocument()
    })
  })

  it('handles URL upload submission', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    const validUrl = 'https://example.com/audio.mp3'
    
    await userEvent.type(input, validUrl)
    await userEvent.click(uploadButton)
    
    expect(mockOnUrlUpload).toHaveBeenCalledWith(validUrl)
  })

  it('disables upload button for invalid URLs', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    
    await userEvent.type(input, 'invalid-url')
    
    await waitFor(() => {
      expect(uploadButton).toBeDisabled()
    })
  })

  it('enables upload button for valid URLs', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    
    await userEvent.type(input, 'https://example.com/audio.wav')
    
    await waitFor(() => {
      expect(uploadButton).not.toBeDisabled()
    })
  })

  it('shows loading state during upload', async () => {
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    )

    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    
    await userEvent.type(input, 'https://example.com/audio.mp3')
    await userEvent.click(uploadButton)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(uploadButton).toBeDisabled()
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    
    await userEvent.type(input, 'https://example.com/audio.mp3')
    await userEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Network error'),
      }))
    })
  })

  it('supports Enter key submission', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    
    await userEvent.type(input, 'https://example.com/audio.mp3')
    await userEvent.keyboard('{Enter}')
    
    expect(mockOnUrlUpload).toHaveBeenCalledWith('https://example.com/audio.mp3')
  })

  it('clears input after successful upload', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    
    await userEvent.type(input, 'https://example.com/audio.mp3')
    await userEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('validates different audio formats', async () => {
    const validFormats = [
      'https://example.com/audio.mp3',
      'https://example.com/audio.wav',
      'https://example.com/audio.m4a',
      'https://example.com/audio.flac',
      'https://example.com/audio.ogg',
      'https://example.com/audio.aac',
    ]

    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)

    for (const url of validFormats) {
      await userEvent.clear(input)
      await userEvent.type(input, url)
      await userEvent.tab()
      
      // Should not show error for valid audio format
      expect(screen.queryByText(/url.*must.*point.*audio.*file/i)).not.toBeInTheDocument()
    }
  })

  it('shows file size warning for large URLs', async () => {
    // Mock HEAD request to return large content-length
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        'content-length': (150 * 1024 * 1024).toString(), // 150MB
      }),
    })

    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    
    await userEvent.type(input, 'https://example.com/large-audio.mp3')
    await userEvent.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/file.*size.*exceeds.*100mb.*limit/i)).toBeInTheDocument()
    })
  })

  it('is keyboard accessible', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    // Tab to input
    await userEvent.tab()
    const input = screen.getByLabelText(/audio.*url/i)
    expect(input).toHaveFocus()
    
    // Tab to upload button
    await userEvent.tab()
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    expect(uploadButton).toHaveFocus()
  })

  it('has proper ARIA attributes', () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    expect(input).toHaveAttribute('aria-describedby')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    
    const uploadButton = screen.getByRole('button', { name: /upload.*url/i })
    expect(uploadButton).toHaveAttribute('aria-describedby')
  })

  it('updates ARIA attributes on validation errors', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    
    await userEvent.type(input, 'invalid-url')
    await userEvent.tab()
    
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('shows progress for long URL validation', async () => {
    // Mock slow validation response
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 200))
    )

    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    
    await userEvent.type(input, 'https://example.com/audio.mp3')
    await userEvent.tab()
    
    expect(screen.getByText(/validating.*url/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText(/validating.*url/i)).not.toBeInTheDocument()
    })
  })

  it('supports paste functionality', async () => {
    render(<UrlUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/audio.*url/i)
    input.focus()
    
    // Simulate paste event
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    })
    pasteEvent.clipboardData!.setData('text/plain', 'https://example.com/pasted-audio.mp3')
    
    input.dispatchEvent(pasteEvent)
    
    await waitFor(() => {
      expect(input).toHaveValue('https://example.com/pasted-audio.mp3')
    })
  })
})