"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from '@clerk/nextjs';
import CosmicBackground from '../components/CosmicBackground';
import PersonalizedEnvironment from '../components/PersonalizedEnvironment';
import VisualStorytellingFramework from '../components/VisualStorytellingFramework';
import MysticalLoader from '../components/MysticalLoader';

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
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [flipStage, setFlipStage] = useState<'idle' | 'preparation' | 'transformation' | 'revelation'>('idle');
  const [userReadingCount, setUserReadingCount] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Load user reading history on mount
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`tarot_history_${user.id}`);
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setUserReadingCount(history.length);
        setIsFirstVisit(false);
      }
    }
  }, [user]);

  if (!isLoaded) {
    return <MysticalLoader message="Loading your destiny..." />;
  }

  const pullCard = () => {
    if (deck.length === 0 || pulledCard || isAnimating) return;
    
    setIsAnimating(true);
    
    // Stage 1: Deck glows and prepares
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const selectedCard = deck[randomIndex];
      const newDeck = deck.filter((_, index) => index !== randomIndex);
      
      // Stage 2: Card is drawn with energy effects
      setTimeout(() => {
        setDeck(newDeck);
        setPulledCard(selectedCard);
        setIsFlipped(false);
        
        // Record reading for personalized environment
        if ((window as any).recordTarotReading) {
          (window as any).recordTarotReading(selectedCard.id, selectedCard.type);
        }
        
        // Trigger storytelling events
        if ((window as any).triggerStoryEvent) {
          if (userReadingCount === 0) {
            (window as any).triggerStoryEvent('first_reading');
          } else {
            (window as any).triggerStoryEvent('card_draw');
          }
        }
        
        setUserReadingCount(prev => prev + 1);
        
        // Stage 3: Animation completes
        setTimeout(() => {
          setIsAnimating(false);
        }, 200);
      }, 300);
    }, 500);
  };

  const flipCard = () => {
    if (!pulledCard || isAnimating) return;
    setIsAnimating(true);
    
    // Stage 1: Preparation - Card glows, environment dims (300ms)
    setFlipStage('preparation');
    setTimeout(() => {
      // Stage 2: Transformation - 3D flip with particle trail (400ms)
      setFlipStage('transformation');
      setTimeout(() => {
        setIsFlipped(!isFlipped);
        
        // Stage 3: Revelation - Dramatic light burst, meaning appears gradually (300ms)
        setFlipStage('revelation');
        
        // Trigger card flip storytelling
        if ((window as any).triggerStoryEvent) {
          (window as any).triggerStoryEvent('card_flip');
        }
        
        setTimeout(() => {
          setFlipStage('idle');
          setIsAnimating(false);
        }, 300);
      }, 400);
    }, 300);
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
    <div className="min-h-screen relative overflow-hidden p-6" id="main-content">
      {/* Personalized Environment with Cosmic Overlay */}
      <PersonalizedEnvironment />
      <CosmicBackground />
      
      {/* Visual Storytelling Framework */}
      <VisualStorytellingFramework 
        userReadingCount={userReadingCount}
        lastCardType={pulledCard?.type}
        isFirstVisit={isFirstVisit}
      />
      {/* User Header */}
      <div className="relative max-w-7xl mx-auto mb-6 z-10">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">Welcome, {user?.firstName || 'Seeker'}</h1>
            <p className="text-purple-200 text-lg italic">The ancient cards await your destiny...</p>
          </div>
          <SignOutButton>
            <button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-500/30">
              ⛤ Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row gap-6 z-10">
        {/* Controls Section - Full width on mobile, 1/3 on desktop */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4 lg:gap-8 p-3 lg:p-6">
          <div className="text-center mb-4 lg:mb-8">
            <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl mb-2 lg:mb-4">
              ✨ Mystic Tarot ✨
            </h1>
            <div className="text-purple-300 text-base lg:text-lg font-semibold">
              ☆ Divine Revelations Await ☆
            </div>
          </div>
          
          <button
            onClick={pullCard}
            disabled={pulledCard !== null || deck.length === 0 || isAnimating}
            onMouseEnter={() => setIsDeckHovered(true)}
            onMouseLeave={() => setIsDeckHovered(false)}
            className="mystical-button relative bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 lg:py-6 px-6 lg:px-8 rounded-2xl text-lg lg:text-xl shadow-2xl border-2 border-purple-400/50 hover:border-purple-300/70 disabled:border-gray-600/30 group"
            aria-label="Draw a mystical tarot card from the sacred deck"
            data-action="draw-card"
            data-focus-id="draw-button"
          >
            {/* Mystical glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">🔮</span>
              <span>Draw from the Arcane Deck</span>
              <span className="text-xl">✧</span>
            </div>
          </button>
          
          <button
            onClick={flipCard}
            disabled={!pulledCard || isAnimating}
            className="mystical-button relative bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-800 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 lg:py-6 px-6 lg:px-8 rounded-2xl text-lg lg:text-xl shadow-2xl border-2 border-cyan-400/50 hover:border-cyan-300/70 disabled:border-gray-600/30 group"
            aria-label="Flip the drawn card to reveal its cosmic wisdom"
            data-action="flip-card"
            data-focus-id="flip-button"
          >
            {/* Mystical glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">⚹</span>
              <span>Unveil the Mystery</span>
              <span className="text-xl">✨</span>
            </div>
          </button>
          
          <button
            onClick={pushCardBack}
            disabled={!pulledCard || isAnimating}
            className="mystical-button relative bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 lg:py-6 px-6 lg:px-8 rounded-2xl text-lg lg:text-xl shadow-2xl border-2 border-emerald-400/50 hover:border-emerald-300/70 disabled:border-gray-600/30 group"
            aria-label="Return the card to the mystical deck"
            data-action="return-card"
            data-focus-id="return-button"
          >
            {/* Mystical glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-2xl animate-pulse">♾</span>
              <span>Return to the Void</span>
              <span className="text-xl">↺</span>
            </div>
          </button>
          
          <div className="text-center mt-4 lg:mt-8 bg-black/30 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-purple-400/30">
            <div className="text-purple-300 text-lg font-semibold mb-2">
              ★ Ancient Deck Status ★
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent">
              {deck.length} Sacred Cards Remain
            </p>
            <div className="text-purple-400 text-sm mt-1">
              ☆ {deck.length === 22 ? "The Deck is Complete" : deck.length > 10 ? "Many Mysteries Await" : deck.length > 0 ? "Few Secrets Left" : "The Void Consumes All"} ☆
            </div>
          </div>
        </div>

        {/* Card Display Section - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 lg:gap-8 p-3 lg:p-6">
          {/* Deck Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent text-center mb-4 lg:mb-8 drop-shadow-lg">
                ★ The Arcane Deck ★
              </h2>
              <div className="relative w-40 h-60 lg:w-48 lg:h-72 card-stack mx-auto">
                {/* Energy effects during animation or hover */}
                {(isAnimating || isDeckHovered) && (
                  <>
                    <div className="absolute -inset-8 pointer-events-none">
                      <div className="absolute w-2 h-2 bg-purple-400/80 rounded-full energy-particle" style={{top: '20%', left: '20%', animationDelay: '0s'}}></div>
                      <div className="absolute w-1 h-1 bg-blue-300/90 rounded-full energy-particle" style={{top: '80%', left: '80%', animationDelay: '0.5s'}}></div>
                      <div className="absolute w-3 h-3 bg-indigo-400/70 rounded-full energy-particle" style={{top: '30%', right: '20%', animationDelay: '1s'}}></div>
                      <div className="absolute w-1 h-1 bg-purple-300/80 rounded-full energy-particle" style={{bottom: '30%', left: '30%', animationDelay: '0.3s'}}></div>
                      <div className="absolute w-2 h-2 bg-cyan-400/60 rounded-full energy-particle" style={{top: '60%', right: '40%', animationDelay: '0.8s'}}></div>
                      <div className="absolute w-1 h-1 bg-yellow-400/70 rounded-full energy-particle" style={{bottom: '60%', left: '60%', animationDelay: '0.2s'}}></div>
                    </div>
                  </>
                )}
                
                {/* Enhanced deck stack effect */}
                {deck.length > 0 && (
                  <>
                    {/* Multiple stacked cards for depth */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-2xl transform rotate-3 translate-x-3 translate-y-3 border-2 border-purple-600/50"></div>
                    <div className="absolute w-full h-full bg-gradient-to-br from-purple-800 to-indigo-800 rounded-2xl shadow-2xl transform rotate-2 translate-x-2 translate-y-2 border-2 border-purple-500/60"></div>
                    <div className="absolute w-full h-full bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl shadow-2xl transform rotate-1 translate-x-1 translate-y-1 border-2 border-purple-400/70"></div>
                    
                    {/* Top card with mystical design */}
                    <div className={`absolute w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 ${isAnimating ? 'border-yellow-300 animate-ping' : isDeckHovered ? 'border-yellow-300/80' : 'border-yellow-400/60'} relative overflow-hidden ${isAnimating ? 'animate-pulse' : isDeckHovered ? 'animate-pulse' : 'animate-mystical-pulse'} transition-all duration-300`}>
                      {/* Ornate border pattern */}
                      <div className="absolute inset-2 border-2 border-yellow-300/40 rounded-xl"></div>
                      <div className="absolute inset-4 border border-purple-300/30 rounded-lg"></div>
                      
                      {/* Center mystical symbol */}
                      <div className="text-center text-yellow-200 relative z-10">
                        <div className="text-6xl mb-3 animate-pulse drop-shadow-2xl filter">🔮</div>
                        <div className="text-lg font-bold mb-1 text-yellow-100">TAROT</div>
                        <div className="text-sm font-semibold text-purple-200">{deck.length} Cards</div>
                      </div>
                      
                      {/* Corner decorations */}
                      <div className="absolute top-3 left-3 text-yellow-400/60 text-xl">✦</div>
                      <div className="absolute top-3 right-3 text-yellow-400/60 text-xl">✧</div>
                      <div className="absolute bottom-3 left-3 text-yellow-400/60 text-xl">★</div>
                      <div className="absolute bottom-3 right-3 text-yellow-400/60 text-xl">☆</div>
                      
                      {/* Mystical glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-400/10 to-transparent animate-pulse"></div>
                    </div>
                  </>
                )}
                {deck.length === 0 && (
                  <div className="w-full h-full border-4 border-dashed border-purple-500/50 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-purple-400 text-4xl mb-2">⚰</div>
                      <span className="text-purple-300 text-lg font-semibold">The Void Awaits</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pulled Card Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent mb-4 lg:mb-8 drop-shadow-lg">
                ✨ Card of Destiny ✨
              </h2>
              {pulledCard ? (
                <div className="relative">
                  {/* Flip transformation particles */}
                  {flipStage === 'transformation' && (
                    <div className="absolute -inset-12 pointer-events-none z-10">
                      <div className="absolute w-3 h-3 bg-yellow-400/80 rounded-full energy-particle" style={{top: '10%', left: '10%', animationDelay: '0s'}}></div>
                      <div className="absolute w-2 h-2 bg-purple-400/90 rounded-full energy-particle" style={{top: '20%', right: '15%', animationDelay: '0.1s'}}></div>
                      <div className="absolute w-4 h-4 bg-blue-300/70 rounded-full energy-particle" style={{bottom: '20%', left: '20%', animationDelay: '0.2s'}}></div>
                      <div className="absolute w-2 h-2 bg-cyan-400/80 rounded-full energy-particle" style={{bottom: '10%', right: '10%', animationDelay: '0.15s'}}></div>
                      <div className="absolute w-3 h-3 bg-indigo-400/60 rounded-full energy-particle" style={{top: '50%', left: '5%', animationDelay: '0.3s'}}></div>
                      <div className="absolute w-2 h-2 bg-pink-400/70 rounded-full energy-particle" style={{top: '60%', right: '5%', animationDelay: '0.25s'}}></div>
                    </div>
                  )}
                  
                <div 
                  className={`w-48 h-72 lg:w-56 lg:h-84 transform-gpu cursor-pointer mx-auto ${
                    flipStage === 'preparation' ? 'card-flip-preparation' :
                    flipStage === 'transformation' ? 'card-flip-transformation' :
                    flipStage === 'revelation' ? 'card-flip-revelation' :
                    'transition-all duration-300 hover:scale-105'
                  }`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1200px'
                  }}
                  onClick={flipCard}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    pulledCard && (window as any).generateMysticalAltText 
                      ? (window as any).generateMysticalAltText(pulledCard.name, pulledCard.meaning, isFlipped)
                      : `Tarot card ${isFlipped ? 'showing meaning' : 'face down, click to reveal'}`
                  }
                  data-focus-id="tarot-card"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      flipCard();
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Card Front - Ornate Design */}
                  <div 
                    className={`absolute w-full h-full rounded-3xl shadow-2xl transition-all duration-700 transform ${
                      isFlipped ? 'rotateY-180 opacity-0' : 'rotateY-0 opacity-100'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Main card background */}
                    <div className="w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-3xl border-4 border-yellow-200 relative overflow-hidden">
                      {/* Ornate border patterns */}
                      <div className="absolute inset-3 border-4 border-yellow-500/60 rounded-2xl"></div>
                      <div className="absolute inset-6 border-2 border-yellow-600/40 rounded-xl"></div>
                      
                      {/* Corner decorative elements */}
                      <div className="absolute top-4 left-4 text-purple-800 text-2xl">✦</div>
                      <div className="absolute top-4 right-4 text-purple-800 text-2xl">✧</div>
                      <div className="absolute bottom-4 left-4 text-purple-800 text-2xl">★</div>
                      <div className="absolute bottom-4 right-4 text-purple-800 text-2xl">☆</div>
                      
                      {/* Card content */}
                      <div className="flex flex-col items-center justify-center h-full p-6 relative z-10">
                        <div className="text-8xl mb-6 filter drop-shadow-2xl">
                          {pulledCard.id === 0 ? '🎠' : // The Fool
                           pulledCard.id === 1 ? '🧙' : // The Magician
                           pulledCard.id === 2 ? '🔮' : // High Priestess
                           pulledCard.id === 3 ? '👑' : // The Empress
                           pulledCard.id === 4 ? '💑' : // The Emperor
                           pulledCard.id === 5 ? '⛪' : // The Hierophant
                           pulledCard.id === 6 ? '❤️' : // The Lovers
                           pulledCard.id === 7 ? '🏇' : // The Chariot
                           pulledCard.id === 8 ? '🦁' : // Strength
                           pulledCard.id === 9 ? '🕯️' : // The Hermit
                           pulledCard.id === 10 ? '☸️' : // Wheel of Fortune
                           pulledCard.id === 11 ? '⚖️' : // Justice
                           pulledCard.id === 12 ? '🙇' : // The Hanged Man
                           pulledCard.id === 13 ? '☠️' : // Death
                           pulledCard.id === 14 ? '🌊' : // Temperance
                           pulledCard.id === 15 ? '👿' : // The Devil
                           pulledCard.id === 16 ? '🏰' : // The Tower
                           pulledCard.id === 17 ? '⭐' : // The Star
                           pulledCard.id === 18 ? '🌙' : // The Moon
                           pulledCard.id === 19 ? '☀️' : // The Sun
                           pulledCard.id === 20 ? '🎺' : // Judgement
                           '🌍'} {/* The World */}
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 text-center mb-2 drop-shadow-lg">{pulledCard.name}</h3>
                        <div className="bg-purple-800/20 px-4 py-2 rounded-xl border border-purple-700/30">
                          <p className="text-sm font-semibold text-purple-800">{pulledCard.type === "major" ? "Major Arcana" : "Minor Arcana"}</p>
                        </div>
                      </div>
                      
                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>
                    </div>
                  </div>
                  
                  {/* Card Back (Meaning) - Mystical Design */}
                  <div 
                    className={`absolute w-full h-full rounded-3xl shadow-2xl transition-all duration-700 transform ${
                      isFlipped ? 'rotateY-0 opacity-100' : 'rotateY-180 opacity-0'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-3xl border-4 border-purple-400 relative overflow-hidden">
                      {/* Mystical border patterns */}
                      <div className="absolute inset-3 border-4 border-purple-500/60 rounded-2xl"></div>
                      <div className="absolute inset-6 border-2 border-purple-400/40 rounded-xl"></div>
                      
                      {/* Floating mystical symbols */}
                      <div className="absolute top-6 left-6 text-purple-300/60 text-xl animate-pulse">✦</div>
                      <div className="absolute top-6 right-6 text-purple-300/60 text-xl animate-pulse" style={{animationDelay: '1s'}}>✧</div>
                      <div className="absolute bottom-6 left-6 text-purple-300/60 text-xl animate-pulse" style={{animationDelay: '2s'}}>⚶</div>
                      <div className="absolute bottom-6 right-6 text-purple-300/60 text-xl animate-pulse" style={{animationDelay: '0.5s'}}>◊</div>
                      
                      {/* Card meaning content */}
                      <div className="flex flex-col items-center justify-center h-full p-8 relative z-10">
                        <div className="text-6xl mb-4 animate-pulse filter drop-shadow-2xl">✨</div>
                        <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-lg">{pulledCard.name}</h3>
                        <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 max-w-full ${
                          flipStage === 'revelation' ? 'revelation-burst' : ''
                        }`}>
                          <p className="text-purple-200 font-semibold mb-3 text-center">★ Divine Meaning ★</p>
                          <p className="text-white text-sm leading-relaxed text-center">{pulledCard.meaning}</p>
                        </div>
                      </div>
                      
                      {/* Mystical glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-indigo-400/10 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                </div>
              ) : (
                <div className="w-48 h-72 lg:w-56 lg:h-84 border-4 border-dashed border-purple-500/50 rounded-3xl flex items-center justify-center bg-black/30 backdrop-blur-sm mx-auto">
                  <div className="text-center">
                    <div className="text-purple-400 text-6xl mb-4 animate-pulse">⚰</div>
                    <span className="text-purple-300 text-xl font-semibold">Awaiting Revelation</span>
                    <p className="text-purple-400 text-sm mt-2">✦ Draw a card to see your fate ✦</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}