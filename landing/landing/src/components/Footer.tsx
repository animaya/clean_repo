'use client'

import { ReactElement } from 'react';

const Footer = (): ReactElement => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: 'var(--dark-navy)', color: 'white', padding: 'var(--space-2xl) 0' }}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Services Column */}
          <div>
            <h3 className="small-heading mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/mobile-tire-services" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Tire Services
                </a>
              </li>
              <li>
                <a href="/services/mobile-brake-repairs" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Brake Repairs
                </a>
              </li>
              <li>
                <a href="/services/fuel-system-services" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Fuel Systems
                </a>
              </li>
              <li>
                <a href="/services/mobile-electrical-repairs" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Electrical
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="small-heading mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Blog &amp; Tips
                </a>
              </li>
              <li>
                <a href="/contact" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div id="resources">
            <h3 className="small-heading mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/emergency-roadside-assistance" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Emergency Service
                </a>
              </li>
              <li>
                <a href="/i77-breakdown-guide" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  I-77 Breakdown Guide
                </a>
              </li>
              <li>
                <a href="/common-problems" className="body-regular text-gray-300 hover:text-[--primary-blue] transition-colors">
                  Common Problems
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="small-heading mb-4 text-white">Contact</h3>
            <div className="space-y-3">
              <div>
                <a 
                  href="tel:8032306390" 
                  className="text-xl font-bold transition-colors flex items-center gap-2"
                  style={{ color: 'var(--primary-blue)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                >
                  <span>📞</span>
                  (803) 230-6390
                </a>
              </div>
              <div className="body-small text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <span>⏰</span>
                  <strong>24/7 Emergency Service</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  Charlotte, NC &amp; Columbia, SC
                </div>
              </div>
              
              {/* Quick CTA */}
              <div className="mt-4">
                <a
                  href="tel:8032306390"
                  className="button-primary"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-8" style={{ borderColor: 'var(--medium-gray)' }}>
          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Logo and Back to Top */}
            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className="text-2xl font-bold text-white transition-colors cursor-pointer"
                style={{ color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Diesel Dudes
              </button>
              <button
                onClick={scrollToTop}
                className="body-small text-gray-400 transition-colors flex items-center gap-1"
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}
              >
                <span>↑</span> Back to Top
              </button>
            </div>

            {/* Copyright and Links */}
            <div className="text-center lg:text-right">
              <div className="body-small text-gray-400 mb-2">
                © 2025 Diesel Dudes. All rights reserved. Emergency Roadside Assistance &amp; On-Site Diesel Repairs.
              </div>
              <div className="body-small text-gray-400 mb-2">
                Serving All Makes and Models | Call Now for Fast, Reliable Service.
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 caption">
                <a href="/terms-of-service" className="text-gray-400 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Terms of Service
                </a>
                <span className="text-gray-600">|</span>
                <a href="/privacy-policy" className="text-gray-400 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'} onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;