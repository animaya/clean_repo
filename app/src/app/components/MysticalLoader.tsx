"use client";

import { useEffect, useState } from 'react';

interface MysticalLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const mysticalMessages = [
  "Consulting the cosmic energies...",
  "Aligning the spiritual frequencies...",
  "Preparing the sacred space...",
  "Channeling ancient wisdom...",
  "Opening the mystical portal...",
  "Gathering celestial insights...",
  "Awakening the tarot spirits...",
  "Invoking divine guidance..."
];

export default function MysticalLoader({ message, fullScreen = true }: MysticalLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(message || mysticalMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!message) {
      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % mysticalMessages.length);
      }, 2000);

      return () => clearInterval(messageInterval);
    }
  }, [message]);

  useEffect(() => {
    if (!message) {
      setCurrentMessage(mysticalMessages[messageIndex]);
    }
  }, [messageIndex, message]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const containerClass = fullScreen 
    ? "min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"
    : "flex items-center justify-center p-6";

  return (
    <div className={containerClass}>
      <div className="text-center relative">
        {/* Mystical circle animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full animate-spin-slow"></div>
            
            {/* Middle ring */}
            <div className="absolute inset-2 border-2 border-blue-400/40 rounded-full animate-spin-reverse"></div>
            
            {/* Inner pulsing core */}
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-pulse-slow flex items-center justify-center">
              <div className="text-4xl animate-gentle-float">🔮</div>
            </div>
            
            {/* Floating symbols around the circle */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-purple-400 text-xl animate-float" style={{animationDelay: '0s'}}>✦</div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-blue-400 text-lg animate-float" style={{animationDelay: '1s'}}>◊</div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-purple-400 text-xl animate-float" style={{animationDelay: '2s'}}>✧</div>
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-indigo-400 text-lg animate-float" style={{animationDelay: '3s'}}>⚶</div>
          </div>
          
          {/* Energy particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-2 h-2 bg-purple-400/60 rounded-full animate-ping" style={{top: '20%', left: '20%', animationDelay: '0s'}}></div>
            <div className="absolute w-1 h-1 bg-blue-300/70 rounded-full animate-ping" style={{top: '80%', left: '80%', animationDelay: '1s'}}></div>
            <div className="absolute w-3 h-3 bg-indigo-400/50 rounded-full animate-ping" style={{top: '30%', right: '20%', animationDelay: '2s'}}></div>
            <div className="absolute w-1 h-1 bg-purple-300/60 rounded-full animate-ping" style={{bottom: '30%', left: '30%', animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Loading message */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 max-w-md mx-auto">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
            ✨ Mystical Preparation ✨
          </h2>
          
          <p className="text-purple-200 text-lg mb-2">
            {currentMessage}
          </p>
          
          <div className="text-purple-400 text-xl font-mono min-h-[1.5rem]">
            {dots}
          </div>
          
          {/* Progress indication */}
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
        
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-full animate-pulse-slow -z-10"></div>
      </div>
    </div>
  );
}