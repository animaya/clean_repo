import { useEffect, useCallback } from 'react'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
  disabled?: boolean
}

interface UseKeyboardShortcutsOptions {
  enableGlobal?: boolean
  preventDefaultOnMatch?: boolean
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enableGlobal = true, preventDefaultOnMatch = true } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in inputs
    const activeElement = document.activeElement
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.hasAttribute('contenteditable')
    )

    // Allow shortcuts in inputs only for specific cases (like Escape)
    if (isTyping && !['Escape', 'Enter'].includes(event.key)) {
      return
    }

    for (const shortcut of shortcuts) {
      if (shortcut.disabled) continue

      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey
      const metaMatches = !!shortcut.metaKey === event.metaKey
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey
      const altMatches = !!shortcut.altKey === event.altKey

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        if (preventDefaultOnMatch) {
          event.preventDefault()
        }
        shortcut.action()
        break
      }
    }
  }, [shortcuts, preventDefaultOnMatch])

  useEffect(() => {
    if (!enableGlobal) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enableGlobal])

  return { shortcuts }
}

// Common keyboard shortcuts for upload interface
export const createUploadShortcuts = (actions: {
  onOpenFileDialog?: () => void
  onClearAll?: () => void
  onRetryFailed?: () => void
  onToggleUrlInput?: () => void
  onFocusUrlInput?: () => void
}): ShortcutConfig[] => [
  {
    key: 'o',
    ctrlKey: true,
    action: actions.onOpenFileDialog || (() => {}),
    description: 'Open file dialog (Ctrl+O)',
    disabled: !actions.onOpenFileDialog,
  },
  {
    key: 'Delete',
    shiftKey: true,
    action: actions.onClearAll || (() => {}),
    description: 'Clear all files (Shift+Delete)',
    disabled: !actions.onClearAll,
  },
  {
    key: 'r',
    ctrlKey: true,
    action: actions.onRetryFailed || (() => {}),
    description: 'Retry failed uploads (Ctrl+R)',
    disabled: !actions.onRetryFailed,
  },
  {
    key: 'u',
    ctrlKey: true,
    action: actions.onToggleUrlInput || (() => {}),
    description: 'Toggle URL input (Ctrl+U)',
    disabled: !actions.onToggleUrlInput,
  },
  {
    key: 'l',
    ctrlKey: true,
    action: actions.onFocusUrlInput || (() => {}),
    description: 'Focus URL input (Ctrl+L)',
    disabled: !actions.onFocusUrlInput,
  },
]