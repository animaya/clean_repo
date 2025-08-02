"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface StoryArc {
  id: string;
  title: string;
  stages: StoryStage[];
  triggers: StoryTrigger[];
}

interface StoryStage {
  id: string;
  title: string;
  narrative: string;
  visualCues: VisualCue[];
  duration: number; // in ms
}

interface StoryTrigger {
  event: 'app_entry' | 'card_draw' | 'card_flip' | 'first_reading' | 'milestone_reached';
  condition?: any;
}

interface VisualCue {
  type: 'text' | 'symbol' | 'glow' | 'particle';
  content: string;
  position: { x: number; y: number };
  duration: number;
  animation: string;
}

const STORY_ARCS: StoryArc[] = [
  {
    id: 'welcome_journey',
    title: 'The Seeker\'s Welcome',
    triggers: [{ event: 'app_entry' }],
    stages: [
      {
        id: 'cosmic_greeting',
        title: 'Cosmic Awakening',
        narrative: "Welcome back, cosmic traveler. The universe has been whispering your name, and the ancient cards have stirred in anticipation of your return.",
        visualCues: [
          {
            type: 'text',
            content: 'The cosmos recognizes your spirit...',
            position: { x: 50, y: 20 },
            duration: 3000,
            animation: 'fade-in-out'
          }
        ],
        duration: 4000
      },
      {
        id: 'preparation_guidance',
        title: 'Sacred Preparation',
        narrative: "Take a moment to center yourself. Feel the energy of countless seekers who have walked this path before you. The cards are ready to reveal what your soul needs to know.",
        visualCues: [
          {
            type: 'glow',
            content: '',
            position: { x: 50, y: 50 },
            duration: 3000,
            animation: 'pulse-expand'
          }
        ],
        duration: 4000
      }
    ]
  },
  {
    id: 'first_reading',
    title: 'The First Revelation',
    triggers: [{ event: 'first_reading' }],
    stages: [
      {
        id: 'card_selection_guidance',
        title: 'Choosing Your Destiny',
        narrative: "Feel the energy guide your choice. Trust your intuition - the right card will call to you through the veil of possibility.",
        visualCues: [
          {
            type: 'text',
            content: 'Let your spirit guide you...',
            position: { x: 25, y: 60 },
            duration: 3000,
            animation: 'gentle-float'
          }
        ],
        duration: 3000
      },
      {
        id: 'revelation_ceremony',
        title: 'The Sacred Revealing',
        narrative: "The card you have chosen carries ancient wisdom specifically meant for this moment in your journey. Prepare to receive its message.",
        visualCues: [
          {
            type: 'particle',
            content: '✨',
            position: { x: 75, y: 40 },
            duration: 2000,
            animation: 'energy-flow'
          }
        ],
        duration: 3000
      }
    ]
  },
  {
    id: 'reading_interpretation',
    title: 'Wisdom Integration',
    triggers: [{ event: 'card_flip' }],
    stages: [
      {
        id: 'meaning_revelation',
        title: 'Understanding Unfolds',
        narrative: "This ancient symbol speaks directly to your current path. Consider how its wisdom applies to the questions you carry in your heart.",
        visualCues: [
          {
            type: 'text',
            content: 'Ancient wisdom flows through you...',
            position: { x: 50, y: 80 },
            duration: 4000,
            animation: 'revelation-burst'
          }
        ],
        duration: 4000
      },
      {
        id: 'integration_guidance',
        title: 'Carrying the Light',
        narrative: "Take this insight with you into the world. The universe has shared its secrets - now it's time to live the wisdom you've received.",
        visualCues: [
          {
            type: 'glow',
            content: '',
            position: { x: 50, y: 50 },
            duration: 3000,
            animation: 'gentle-expand'
          }
        ],
        duration: 4000
      }
    ]
  },
  {
    id: 'milestone_celebration',
    title: 'Spiritual Milestones',
    triggers: [{ event: 'milestone_reached' }],
    stages: [
      {
        id: 'achievement_recognition',
        title: 'Your Journey Honored',
        narrative: "The cosmic forces recognize your dedication to spiritual growth. Each reading has woven another thread in the tapestry of your awakening.",
        visualCues: [
          {
            type: 'symbol',
            content: '🌟',
            position: { x: 50, y: 30 },
            duration: 5000,
            animation: 'celebration-burst'
          }
        ],
        duration: 5000
      }
    ]
  }
];

const NARRATIVE_VARIATIONS = {
  welcome: [
    "The cosmic winds carry your essence back to this sacred space...",
    "Ancient energies stir as you return to seek divine guidance...",
    "The universe has been preparing revelations especially for you...",
    "Your spiritual journey continues as the cards awaken to your presence..."
  ],
  cardDraw: [
    "Feel the energy flowing from the deck into your consciousness...",
    "The chosen card pulses with destiny meant specifically for you...",
    "Mystical forces guide this moment of divine selection...",
    "The universe speaks through the card that calls to your soul..."
  ],
  revelation: [
    "Behold the wisdom that transcends time and space...",
    "The ancient teachings now illuminate your path forward...",
    "This sacred symbol carries the answer your heart seeks...",
    "The cosmic truth reveals itself through this divine message..."
  ]
};

interface VisualStorytellingProps {
  userReadingCount?: number;
  lastCardType?: 'major' | 'minor';
  isFirstVisit?: boolean;
}

export default function VisualStorytellingFramework({
  userReadingCount = 0,
  lastCardType,
  isFirstVisit = false
}: VisualStorytellingProps) {
  const { user } = useUser();
  const [currentStory, setCurrentStory] = useState<StoryStage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [narrativeText, setNarrativeText] = useState('');

  // Get random narrative variation
  const getRandomNarrative = (type: keyof typeof NARRATIVE_VARIATIONS): string => {
    const variations = NARRATIVE_VARIATIONS[type];
    return variations[Math.floor(Math.random() * variations.length)];
  };

  // Trigger story based on event
  const triggerStory = (event: StoryTrigger['event'], context?: any) => {
    const applicableArcs = STORY_ARCS.filter(arc =>
      arc.triggers.some(trigger => trigger.event === event)
    );

    if (applicableArcs.length === 0) return;

    // Choose appropriate arc based on context
    let selectedArc = applicableArcs[0];
    
    if (event === 'app_entry' && !isFirstVisit) {
      // Use welcome variations for returning users
      setNarrativeText(getRandomNarrative('welcome'));
      return;
    }
    
    if (event === 'first_reading' && userReadingCount === 0) {
      selectedArc = applicableArcs.find(arc => arc.id === 'first_reading') || selectedArc;
    }

    if (event === 'milestone_reached') {
      selectedArc = applicableArcs.find(arc => arc.id === 'milestone_celebration') || selectedArc;
    }

    // Play the story arc
    playStoryArc(selectedArc);
  };

  // Play through a story arc
  const playStoryArc = (arc: StoryArc) => {
    let stageIndex = 0;
    
    const playNextStage = () => {
      if (stageIndex >= arc.stages.length) {
        setIsVisible(false);
        setCurrentStory(null);
        return;
      }

      const stage = arc.stages[stageIndex];
      setCurrentStory(stage);
      setIsVisible(true);

      // Auto-advance to next stage
      setTimeout(() => {
        stageIndex++;
        playNextStage();
      }, stage.duration);
    };

    playNextStage();
  };

  // Expose trigger function globally
  useEffect(() => {
    (window as any).triggerStoryEvent = triggerStory;
  }, []);

  // Auto-trigger welcome story on mount
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        triggerStory('app_entry');
      }, 1000);
    }
  }, [user]);

  // Render visual cues
  const renderVisualCue = (cue: VisualCue, index: number) => {
    const baseClasses = "absolute pointer-events-none transition-all duration-1000";
    
    switch (cue.type) {
      case 'text':
        return (
          <div
            key={index}
            className={`${baseClasses} text-purple-200 text-lg font-semibold bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-purple-400/30`}
            style={{
              left: `${cue.position.x}%`,
              top: `${cue.position.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `${cue.animation} ${cue.duration}ms ease-in-out`
            }}
          >
            {cue.content}
          </div>
        );
      
      case 'symbol':
        return (
          <div
            key={index}
            className={`${baseClasses} text-6xl`}
            style={{
              left: `${cue.position.x}%`,
              top: `${cue.position.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `${cue.animation} ${cue.duration}ms ease-in-out`
            }}
          >
            {cue.content}
          </div>
        );
      
      case 'glow':
        return (
          <div
            key={index}
            className={`${baseClasses} w-32 h-32 bg-gradient-radial from-purple-400/30 to-transparent rounded-full`}
            style={{
              left: `${cue.position.x}%`,
              top: `${cue.position.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `${cue.animation} ${cue.duration}ms ease-in-out infinite`
            }}
          />
        );
      
      case 'particle':
        return (
          <div
            key={index}
            className={`${baseClasses} text-2xl`}
            style={{
              left: `${cue.position.x}%`,
              top: `${cue.position.y}%`,
              animation: `${cue.animation} ${cue.duration}ms linear infinite`
            }}
          >
            {cue.content}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isVisible && !narrativeText) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* Main story narrative */}
      {currentStory && isVisible && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-2xl">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-purple-400/40 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent mb-4">
              {currentStory.title}
            </h3>
            <p className="text-purple-100 text-lg leading-relaxed font-medium">
              {currentStory.narrative}
            </p>
          </div>
        </div>
      )}

      {/* Simple narrative text for quick messages */}
      {narrativeText && !currentStory && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 text-center">
            <p className="text-purple-200 text-base font-medium">
              {narrativeText}
            </p>
          </div>
        </div>
      )}

      {/* Visual cues */}
      {currentStory?.visualCues.map((cue, index) => renderVisualCue(cue, index))}
    </div>
  );
}