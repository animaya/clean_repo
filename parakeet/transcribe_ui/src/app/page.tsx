'use client'

import React from 'react'
import UploadInterface from '@/components/UploadInterface'

export default function Home() {
  const handleUploadComplete = (files: any[]) => {
    console.log('Upload completed:', files)
    // Here you would integrate with the transcription service
  }

  const handleError = (error: any) => {
    console.error('Upload error:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6
                       xs:px-6
                       sm:px-8
                       lg:px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900
                           xs:text-xl
                           sm:text-2xl
                           md:text-3xl
                           lg:text-4xl">
                Parakeet
              </h1>
              <p className="text-gray-600 mt-1
                           xs:text-sm
                           sm:text-base
                           md:text-lg">
                AI-Powered Audio Transcription
              </p>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Privacy-First • Local Processing
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8
                     xs:px-6 xs:py-6
                     sm:px-8 sm:py-10
                     lg:px-12 lg:py-16">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="text-center space-y-4 mb-12
                         xs:mb-8
                         sm:mb-10
                         md:mb-12">
            <h2 className="text-xl font-semibold text-gray-900
                         xs:text-lg
                         sm:text-xl
                         md:text-2xl">
              Upload Audio Files for Transcription
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed
                         xs:text-sm
                         sm:text-base
                         md:text-lg">
              Secure, privacy-first audio transcription using Nvidia's Parakeet ASR models. 
              All processing happens locally on your device - your audio never leaves your computer.
            </p>
          </div>

          {/* Upload Interface */}
          <div className="bg-white rounded-xl shadow-lg p-6
                         xs:p-4
                         sm:p-6
                         md:p-8
                         lg:p-10">
            <UploadInterface
              onUploadComplete={handleUploadComplete}
              onError={handleError}
              maxFiles={10}
              maxSize={100 * 1024 * 1024} // 100MB
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6 mt-12
                         xs:gap-4 xs:mt-8
                         sm:grid-cols-2 sm:gap-6 sm:mt-10
                         lg:grid-cols-3 lg:mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md
                           xs:p-4
                           sm:p-6">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy-First</h3>
              <p className="text-gray-600 text-sm">
                All audio processing happens locally on your device. No data is sent to servers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md
                           xs:p-4
                           sm:p-6">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Accurate</h3>
              <p className="text-gray-600 text-sm">
                Powered by Nvidia's Parakeet ASR models optimized for Apple Silicon.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md
                           xs:p-4
                           sm:p-6
                           sm:col-span-2
                           lg:col-span-1">
              <div className="text-2xl mb-3">🎵</div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-gray-600 text-sm">
                Supports MP3, WAV, M4A, FLAC and more. Automatic format conversion.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16
                       xs:mt-12
                       sm:mt-16
                       lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 py-8
                       xs:px-6 xs:py-6
                       sm:px-8 sm:py-8
                       lg:px-12">
          <div className="text-center text-sm text-gray-500">
            <p>Parakeet Audio Transcription • Built with Next.js and Tailwind CSS</p>
            <p className="mt-1">Powered by Nvidia Parakeet ASR Models via MLX</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
