import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import DropZone from '@/components/DropZone'

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(),
}))

describe('DropZone', () => {
  const mockOnFilesDrop = vi.fn()
  const mockOnFileReject = vi.fn()

  const defaultProps = {
    onFilesDrop: mockOnFilesDrop,
    onFileReject: mockOnFileReject,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.flac'] },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default styling', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('border-dashed')
    expect(dropzone).toHaveClass('border-gray-300')
  })

  it('shows active drag state', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: true,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('border-blue-400')
    expect(dropzone).toHaveClass('bg-blue-50')
  })

  it('shows reject drag state', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: false,
      isDragReject: true,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('border-red-400')
    expect(dropzone).toHaveClass('bg-red-50')
  })

  it('displays custom content when provided', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    const customContent = <div data-testid="custom-content">Custom Drop Zone Content</div>

    render(<DropZone {...defaultProps}>{customContent}</DropZone>)
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Drop Zone Content')).toBeInTheDocument()
  })

  it('handles file acceptance correctly', async () => {
    const { useDropzone } = require('react-dropzone')
    
    const mockFiles = [
      new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' }),
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

    render(<DropZone {...defaultProps} />)
    
    expect(mockOnFilesDrop).toHaveBeenCalledWith(mockFiles)
  })

  it('handles file rejection correctly', async () => {
    const { useDropzone } = require('react-dropzone')
    
    const rejectedFiles = [
      {
        file: new File(['invalid'], 'test.txt', { type: 'text/plain' }),
        errors: [{ code: 'file-invalid-type', message: 'File type not accepted' }],
      },
    ]
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles,
    })

    render(<DropZone {...defaultProps} />)
    
    expect(mockOnFileReject).toHaveBeenCalledWith(rejectedFiles)
  })

  it('is keyboard accessible', async () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({
        'data-testid': 'dropzone',
        tabIndex: 0,
        onKeyDown: vi.fn(),
      }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveAttribute('tabIndex', '0')
    
    // Test keyboard navigation
    dropzone.focus()
    expect(dropzone).toHaveFocus()
  })

  it('shows focus state on keyboard focus', async () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    dropzone.focus()
    
    expect(dropzone).toHaveClass('focus:outline-none')
    expect(dropzone).toHaveClass('focus:ring-2')
  })

  it('has proper ARIA attributes', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveAttribute('role', 'button')
    expect(dropzone).toHaveAttribute('aria-label')
  })

  it('responds to responsive design breakpoints', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    
    // Check responsive classes are present
    const classNames = dropzone.className
    expect(classNames).toMatch(/xs:|sm:|md:|lg:/)
  })

  it('supports disabled state', () => {
    const { useDropzone } = await import('react-dropzone')
    const mockUseDropzone = vi.mocked(useDropzone)
    
    mockUseDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      rejectedFiles: [],
    })

    render(<DropZone {...defaultProps} disabled />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('cursor-not-allowed')
    expect(dropzone).toHaveClass('opacity-50')
  })
})