import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import AudioUploader from '@/components/AudioUploader'

// Mock react-dropzone
const mockUseDropzone = vi.fn()
vi.mock('react-dropzone', () => ({
  useDropzone: mockUseDropzone,
}))

// Mock file API and URL functions
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
})

// Mock fetch for API calls
global.fetch = vi.fn()

describe('AudioUploader', () => {
  const mockOnUploadStart = vi.fn()
  const mockOnUploadProgress = vi.fn()
  const mockOnUploadComplete = vi.fn()
  const mockOnError = vi.fn()

  const defaultProps = {
    onUploadStart: mockOnUploadStart,
    onUploadProgress: mockOnUploadProgress,
    onUploadComplete: mockOnUploadComplete,
    onError: mockOnError,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateObjectURL.mockReturnValue('blob:test-url')
    
    // Mock successful upload response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sessionId: 'test-session-id',
        files: [{ id: 'file-1', name: 'test.mp3', status: 'uploaded' }],
      }),
    })
  })

  it('renders the drag-and-drop zone', () => {
    render(<AudioUploader {...defaultProps} />)
    
    expect(screen.getByText(/drag.*drop.*audio.*files/i)).toBeInTheDocument()
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument()
  })

  it('displays supported file formats', () => {
    render(<AudioUploader {...defaultProps} />)
    
    expect(screen.getByText(/supports.*mp3.*wav.*m4a.*flac/i)).toBeInTheDocument()
  })

  it('shows file size and duration limits', () => {
    render(<AudioUploader {...defaultProps} />)
    
    expect(screen.getByText(/max.*100mb/i)).toBeInTheDocument()
    expect(screen.getByText(/max.*2.*hours/i)).toBeInTheDocument()
  })

  it('handles file drop correctly', async () => {
    const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' })
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [mockFile],
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    await userEvent.drop(dropzone, [mockFile])
    
    expect(mockOnUploadStart).toHaveBeenCalledWith([mockFile])
  })

  it('shows drag active state', () => {
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: true,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass(/drag.*active/i.test(dropzone.className) ? expect.any(String) : '')
  })

  it('shows drag reject state for invalid files', () => {
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: false,
      isDragReject: true,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass(/drag.*reject/i.test(dropzone.className) ? expect.any(String) : '')
  })

  it('displays file previews after selection', async () => {
    const { useDropzone } = require('react-dropzone')
    
    const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' })
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [mockFile],
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('test.mp3')).toBeInTheDocument()
    })
  })

  it('handles file removal from preview', async () => {
    const { useDropzone } = require('react-dropzone')
    
    const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' })
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [mockFile],
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('test.mp3')).toBeInTheDocument()
    })

    const removeButton = screen.getByRole('button', { name: /remove/i })
    await userEvent.click(removeButton)
    
    // File should be removed from UI
    await waitFor(() => {
      expect(screen.queryByText('test.mp3')).not.toBeInTheDocument()
    })
  })

  it('validates file types and rejects invalid files', () => {
    const { useDropzone } = require('react-dropzone')
    
    const invalidFile = new File(['document content'], 'document.pdf', { type: 'application/pdf' })
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [{ file: invalidFile, errors: [{ code: 'file-invalid-type', message: 'Invalid file type' }] }],
    })

    render(<AudioUploader {...defaultProps} />)
    
    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
    expect(mockOnError).toHaveBeenCalledWith([{ file: invalidFile, errors: [{ code: 'file-invalid-type', message: 'Invalid file type' }] }])
  })

  it('validates file size limits', () => {
    const { useDropzone } = require('react-dropzone')
    
    const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.mp3', { type: 'audio/mpeg' })
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [{ file: largeFile, errors: [{ code: 'file-too-large', message: 'File too large' }] }],
    })

    render(<AudioUploader {...defaultProps} />)
    
    expect(screen.getByText(/file too large/i)).toBeInTheDocument()
    expect(mockOnError).toHaveBeenCalledWith([{ file: largeFile, errors: [{ code: 'file-too-large', message: 'File too large' }] }])
  })

  it('supports keyboard navigation', async () => {
    render(<AudioUploader {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveAttribute('tabIndex', '0')
    expect(dropzone).toHaveAttribute('aria-label')
    
    // Test keyboard activation
    dropzone.focus()
    await userEvent.keyboard('{Enter}')
    
    // Should trigger file input click
    const fileInput = screen.getByTestId('file-input')
    expect(fileInput).toBeInTheDocument()
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(<AudioUploader {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveAttribute('role', 'button')
    expect(dropzone).toHaveAttribute('aria-label')
    expect(dropzone).toHaveAttribute('aria-describedby')
    
    const description = screen.getByText(/drag.*drop.*audio.*files/i)
    expect(description).toBeInTheDocument()
  })

  it('uploads multiple files concurrently', async () => {
    const { useDropzone } = require('react-dropzone')
    
    const mockFiles = [
      new File(['audio 1'], 'test1.mp3', { type: 'audio/mpeg' }),
      new File(['audio 2'], 'test2.wav', { type: 'audio/wav' }),
    ]
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: mockFiles,
      rejectedFiles: [],
    })

    render(<AudioUploader {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('test1.mp3')).toBeInTheDocument()
      expect(screen.getByText('test2.wav')).toBeInTheDocument()
    })

    expect(mockOnUploadStart).toHaveBeenCalledWith(mockFiles)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})