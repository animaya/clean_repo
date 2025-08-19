'use client'

import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="relative bg-[#161C2D] px-4 sm:px-8 lg:px-[165px] py-6" role="banner">
      <div className="max-w-[1110px] mx-auto">
        <nav className="flex items-center justify-between h-[50px]" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <div 
            className="text-white"
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '28px',
              letterSpacing: '-0.13px',
              width: '154px',
              height: '28px'
            }}
          >
            <a href="#" className="focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg p-1" aria-label="Brainwave.io home">
              Brainwave.io
            </a>
          </div>
          
          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center space-x-8 text-white" 
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: '26px',
              letterSpacing: '-0.1px'
            }}
          >
            <li>
              <a 
                href="#demos" 
                className="hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
              >
                Demos
              </a>
            </li>
            <li>
              <a 
                href="#pages" 
                className="hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
              >
                Pages
              </a>
            </li>
            <li>
              <a 
                href="#support" 
                className="hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
              >
                Support
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
              >
                Contact
              </a>
            </li>
          </ul>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg" 
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
          
          {/* CTA Button - Visible on all screens except xs */}
          <button 
            className="flex bg-[#473BF0] text-white rounded-lg items-center justify-center hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] lg:w-[183px] lg:h-[50px] md:w-[120px] md:h-[44px] w-[80px] h-[36px]"
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: 'clamp(12px, 3vw, 17px)',
              lineHeight: '21px',
              letterSpacing: '-0.5px'
            }}
            aria-label="Start a free trial"
          >
            <span className="lg:block hidden">Start a free trial</span>
            <span className="lg:hidden md:block hidden">Free</span>
            <span className="md:hidden block">Try</span>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#161C2D] border-t border-gray-700 z-50">
            <div className="px-4 py-4 space-y-4">
              <ul className="space-y-4 text-white"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '26px',
                  letterSpacing: '-0.1px'
                }}
              >
                <li>
                  <a 
                    href="#demos" 
                    className="block hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Demos
                  </a>
                </li>
                <li>
                  <a 
                    href="#pages" 
                    className="block hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pages
                  </a>
                </li>
                <li>
                  <a 
                    href="#support" 
                    className="block hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="block hover:text-[#B9FF66] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                </li>
              </ul>
              
              <button 
                className="w-full bg-[#473BF0] text-white rounded-lg flex items-center justify-center hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] h-[44px]"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '17px',
                  lineHeight: '21px',
                  letterSpacing: '-0.5px'
                }}
                aria-label="Start a free trial"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start a free trial
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}