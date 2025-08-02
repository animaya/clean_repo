"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface ReadingHistory {
  cardId: number;
  timestamp: number;
  cardType: 'major' | 'minor';
}

interface EnvironmentTheme {
  name: string;
  backgroundGradient: string;
  particleColors: string[];
  symbolOpacity: number;
  energyIntensity: number;
}

const TIME_THEMES: Record<string, EnvironmentTheme> = {
  dawn: {
    name: "Dawn's Awakening",
    backgroundGradient: "from-purple-900 via-pink-800 to-orange-700",
    particleColors: ['#F59E0B', '#EC4899', '#8B5CF6'],
    symbolOpacity: 0.3,
    energyIntensity: 0.8
  },
  morning: {
    name: "Morning Light",
    backgroundGradient: "from-blue-800 via-purple-700 to-pink-600",
    particleColors: ['#3B82F6', '#8B5CF6', '#EC4899'],
    symbolOpacity: 0.25,
    energyIntensity: 0.7
  },
  midday: {
    name: "Radiant Sun",
    backgroundGradient: "from-yellow-600 via-orange-700 to-red-700",
    particleColors: ['#EAB308', '#F97316', '#DC2626'],
    symbolOpacity: 0.4,
    energyIntensity: 1.0
  },
  afternoon: {
    name: "Golden Hour",
    backgroundGradient: "from-amber-600 via-orange-600 to-purple-700",
    particleColors: ['#D97706', '#EA580C', '#7C3AED'],
    symbolOpacity: 0.35,
    energyIntensity: 0.9
  },
  evening: {
    name: "Twilight Mysteries",
    backgroundGradient: "from-indigo-900 via-purple-800 to-blue-900",
    particleColors: ['#4338CA', '#7C3AED', '#1E40AF'],
    symbolOpacity: 0.3,
    energyIntensity: 0.6
  },
  night: {
    name: "Midnight Cosmos",
    backgroundGradient: "from-slate-900 via-purple-950 to-black",
    particleColors: ['#6366F1', '#8B5CF6', '#A855F7'],
    symbolOpacity: 0.2,
    energyIntensity: 0.5
  },
  lateNight: {
    name: "Deep Night",
    backgroundGradient: "from-black via-slate-900 to-purple-950",
    particleColors: ['#4C1D95', '#581C87', '#6B21A8'],
    symbolOpacity: 0.15,
    energyIntensity: 0.4
  }
};

const SEASONAL_THEMES: Record<string, Partial<EnvironmentTheme>> = {
  spring: {
    particleColors: ['#10B981', '#34D399', '#6EE7B7'],
    symbolOpacity: 0.3
  },
  summer: {
    particleColors: ['#F59E0B', '#FBBF24', '#FCD34D'],
    energyIntensity: 1.2
  },
  autumn: {
    particleColors: ['#DC2626', '#F97316', '#92400E'],
    symbolOpacity: 0.4
  },
  winter: {
    particleColors: ['#1E40AF', '#3B82F6', '#60A5FA'],
    energyIntensity: 0.6
  }
};

const CARD_TYPE_INFLUENCES = {
  major: {
    energyBoost: 0.3,
    symbolBoost: 0.2,
    particleBoost: 0.4
  },
  minor: {
    energyBoost: 0.1,
    symbolBoost: 0.1,
    particleBoost: 0.2
  }
};

export default function PersonalizedEnvironment() {
  const { user } = useUser();
  const [currentTheme, setCurrentTheme] = useState<EnvironmentTheme>(TIME_THEMES.night);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Get current time-based theme
  const getTimeTheme = (): EnvironmentTheme => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 7) return TIME_THEMES.dawn;
    if (hour >= 7 && hour < 12) return TIME_THEMES.morning;
    if (hour >= 12 && hour < 14) return TIME_THEMES.midday;
    if (hour >= 14 && hour < 17) return TIME_THEMES.afternoon;
    if (hour >= 17 && hour < 20) return TIME_THEMES.evening;
    if (hour >= 20 && hour < 23) return TIME_THEMES.night;
    return TIME_THEMES.lateNight;
  };

  // Get current season
  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  // Calculate personalization based on reading history
  const getPersonalizationModifiers = () => {
    if (!readingHistory.length) return { energyMod: 1, symbolMod: 1, particleMod: 1 };

    const recentReadings = readingHistory.slice(-10);
    const majorCardCount = recentReadings.filter(r => r.cardType === 'major').length;
    const totalReadings = readingHistory.length;

    // More major arcana cards = more intense environment
    const majorRatio = majorCardCount / recentReadings.length;
    const experienceLevel = Math.min(totalReadings / 50, 1); // Max at 50 readings

    return {
      energyMod: 1 + (majorRatio * 0.3) + (experienceLevel * 0.2),
      symbolMod: 1 + (majorRatio * 0.2) + (experienceLevel * 0.15),
      particleMod: 1 + (majorRatio * 0.4) + (experienceLevel * 0.25)
    };
  };

  // Check for new achievements
  const checkAchievements = () => {
    const newAchievements: string[] = [];
    
    if (readingHistory.length >= 10 && !achievements.includes('seeker')) {
      newAchievements.push('seeker');
    }
    if (readingHistory.length >= 50 && !achievements.includes('mystic')) {
      newAchievements.push('mystic');
    }
    if (readingHistory.length >= 100 && !achievements.includes('sage')) {
      newAchievements.push('sage');
    }

    const majorCards = readingHistory.filter(r => r.cardType === 'major').length;
    if (majorCards >= 22 && !achievements.includes('major_complete')) {
      newAchievements.push('major_complete');
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Load user data from localStorage
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`tarot_history_${user.id}`);
      const savedAchievements = localStorage.getItem(`tarot_achievements_${user.id}`);
      
      if (savedHistory) {
        setReadingHistory(JSON.parse(savedHistory));
      }
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    }
  }, [user]);

  // Update theme based on time and personalization
  useEffect(() => {
    const baseTheme = getTimeTheme();
    const seasonalMods = SEASONAL_THEMES[getCurrentSeason()];
    const personalMods = getPersonalizationModifiers();

    const personalizedTheme: EnvironmentTheme = {
      ...baseTheme,
      ...seasonalMods,
      energyIntensity: baseTheme.energyIntensity * personalMods.energyMod,
      symbolOpacity: Math.min(baseTheme.symbolOpacity * personalMods.symbolMod, 0.6),
      particleColors: seasonalMods.particleColors || baseTheme.particleColors
    };

    setCurrentTheme(personalizedTheme);
    checkAchievements();
  }, [readingHistory, achievements]);

  // Function to record a new reading (to be called from parent)
  const recordReading = (cardId: number, cardType: 'major' | 'minor') => {
    const newReading: ReadingHistory = {
      cardId,
      timestamp: Date.now(),
      cardType
    };

    const updatedHistory = [...readingHistory, newReading];
    setReadingHistory(updatedHistory);

    if (user) {
      localStorage.setItem(`tarot_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  // Expose recording function globally
  useEffect(() => {
    (window as any).recordTarotReading = recordReading;
  }, [recordReading]);

  return (
    <>
      {/* Dynamic personalized background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.backgroundGradient} transition-all duration-1000`}
        style={{ zIndex: 0 }}
      />
      
      {/* Personalized floating symbols */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        {/* Base symbols with personalized opacity */}
        <div 
          className="absolute top-20 left-20 text-4xl animate-float transition-opacity duration-1000"
          style={{
            color: currentTheme.particleColors[0],
            opacity: currentTheme.symbolOpacity,
            animationDuration: `${6 / currentTheme.energyIntensity}s`
          }}
        >✦</div>
        
        <div 
          className="absolute top-40 right-40 text-3xl animate-float transition-opacity duration-1000"
          style={{
            color: currentTheme.particleColors[1],
            opacity: currentTheme.symbolOpacity * 0.8,
            animationDuration: `${8 / currentTheme.energyIntensity}s`,
            animationDelay: '2s'
          }}
        >☾</div>
        
        <div 
          className="absolute bottom-32 left-32 text-5xl animate-float transition-opacity duration-1000"
          style={{
            color: currentTheme.particleColors[2],
            opacity: currentTheme.symbolOpacity * 1.2,
            animationDuration: `${7 / currentTheme.energyIntensity}s`,
            animationDelay: '4s'
          }}
        >✧</div>
        
        <div 
          className="absolute bottom-20 right-20 text-3xl animate-float transition-opacity duration-1000"
          style={{
            color: currentTheme.particleColors[0],
            opacity: currentTheme.symbolOpacity * 0.9,
            animationDuration: `${5 / currentTheme.energyIntensity}s`,
            animationDelay: '1s'
          }}
        >◊</div>
        
        <div 
          className="absolute top-60 left-1/2 text-4xl animate-float transition-opacity duration-1000"
          style={{
            color: currentTheme.particleColors[1],
            opacity: currentTheme.symbolOpacity * 0.7,
            animationDuration: `${9 / currentTheme.energyIntensity}s`,
            animationDelay: '3s'
          }}
        >⚶</div>

        {/* Achievement-based symbols */}
        {achievements.includes('seeker') && (
          <div 
            className="absolute top-1/3 right-1/3 text-2xl animate-float"
            style={{
              color: '#F59E0B',
              opacity: currentTheme.symbolOpacity * 1.5,
              animationDuration: '6.5s',
              animationDelay: '1.5s'
            }}
          >🔍</div>
        )}
        
        {achievements.includes('mystic') && (
          <div 
            className="absolute bottom-1/3 left-1/4 text-3xl animate-float"
            style={{
              color: '#8B5CF6',
              opacity: currentTheme.symbolOpacity * 1.5,
              animationDuration: '7.5s',
              animationDelay: '2.5s'
            }}
          >🌟</div>
        )}
        
        {achievements.includes('sage') && (
          <div 
            className="absolute top-1/4 left-3/4 text-2xl animate-float"
            style={{
              color: '#10B981',
              opacity: currentTheme.symbolOpacity * 1.5,
              animationDuration: '8.5s',
              animationDelay: '0.5s'
            }}
          >👁️</div>
        )}
      </div>
      
      {/* Personalized energy rings */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div 
          className="absolute top-1/4 left-1/4 border rounded-full animate-spin-slow transition-all duration-1000"
          style={{
            width: `${24 * currentTheme.energyIntensity}rem`,
            height: `${24 * currentTheme.energyIntensity}rem`,
            borderColor: `${currentTheme.particleColors[0]}20`,
            animationDuration: `${20 / currentTheme.energyIntensity}s`
          }}
        ></div>
        
        <div 
          className="absolute top-3/4 right-1/4 border rounded-full animate-spin-reverse transition-all duration-1000"
          style={{
            width: `${16 * currentTheme.energyIntensity}rem`,
            height: `${16 * currentTheme.energyIntensity}rem`,
            borderColor: `${currentTheme.particleColors[1]}15`,
            animationDuration: `${15 / currentTheme.energyIntensity}s`
          }}
        ></div>
        
        <div 
          className="absolute top-1/2 left-1/2 border rounded-full animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{
            width: `${8 * currentTheme.energyIntensity}rem`,
            height: `${8 * currentTheme.energyIntensity}rem`,
            borderColor: `${currentTheme.particleColors[2]}25`,
            animationDuration: `${4 / currentTheme.energyIntensity}s`
          }}
        ></div>
      </div>

      {/* Environmental status indicator */}
      {user && (
        <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-purple-400/30 text-center">
          <div className="text-purple-200 text-sm font-semibold mb-1">
            ✨ {currentTheme.name} ✨
          </div>
          <div className="text-purple-400 text-xs">
            {readingHistory.length} Readings • {achievements.length} Achievements
          </div>
          {achievements.length > 0 && (
            <div className="text-yellow-400 text-xs mt-1">
              {achievements.includes('sage') ? '🧙‍♂️ Sage' :
               achievements.includes('mystic') ? '⭐ Mystic' :
               achievements.includes('seeker') ? '🔍 Seeker' : ''}
            </div>
          )}
        </div>
      )}
    </>
  );
}