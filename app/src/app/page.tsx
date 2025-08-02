"use client";

import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import MysticalLoader from './components/MysticalLoader';

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <MysticalLoader message="Awakening the mystical realm..." />;
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-6">
              ✨ Welcome Back, {user?.firstName || 'Seeker'} ✨
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Your destiny awaits. The mystical tarot cards are ready to reveal the secrets of your future.
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-8">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Spiritual Journey Continues</h2>
            <p className="text-purple-200 mb-6">
              The cards have been waiting for your return. Step into the realm of ancient wisdom 
              and let the tarot guide you through the mysteries that lie ahead.
            </p>
            
            <Link href="/tarot">
              <button className="mystical-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg border-2 border-purple-400/50 hover:border-purple-300/70">
                🎴 Enter the Tarot Realm
              </button>
            </Link>
          </div>

          <div className="text-purple-300 text-sm">
            <p>Ready to explore deeper mysteries? Your personalized reading awaits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-6">
            🔮 Mystic Tarot 🔮
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Unlock the Secrets of Your Destiny
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 mb-8">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Authorization Required</h2>
          <p className="text-purple-200 mb-6">
            The ancient tarot cards hold powerful secrets about your destiny, but their wisdom 
            is reserved for authenticated seekers only. Sign in to unlock personalized readings 
            and discover what the universe has planned for your journey.
          </p>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">🌟 What Awaits You:</h3>
              <ul className="text-purple-200 text-left space-y-1">
                <li>• Personalized tarot card readings</li>
                <li>• Interactive card pulling experience</li>
                <li>• Detailed meanings and interpretations</li>
                <li>• Guidance for your spiritual journey</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="mystical-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-2 border-purple-400/50 hover:border-purple-300/70">
                  🔑 Sign In to Your Destiny
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="mystical-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-2 border-blue-400/50 hover:border-blue-300/70">
                  ✨ Create Your Mystical Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>

        <div className="text-purple-300 text-sm">
          <p>Join thousands of seekers who have discovered their path through the wisdom of tarot</p>
        </div>
      </div>
    </div>
  );
}
