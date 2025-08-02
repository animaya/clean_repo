'use client'

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
            card: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-300',
            socialButtonsBlockButton: 'border border-white/20 bg-white/10 text-white hover:bg-white/20',
            formFieldLabel: 'text-white',
            formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-gray-300',
            footerActionLink: 'text-purple-300 hover:text-purple-200'
          }
        }}
      />
    </div>
  )
}