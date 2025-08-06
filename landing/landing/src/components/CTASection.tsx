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
    <section id="contact" className="section-padding bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#163763] rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 font-heading">
                Ready For Fast, Reliable Diesel Repair?
              </h2>
              
              <p className="text-xl lg:text-2xl font-medium mb-8 text-gray-100">
                Contact Diesel Dudes Today!
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-lg mx-auto mb-8">
                <a
                  href="tel:8032306390"
                  className="button-primary w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  Call Now For Service
                </a>
                <button
                  onClick={scrollToContact}
                  className="button-secondary w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#163763] transition-all duration-300 hover:-translate-y-1"
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
                    <a href="tel:8032306390" className="text-[#FF9F1C] hover:underline font-semibold">
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
              <div className="mt-8 inline-flex items-center gap-3 bg-[#FF9F1C]/20 border border-[#FF9F1C]/30 rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-[#FF9F1C] rounded-full animate-pulse"></div>
                <span className="text-[#FF9F1C] font-bold text-sm">
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