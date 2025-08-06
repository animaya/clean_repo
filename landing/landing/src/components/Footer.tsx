'use client'

import { ReactElement } from 'react';

const Footer = (): ReactElement => {
  return (
    <footer className="bg-gray-800 text-white py-24">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
          {/* Logo and Contact Info */}
          <div className="col-span-1">
            {/* Diesel Dudes Logo */}
            <div className="mb-12">
              <div className="flex items-center">
                <div className="text-white text-4xl font-bold mb-4">
                  <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Diesel Dudes</span>
                </div>
              </div>
              <div className="text-lg text-gray-300 mb-2">MECHANIC SERVICES</div>
            </div>
            
            {/* 24/7 Emergency Service */}
            <div className="mb-8">
              <div className="text-lg text-gray-300 mb-4">24/7 Emergency Service</div>
              <a 
                href="tel:8032306390" 
                className="text-4xl font-bold text-orange-500 hover:text-orange-400 transition-colors"
              >
                (803) 230-6390
              </a>
            </div>
            
            <div className="text-lg text-gray-300">
              Available Day & Night
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-orange-500 font-bold text-2xl mb-8 uppercase">Services</h3>
            <ul className="space-y-4 text-base">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Emergency Roadside
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Engine Repair
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Brake Repairs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Tire Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Battery Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  All Services <span className="ml-1">→</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Service Areas Column */}
          <div>
            <h3 className="text-orange-500 font-bold text-2xl mb-8 uppercase">Service Areas</h3>
            <ul className="space-y-4 text-base">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Charlotte, NC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Columbia, SC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Rock Hill, SC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Gastonia, NC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  I-77 Corridor
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  All Locations <span className="ml-1">→</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-orange-500 font-bold text-2xl mb-8 uppercase">Company</h3>
            <ul className="space-y-4 text-base">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Diesel Mechanic
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Blog & Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Emergency Service
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-orange-500 font-bold text-2xl mb-8 uppercase">Resources</h3>
            <ul className="space-y-4 text-base">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  I-77 Breakdown Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Common Problems
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;