'use client'

import { ReactElement, useState } from 'react';


const Header = (): ReactElement => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header fixed top-0 left-0 right-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-[--dark-navy] h-8" style={{ color: 'var(--dark-navy)' }}>
              Diesel Dudes
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('services')}
              className="header-nav-link"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('areas')}
              className="header-nav-link"
            >
              Service Areas
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="header-nav-link"
            >
              Company
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="header-nav-link"
            >
              Resources
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="tel:8032306390"
              className="button-primary"
            >
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            style={{ 
              backgroundColor: 'var(--off-white)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--light-gray)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--off-white)'}
          >
            <div className="space-y-1">
              <div className={`w-5 h-0.5 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} style={{ backgroundColor: 'var(--dark-navy)' }}></div>
              <div className={`w-5 h-0.5 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: 'var(--dark-navy)' }}></div>
              <div className={`w-5 h-0.5 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ backgroundColor: 'var(--dark-navy)' }}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t" style={{ borderColor: 'var(--light-gray)' }}>
            <nav className="space-y-4">
              <button
                onClick={() => {
                  scrollToSection('services');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 transition-colors"
                style={{ 
                  color: 'var(--dark-navy)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-navy)'}
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection('areas');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 transition-colors"
                style={{ 
                  color: 'var(--dark-navy)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-navy)'}
              >
                Service Areas
              </button>
              <button
                onClick={() => {
                  scrollToSection('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 transition-colors"
                style={{ 
                  color: 'var(--dark-navy)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-navy)'}
              >
                Company
              </button>
              <button
                onClick={() => {
                  scrollToSection('resources');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 transition-colors"
                style={{ 
                  color: 'var(--dark-navy)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dark-navy)'}
              >
                Resources
              </button>
              <a
                href="tel:8032306390"
                className="button-primary block text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Call Now
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;