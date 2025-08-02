"use client";

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    };

    const initializeStars = () => {
      starsRef.current = [];
      const isMobile = window.innerWidth < 768;
      const baseStars = isMobile ? 50 : 200;
      const numStars = Math.min(baseStars, Math.floor((canvas.width * canvas.height) / (isMobile ? 15000 : 8000)));
      
      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          brightness: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: Math.random() * 120 + 60,
        size: Math.random() * 3 + 1,
        hue: Math.random() * 60 + 240 // Purple to blue range
      };
    };

    const addRandomParticles = () => {
      const isMobile = window.innerWidth < 768;
      const maxParticles = isMobile ? 20 : 50;
      const spawnRate = isMobile ? 0.05 : 0.1;
      
      if (Math.random() < spawnRate && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(
          createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        return particle.life > 0;
      });
    };

    const drawStars = () => {
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.brightness * (0.5 + 0.5 * twinkle);
        const size = 1 + (opacity * 2);
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ffffff';
        
        // Main star
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Star glow
        if (opacity > 0.7) {
          ctx.globalAlpha = opacity * 0.3;
          ctx.fillStyle = '#e0e7ff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
    };

    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        const size = particle.size * alpha;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        
        // Particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 70%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle core
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 80%, 1)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawConstellationLines = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      
      // Draw subtle lines between nearby bright stars
      for (let i = 0; i < starsRef.current.length; i++) {
        const star1 = starsRef.current[i];
        if (star1.brightness < 0.7) continue;
        
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const star2 = starsRef.current[j];
          if (star2.brightness < 0.7) continue;
          
          const distance = Math.sqrt(
            Math.pow(star2.x - star1.x, 2) + Math.pow(star2.y - star1.y, 2)
          );
          
          if (distance < 150 && Math.random() < 0.05) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }
      
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 1;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      addRandomParticles();
      updateParticles();
      
      drawConstellationLines();
      drawStars();
      drawParticles();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse interaction - reduced on mobile
    const handleMouseMove = (e: MouseEvent) => {
      const isMobile = window.innerWidth < 768;
      const interactionRate = isMobile ? 0.1 : 0.3;
      
      if (Math.random() < interactionRate) {
        particlesRef.current.push(
          createParticle(e.clientX, e.clientY)
        );
      }
    };

    // Initialize
    resizeCanvas();
    animate();

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Canvas for dynamic particles and stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Static gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black"
        style={{ zIndex: 0 }}
      />
      
      {/* Floating mystical symbols - enhanced */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute top-20 left-20 text-purple-400/20 text-4xl animate-float" style={{animationDelay: '0s', animationDuration: '6s'}}>✦</div>
        <div className="absolute top-40 right-40 text-blue-400/15 text-3xl animate-float" style={{animationDelay: '2s', animationDuration: '8s'}}>☾</div>
        <div className="absolute bottom-32 left-32 text-purple-300/20 text-5xl animate-float" style={{animationDelay: '4s', animationDuration: '7s'}}>✧</div>
        <div className="absolute bottom-20 right-20 text-indigo-400/25 text-3xl animate-float" style={{animationDelay: '1s', animationDuration: '5s'}}>◊</div>
        <div className="absolute top-60 left-1/2 text-purple-400/15 text-4xl animate-float" style={{animationDelay: '3s', animationDuration: '9s'}}>⚶</div>
        <div className="absolute top-1/3 right-1/3 text-cyan-400/20 text-2xl animate-float" style={{animationDelay: '1.5s', animationDuration: '6.5s'}}>◈</div>
        <div className="absolute bottom-1/3 left-1/4 text-purple-500/15 text-3xl animate-float" style={{animationDelay: '2.5s', animationDuration: '7.5s'}}>⟐</div>
      </div>
      
      {/* Mystical energy waves */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-400/10 rounded-full animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 border border-blue-400/8 rounded-full animate-spin-reverse"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-purple-300/15 rounded-full animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </>
  );
}