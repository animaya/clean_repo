'use client'

import { ReactElement } from 'react';


const Hero = (): ReactElement => {
  const scrollToContact = (): void => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden text-white flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero-background.webp')`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Dark Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/50" />
      
      {/* Content Container */}
      <div className="relative z-10 container text-center px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Main Title - Exact Match to Screenshot */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-none">
            <span className="block text-white drop-shadow-lg">MOBILE DIESEL MECHANIC</span>
            <span className="block text-white drop-shadow-lg">CHARLOTTE & COLUMBIA</span>
          </h1>
          
          {/* Subtitle with Underline */}
          <div className="mb-8 space-y-2">
            <p className="text-xl md:text-2xl text-white drop-shadow-md">
              <span className="underline decoration-2 underline-offset-4">Emergency Roadside Assistance</span> & On-Site Diesel Repairs
            </p>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              Serving All Makes and Models | Call Now for Fast, Reliable Service.
            </p>
          </div>
          
          {/* CTA Buttons - Exact Match to Screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="tel:8032306390"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[280px]"
              style={{
                backgroundColor: '#FF6B35'
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              CALL NOW FOR SERVICE
            </a>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white hover:bg-gray-100 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[200px]"
            >
              GET A QUOTE
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-8 h-8 text-white opacity-80" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;