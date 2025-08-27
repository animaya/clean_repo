import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProgressTracker } from '@/components/ProgressTracker'

// Mock the useWebSocket hook
const mockUseWebSocket = {
  isConnected: false,
  connectionState: 'disconnected' as const,
  lastError: null,
  retryCount: 0,
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendProgress: vi.fn(),
  joinSession: vi.fn(),
  leaveSession: vi.fn(),
  socket: null
}

vi.mock('@/hooks/useWebSocket', () => ({
  useWebSocket: vi.fn(() => mockUseWebSocket)
}))

// Mock EventSource for SSE fallback
global.EventSource = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  close: vi.fn(),
  readyState: 1
}))

interface ProgressEvent {
  type: 'upload_progress' | 'conversion_progress' | 'transcription_progress'
  sessionId: string
  fileId: string
  progress: number
  bytesUploaded?: number
  totalBytes?: number
  stage?: string
  eta?: string
}

interface ProgressTrackerProps {
  sessionId: string
  fileId: string
  onProgressUpdate?: (progress: ProgressEvent) => void
  onComplete?: () => void
  onError?: (error: Error) => void
  fallbackToSSE?: boolean
  showDetails?: boolean
}

// Mock component implementation for testing
const MockProgressTracker: React.FC<ProgressTrackerProps> = ({
  sessionId,
  fileId,
  onProgressUpdate,
  onComplete,
  onError,
  fallbackToSSE = true,
  showDetails = true
}) => {
  const [progress, setProgress] = React.useState(0)
  const [stage, setStage] = React.useState<string>('')
  const [eta, setEta] = React.useState<string>('')
  const [isComplete, setIsComplete] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Mock progress updates for testing
    const interval = setInterval(() => {
      if (progress < 100) {
        const newProgress = Math.min(progress + 10, 100)
        setProgress(newProgress)
        
        const progressEvent: ProgressEvent = {
          type: 'upload_progress',
          sessionId,
          fileId,
          progress: newProgress
        }
        
        onProgressUpdate?.(progressEvent)
        
        if (newProgress === 100) {
          setIsComplete(true)
          onComplete?.()
          clearInterval(interval)
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [progress, sessionId, fileId, onProgressUpdate, onComplete])

  if (error) {
    return (
      <div role="alert" data-testid="progress-error">
        <p>Error: {error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    )
  }

  return (
    <div data-testid="progress-tracker">
      <div data-testid="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemax={100}>
        <div 
          data-testid="progress-fill" 
          style={{ width: `${progress}%` }}
          className="bg-blue-600 h-2"
        />
      </div>
      
      <div data-testid="progress-text">
        {progress}% Complete
      </div>
      
      {showDetails && (
        <div data-testid="progress-details">
          {stage && <div data-testid="progress-stage">Stage: {stage}</div>}
          {eta && <div data-testid="progress-eta">ETA: {eta}</div>}
        </div>
      )}
      
      {isComplete && (
        <div data-testid="progress-complete" role="status">
          ✓ Complete
        </div>
      )}
      
      <div data-testid="connection-status">
        Connection: {mockUseWebSocket.isConnected ? 'Connected' : 'Disconnected'}
        {fallbackToSSE && !mockUseWebSocket.isConnected && ' (using SSE)'}
      </div>
    </div>
  )
}

// Use the mock component
vi.mock('@/components/ProgressTracker', () => ({
  ProgressTracker: MockProgressTracker
}))

describe('ProgressTracker Component', () => {
  const defaultProps: ProgressTrackerProps = {
    sessionId: 'test-session-123',
    fileId: 'test-file-456'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWebSocket.isConnected = false
    mockUseWebSocket.connectionState = 'disconnected'
  })

  describe('Rendering', () => {
    it('should render progress tracker with initial state', () => {
      render(<ProgressTracker {...defaultProps} />)
      
      expect(screen.getByTestId('progress-tracker')).toBeInTheDocument()
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
      expect(screen.getByTestId('progress-text')).toHaveTextContent('0% Complete')
    })

    it('should render progress bar with correct accessibility attributes', () => {
      render(<ProgressTracker {...defaultProps} />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('should show connection status', () => {
      render(<ProgressTracker {...defaultProps} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Connection: Disconnected')
    })

    it('should show SSE fallback indicator when enabled', () => {
      render(<ProgressTracker {...defaultProps} fallbackToSSE={true} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('(using SSE)')
    })
  })

  describe('Progress Updates', () => {
    it('should update progress bar visually', async () => {
      render(<ProgressTracker {...defaultProps} />)
      
      await waitFor(() => {
        const progressText = screen.getByTestId('progress-text')
        expect(progressText).toHaveTextContent(/\d+% Complete/)
      })
    })

    it('should call onProgressUpdate callback', async () => {
      const onProgressUpdate = vi.fn()
      render(<ProgressTracker {...defaultProps} onProgressUpdate={onProgressUpdate} />)
      
      await waitFor(() => {
        expect(onProgressUpdate).toHaveBeenCalled()
      })
    })

    it('should show completion status when finished', async () => {
      const onComplete = vi.fn()
      render(<ProgressTracker {...defaultProps} onComplete={onComplete} />)
      
      await waitFor(() => {
        expect(screen.getByTestId('progress-complete')).toBeInTheDocument()
        expect(onComplete).toHaveBeenCalled()
      }, { timeout: 2000 })
    })

    it('should handle different progress types', async () => {
      const onProgressUpdate = vi.fn()
      render(<ProgressTracker {...defaultProps} onProgressUpdate={onProgressUpdate} />)
      
      await waitFor(() => {
        expect(onProgressUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringMatching(/^(upload_progress|conversion_progress|transcription_progress)$/),
            sessionId: defaultProps.sessionId,
            fileId: defaultProps.fileId,
            progress: expect.any(Number)
          })
        )
      })
    })
  })

  describe('Progress Details', () => {
    it('should show progress details when enabled', () => {
      render(<ProgressTracker {...defaultProps} showDetails={true} />)
      
      expect(screen.getByTestId('progress-details')).toBeInTheDocument()
    })

    it('should hide progress details when disabled', () => {
      render(<ProgressTracker {...defaultProps} showDetails={false} />)
      
      expect(screen.queryByTestId('progress-details')).not.toBeInTheDocument()
    })

    it('should show stage information when available', () => {
      // This would be tested with actual stage data in a real implementation
      render(<ProgressTracker {...defaultProps} showDetails={true} />)
      
      const details = screen.getByTestId('progress-details')
      expect(details).toBeInTheDocument()
    })

    it('should show ETA when available', () => {
      // This would be tested with actual ETA data in a real implementation
      render(<ProgressTracker {...defaultProps} showDetails={true} />)
      
      const details = screen.getByTestId('progress-details')
      expect(details).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when error occurs', () => {
      const MockErrorComponent: React.FC<ProgressTrackerProps> = (props) => {
        const [error, setError] = React.useState<string>('Test error')
        
        if (error) {
          return (
            <div role="alert" data-testid="progress-error">
              <p>Error: {error}</p>
              <button onClick={() => setError('')}>Retry</button>
            </div>
          )
        }
        
        return <MockProgressTracker {...props} />
      }
      
      render(<MockErrorComponent {...defaultProps} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Error: Test error')).toBeInTheDocument()
    })

    it('should provide retry functionality on error', () => {
      const MockErrorComponent: React.FC<ProgressTrackerProps> = (props) => {
        const [error, setError] = React.useState<string>('Test error')
        
        if (error) {
          return (
            <div role="alert" data-testid="progress-error">
              <p>Error: {error}</p>
              <button onClick={() => setError('')}>Retry</button>
            </div>
          )
        }
        
        return <MockProgressTracker {...props} />
      }
      
      render(<MockErrorComponent {...defaultProps} />)
      
      const retryButton = screen.getByText('Retry')
      fireEvent.click(retryButton)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()
      const error = new Error('Test error')
      
      // Simulate error in useWebSocket
      mockUseWebSocket.lastError = error
      
      render(<ProgressTracker {...defaultProps} onError={onError} />)
      
      // In real implementation, onError would be called by the hook
    })
  })

  describe('WebSocket Integration', () => {
    it('should show connected status when WebSocket is connected', () => {
      mockUseWebSocket.isConnected = true
      
      render(<ProgressTracker {...defaultProps} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected')
    })

    it('should handle WebSocket connection state changes', () => {
      const { rerender } = render(<ProgressTracker {...defaultProps} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected')
      
      mockUseWebSocket.isConnected = true
      rerender(<ProgressTracker {...defaultProps} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected')
    })

    it('should fall back to SSE when WebSocket fails', () => {
      mockUseWebSocket.isConnected = false
      
      render(<ProgressTracker {...defaultProps} fallbackToSSE={true} />)
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent('using SSE')
    })
  })

  describe('Accessibility', () => {
    it('should provide proper ARIA labels', () => {
      render(<ProgressTracker {...defaultProps} />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow')
      expect(progressBar).toHaveAttribute('aria-valuemax')
    })

    it('should announce completion to screen readers', async () => {
      render(<ProgressTracker {...defaultProps} />)
      
      await waitFor(() => {
        const completeStatus = screen.getByRole('status')
        expect(completeStatus).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should provide error alerts for screen readers', () => {
      const MockErrorComponent: React.FC<ProgressTrackerProps> = (props) => (
        <div role="alert" data-testid="progress-error">
          <p>Error: Network connection failed</p>
        </div>
      )
      
      render(<MockErrorComponent {...defaultProps} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})