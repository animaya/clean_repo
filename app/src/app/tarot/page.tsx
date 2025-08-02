"use client";

import { useState } from "react";
import { useUser, SignOutButton } from '@clerk/nextjs';

interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversedMeaning: string;
  suit?: string;
  type: "major" | "minor";
}

const TAROT_CARDS: TarotCard[] = [
  { id: 0, name: "The Fool", meaning: "New beginnings, innocence, spontaneity", reversedMeaning: "Recklessness, foolishness, risk-taking", type: "major" },
  { id: 1, name: "The Magician", meaning: "Manifestation, resourcefulness, power", reversedMeaning: "Manipulation, poor planning, untapped talents", type: "major" },
  { id: 2, name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine", reversedMeaning: "Secrets, disconnected from intuition, withdrawal", type: "major" },
  { id: 3, name: "The Empress", meaning: "Femininity, beauty, nature, abundance", reversedMeaning: "Creative block, dependence on others", type: "major" },
  { id: 4, name: "The Emperor", meaning: "Authority, establishment, structure, father figure", reversedMeaning: "Domination, excessive control, lack of discipline", type: "major" },
  { id: 5, name: "The Hierophant", meaning: "Spiritual wisdom, religious beliefs, conformity", reversedMeaning: "Personal beliefs, freedom, challenging the status quo", type: "major" },
  { id: 6, name: "The Lovers", meaning: "Love, harmony, relationships, values alignment", reversedMeaning: "Self-love, disharmony, imbalance, misalignment", type: "major" },
  { id: 7, name: "The Chariot", meaning: "Control, willpower, success, determination", reversedMeaning: "Self-discipline, opposition, lack of direction", type: "major" },
  { id: 8, name: "Strength", meaning: "Strength, courage, persuasion, influence", reversedMeaning: "Self doubt, low energy, raw emotion", type: "major" },
  { id: 9, name: "The Hermit", meaning: "Soul searching, introspection, being alone", reversedMeaning: "Isolation, loneliness, withdrawal", type: "major" },
  { id: 10, name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny", reversedMeaning: "Bad luck, lack of control, clinging to control", type: "major" },
  { id: 11, name: "Justice", meaning: "Justice, fairness, truth, cause and effect", reversedMeaning: "Unfairness, lack of accountability, dishonesty", type: "major" },
  { id: 12, name: "The Hanged Man", meaning: "Suspension, restriction, letting go", reversedMeaning: "Delays, resistance, stalling", type: "major" },
  { id: 13, name: "Death", meaning: "Endings, beginnings, change, transformation", reversedMeaning: "Resistance to change, personal transformation", type: "major" },
  { id: 14, name: "Temperance", meaning: "Balance, moderation, patience, purpose", reversedMeaning: "Imbalance, excess, self-healing", type: "major" },
  { id: 15, name: "The Devil", meaning: "Shadow self, attachment, addiction", reversedMeaning: "Releasing limiting beliefs, exploring dark thoughts", type: "major" },
  { id: 16, name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation", reversedMeaning: "Personal transformation, fear of change", type: "major" },
  { id: 17, name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality", reversedMeaning: "Lack of faith, despair, self-trust", type: "major" },
  { id: 18, name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious", reversedMeaning: "Release of fear, unhappiness, confusion", type: "major" },
  { id: 19, name: "The Sun", meaning: "Positivity, fun, warmth, success, vitality", reversedMeaning: "Inner child, feeling down, overly optimistic", type: "major" },
  { id: 20, name: "Judgement", meaning: "Judgement, rebirth, inner calling", reversedMeaning: "Self-doubt, inner critic, ignoring the call", type: "major" },
  { id: 21, name: "The World", meaning: "Completion, integration, accomplishment", reversedMeaning: "Seeking personal closure, short-cut to success", type: "major" },
];

export default function TarotGame() {
  const { user, isLoaded } = useUser();
  const [deck, setDeck] = useState<TarotCard[]>(TAROT_CARDS);
  const [pulledCard, setPulledCard] = useState<TarotCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your destiny...</div>
      </div>
    );
  }

  const pullCard = () => {
    if (deck.length === 0 || pulledCard || isAnimating) return;
    
    setIsAnimating(true);
    const randomIndex = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[randomIndex];
    const newDeck = deck.filter((_, index) => index !== randomIndex);
    
    setTimeout(() => {
      setDeck(newDeck);
      setPulledCard(selectedCard);
      setIsFlipped(false);
      setIsAnimating(false);
    }, 300);
  };

  const flipCard = () => {
    if (!pulledCard || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setIsAnimating(false);
    }, 150);
  };

  const pushCardBack = () => {
    if (!pulledCard || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setDeck([...deck, pulledCard]);
      setPulledCard(null);
      setIsFlipped(false);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* User Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Welcome, {user?.firstName || 'Seeker'}</h1>
            <p className="text-purple-200">The cards await your destiny...</p>
          </div>
          <SignOutButton>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-screen flex gap-6">
        {/* Left Sidebar - Controls (1/3) */}
        <div className="w-1/3 flex flex-col justify-center gap-8 p-6">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            ✨ Mystic Tarot ✨
          </h1>
          
          <button
            onClick={pullCard}
            disabled={pulledCard !== null || deck.length === 0 || isAnimating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            🔮 Pull Card from Deck
          </button>
          
          <button
            onClick={flipCard}
            disabled={!pulledCard || isAnimating}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            🃏 Flip Card & Reveal Meaning
          </button>
          
          <button
            onClick={pushCardBack}
            disabled={!pulledCard || isAnimating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            ↩️ Push Card Back to Deck
          </button>
          
          <div className="text-white text-center mt-8">
            <p className="text-lg">Cards in deck: {deck.length}</p>
          </div>
        </div>

        {/* Right Section - Card Display (2/3) */}
        <div className="w-2/3 flex flex-col gap-8 p-6">
          {/* Deck Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Card Deck</h2>
              <div className="relative w-40 h-60">
                {/* Deck stack effect */}
                {deck.length > 0 && (
                  <>
                    <div className="absolute w-full h-full bg-purple-800 rounded-lg shadow-lg transform rotate-2 translate-x-2 translate-y-2"></div>
                    <div className="absolute w-full h-full bg-purple-700 rounded-lg shadow-lg transform rotate-1 translate-x-1 translate-y-1"></div>
                    <div className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-xl flex items-center justify-center border-2 border-purple-400">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">🔮</div>
                        <div className="text-sm font-semibold">{deck.length} Cards</div>
                      </div>
                    </div>
                  </>
                )}
                {deck.length === 0 && (
                  <div className="w-full h-full border-4 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Empty Deck</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pulled Card Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Pulled Card</h2>
              {pulledCard ? (
                <div 
                  className={`w-48 h-72 transition-all duration-500 transform ${
                    isAnimating ? 'scale-110' : 'scale-100'
                  } ${isFlipped ? 'rotateY-180' : ''}`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Card Front */}
                  <div 
                    className={`absolute w-full h-full bg-gradient-to-br from-gold-400 to-yellow-600 rounded-lg shadow-xl border-4 border-yellow-400 flex flex-col items-center justify-center p-4 ${
                      isFlipped ? 'opacity-0' : 'opacity-100'
                    } transition-opacity duration-300`}
                  >
                    <div className="text-6xl mb-4">🃏</div>
                    <h3 className="text-xl font-bold text-purple-900 text-center">{pulledCard.name}</h3>
                    <p className="text-sm text-purple-800 mt-2">{pulledCard.type === "major" ? "Major Arcana" : "Minor Arcana"}</p>
                  </div>
                  
                  {/* Card Back (Meaning) */}
                  <div 
                    className={`absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-xl border-4 border-indigo-400 flex flex-col items-center justify-center p-4 ${
                      isFlipped ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-300`}
                  >
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className="text-lg font-bold text-white text-center mb-3">{pulledCard.name}</h3>
                    <div className="text-center text-white text-sm">
                      <p className="font-semibold mb-2">Meaning:</p>
                      <p className="leading-relaxed">{pulledCard.meaning}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-72 border-4 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No card pulled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}