"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  voiceCommands: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export default function AccessibilityEnhancements({ children }: AccessibilityEnhancementsProps) {
  const { user } = useUser();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
    voiceCommands: false,
    keyboardNavigation: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string>('');

  // Load accessibility preferences
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`accessibility_${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }));
    }
  }, [user]);

  // Save settings
  const saveSettings = useCallback((newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    if (user) {
      localStorage.setItem(`accessibility_${user.id}`, JSON.stringify(newSettings));
    }
  }, [user]);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text mode
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }
  }, [settings]);

  // Voice commands
  useEffect(() => {
    if (!settings.voiceCommands) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      
      // Voice commands
      if (transcript.includes('draw card') || transcript.includes('pull card')) {
        const drawButton = document.querySelector('[data-action="draw-card"]') as HTMLButtonElement;
        if (drawButton && !drawButton.disabled) {
          drawButton.click();
          announceAction('Drawing a mystical card for your reading');
        }
      } else if (transcript.includes('flip card') || transcript.includes('reveal card')) {
        const flipButton = document.querySelector('[data-action="flip-card"]') as HTMLButtonElement;
        if (flipButton && !flipButton.disabled) {
          flipButton.click();
          announceAction('Revealing the cosmic wisdom of your chosen card');
        }
      } else if (transcript.includes('return card') || transcript.includes('put back')) {
        const returnButton = document.querySelector('[data-action="return-card"]') as HTMLButtonElement;
        if (returnButton && !returnButton.disabled) {
          returnButton.click();
          announceAction('Returning the card to the sacred deck');
        }
      } else if (transcript.includes('settings') || transcript.includes('options')) {
        setIsSettingsOpen(true);
        announceAction('Opening accessibility settings');
      }
    };

    recognition.onerror = (event: any) => {
      console.log('Speech recognition error:', event.error);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [settings.voiceCommands, isListening]);

  // Keyboard navigation
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes settings
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }

      // Space or Enter activates focused element
      if ((e.key === ' ' || e.key === 'Enter') && currentFocus) {
        const element = document.querySelector(`[data-focus-id="${currentFocus}"]`) as HTMLElement;
        if (element) {
          element.click();
          e.preventDefault();
        }
      }

      // Arrow key navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const focusableElements = Array.from(document.querySelectorAll('[data-focus-id]'));
        const currentIndex = focusableElements.findIndex(el => el.getAttribute('data-focus-id') === currentFocus);
        
        let nextIndex = currentIndex;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        }

        const nextElement = focusableElements[nextIndex] as HTMLElement;
        if (nextElement) {
          setCurrentFocus(nextElement.getAttribute('data-focus-id') || '');
          nextElement.focus();
          announceAction(`Focused on ${nextElement.getAttribute('aria-label') || 'interactive element'}`);
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, isSettingsOpen, currentFocus]);

  // Screen reader announcements
  const announceAction = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Generate mystical alt text for cards
  const generateMysticalAltText = (cardName: string, cardMeaning: string, isRevealed: boolean) => {
    if (!isRevealed) {
      return `Face-down tarot card, waiting to reveal its ancient wisdom. Click to unveil the cosmic message meant for you.`;
    }
    return `${cardName} tarot card revealed. The cosmic meaning: ${cardMeaning}. This ancient symbol speaks to your spiritual journey.`;
  };

  // Settings toggle component
  const SettingsToggle = () => (
    <button
      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      className="fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-sm text-white p-3 rounded-xl border border-purple-400/30 hover:bg-black/80 transition-all"
      aria-label="Open accessibility settings"
      data-focus-id="accessibility-settings"
    >
      ♿ Settings
    </button>
  );

  // Settings panel
  const SettingsPanel = () => (
    <div className={`fixed inset-0 z-50 ${isSettingsOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-900/90 backdrop-blur-md rounded-2xl p-8 border border-purple-400/50 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">✨ Accessibility Mysticism ✨</h2>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => saveSettings({ ...settings, highContrast: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>High Contrast Mystical Mode</span>
          </label>

          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => saveSettings({ ...settings, largeText: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Large Cosmic Text</span>
          </label>

          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => saveSettings({ ...settings, reducedMotion: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Gentle Spiritual Motion</span>
          </label>

          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              checked={settings.screenReaderOptimized}
              onChange={(e) => saveSettings({ ...settings, screenReaderOptimized: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Screen Reader Wisdom</span>
          </label>

          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              checked={settings.voiceCommands}
              onChange={(e) => saveSettings({ ...settings, voiceCommands: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Voice Commanded Divination</span>
          </label>

          {settings.voiceCommands && (
            <div className="ml-8 space-y-2">
              <p className="text-purple-200 text-sm">Say: "draw card", "flip card", "return card", "settings"</p>
              <button
                onClick={() => setIsListening(!isListening)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  isListening ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isListening ? '🎙️ Listening...' : '🎙️ Start Voice Commands'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="mystical-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-2 border-purple-400/50"
          >
            Close Sacred Settings
          </button>
        </div>
      </div>
    </div>
  );

  // Expose functions globally for use by other components
  useEffect(() => {
    (window as any).generateMysticalAltText = generateMysticalAltText;
    (window as any).announceAction = announceAction;
  }, []);

  return (
    <>
      {children}
      <SettingsToggle />
      <SettingsPanel />
      
      {/* Screen reader announcements area */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcements"></div>
      
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to mystical tarot reading
      </a>
    </>
  );
}