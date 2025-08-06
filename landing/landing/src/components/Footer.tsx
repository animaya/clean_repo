'use client'

import { ReactElement } from 'react';

const Footer = (): ReactElement => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#232F3E] text-white py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white font-heading">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/mobile-tire-services" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Tire Services
                </a>
              </li>
              <li>
                <a href="/services/mobile-brake-repairs" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Brake Repairs
                </a>
              </li>
              <li>
                <a href="/services/fuel-system-services" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Fuel Systems
                </a>
              </li>
              <li>
                <a href="/services/mobile-electrical-repairs" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Electrical
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white font-heading">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Blog &amp; Tips
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div id="resources">
            <h3 className="text-lg font-bold mb-4 text-white font-heading">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/emergency-roadside-assistance" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Emergency Service
                </a>
              </li>
              <li>
                <a href="/i77-breakdown-guide" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  I-77 Breakdown Guide
                </a>
              </li>
              <li>
                <a href="/common-problems" className="text-gray-300 hover:text-[#FF9F1C] transition-colors">
                  Common Problems
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white font-heading">Contact</h3>
            <div className="space-y-3">
              <div>
                <a 
                  href="tel:8032306390" 
                  className="text-[#FF9F1C] hover:text-white text-xl font-bold transition-colors flex items-center gap-2"
                >
                  <span>📞</span>
                  (803) 230-6390
                </a>
              </div>
              <div className="text-gray-300 text-sm">
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
                  className="inline-block bg-[#FF9F1C] hover:bg-[#FF7400] text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Logo and Back to Top */}
            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className="text-2xl font-bold text-white hover:text-[#FF9F1C] transition-colors font-heading cursor-pointer"
              >
                Diesel Dudes
              </button>
              <button
                onClick={scrollToTop}
                className="text-gray-400 hover:text-[#FF9F1C] transition-colors flex items-center gap-1 text-sm"
              >
                <span>↑</span> Back to Top
              </button>
            </div>

            {/* Copyright and Links */}
            <div className="text-center lg:text-right">
              <div className="text-gray-400 text-sm mb-2">
                © 2025 Diesel Dudes. All rights reserved. Emergency Roadside Assistance &amp; On-Site Diesel Repairs.
              </div>
              <div className="text-gray-400 text-sm mb-2">
                Serving All Makes and Models | Call Now for Fast, Reliable Service.
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-xs">
                <a href="/terms-of-service" className="text-gray-400 hover:text-[#FF9F1C] transition-colors">
                  Terms of Service
                </a>
                <span className="text-gray-600">|</span>
                <a href="/privacy-policy" className="text-gray-400 hover:text-[#FF9F1C] transition-colors">
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