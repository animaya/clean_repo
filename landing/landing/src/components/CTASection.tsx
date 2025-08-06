'use client'

import { ReactElement } from 'react';

const CTASection = (): ReactElement => {
  return (
    <section className="py-20" style={{ backgroundColor: '#f8f8f8' }}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tool Icon */}
          <div className="mb-8 flex justify-center">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 100 100" 
              fill="none"
              className="text-teal-600"
            >
              <rect x="20" y="35" width="60" height="25" rx="3" fill="currentColor"/>
              <rect x="25" y="40" width="50" height="15" rx="2" fill="#f8f8f8"/>
              <rect x="30" y="30" width="8" height="40" rx="2" fill="currentColor"/>
              <rect x="62" y="30" width="8" height="40" rx="2" fill="currentColor"/>
              <circle cx="45" cy="20" r="8" fill="currentColor"/>
              <rect x="40" y="15" width="10" height="10" rx="2" fill="#f8f8f8"/>
            </svg>
          </div>
          
          {/* Heading */}
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ 
              color: '#2d3748',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            READY FOR FAST, RELIABLE DIESEL REPAIR?
          </h2>
          
          {/* Subtitle */}
          <p 
            className="text-xl mb-12"
            style={{ color: '#4a5568' }}
          >
            Contact Diesel Dudes Today!
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            <a
              href="tel:8032306390"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-64"
              style={{ 
                backgroundColor: '#ed8936',
                boxShadow: '0 4px 15px rgba(237, 137, 54, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dd7724';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ed8936';
              }}
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              CALL NOW FOR SERVICE
            </a>
            
            <button
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-64"
              style={{ 
                backgroundColor: '#ed8936',
                boxShadow: '0 4px 15px rgba(237, 137, 54, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dd7724';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ed8936';
              }}
            >
              REQUEST ON-SITE SERVICES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;