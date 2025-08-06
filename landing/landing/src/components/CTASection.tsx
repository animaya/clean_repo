'use client'

import { ReactElement } from 'react';

const CTASection = (): ReactElement => {
  const scrollToContact = (): void => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--background-white)' }}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--dark-navy) 0%, var(--primary-blue) 100%)`
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="section-headline mb-4 text-white">
                Ready For Fast, Reliable Diesel Repair?
              </h2>
              
              <p className="body-large mb-8 text-gray-100">
                Contact Diesel Dudes Today!
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-lg mx-auto mb-8">
                <a
                  href="tel:8032306390"
                  className="button-primary w-full sm:w-auto text-center"
                >
                  Call Now For Service
                </a>
                <button
                  onClick={scrollToContact}
                  className="button-secondary w-full sm:w-auto text-white bg-transparent border-2 border-white"
                  style={{
                    borderColor: 'white',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = 'var(--dark-navy)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Request On-Site Services
                </button>
              </div>
              
              {/* Contact Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl mb-2">📞</div>
                    <div className="font-bold text-lg mb-1">Call Us</div>
                    <a href="tel:8032306390" className="font-semibold hover:underline" style={{ color: 'var(--warning-orange)' }}>
                      (803) 230-6390
                    </a>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-bold text-lg mb-1">Response Time</div>
                    <div className="text-gray-100">
                      Emergency: Under 1 Hour
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🚛</div>
                    <div className="font-bold text-lg mb-1">Service Area</div>
                    <div className="text-gray-100">
                      Charlotte &amp; Columbia
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Urgency Indicator */}
              <div 
                className="mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 border"
                style={{
                  backgroundColor: 'rgba(237, 137, 54, 0.2)',
                  borderColor: 'rgba(237, 137, 54, 0.3)'
                }}
              >
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--warning-orange)' }}></div>
                <span className="font-bold text-sm" style={{ color: 'var(--warning-orange)' }}>
                  EMERGENCY SERVICE AVAILABLE NOW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;