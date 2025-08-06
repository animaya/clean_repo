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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-[#163763] font-heading">
              Diesel Dudes
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-[#163763] hover:text-[#2D5E8A] font-semibold text-lg transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('areas')}
              className="text-[#163763] hover:text-[#2D5E8A] font-semibold text-lg transition-colors"
            >
              Service Areas
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#163763] hover:text-[#2D5E8A] font-semibold text-lg transition-colors"
            >
              Company
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="text-[#163763] hover:text-[#2D5E8A] font-semibold text-lg transition-colors"
            >
              Resources
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="tel:8032306390"
              className="button-primary px-8 py-3 text-lg font-bold rounded-full shadow-lg hover:shadow-xl"
            >
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#F9FBFC] hover:bg-[#EAF2F8] transition-colors"
          >
            <div className="space-y-1">
              <div className={`w-5 h-0.5 bg-[#163763] transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-[#163763] transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-[#163763] transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="space-y-4">
              <button
                onClick={() => {
                  scrollToSection('services');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-[#163763] hover:text-[#2D5E8A] font-semibold py-2 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection('areas');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-[#163763] hover:text-[#2D5E8A] font-semibold py-2 transition-colors"
              >
                Service Areas
              </button>
              <button
                onClick={() => {
                  scrollToSection('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-[#163763] hover:text-[#2D5E8A] font-semibold py-2 transition-colors"
              >
                Company
              </button>
              <button
                onClick={() => {
                  scrollToSection('resources');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-[#163763] hover:text-[#2D5E8A] font-semibold py-2 transition-colors"
              >
                Resources
              </button>
              <a
                href="tel:8032306390"
                className="button-primary block text-center px-6 py-3 mt-4 rounded-full font-bold"
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