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
    <section className="relative min-h-[460px] bg-gradient-to-r from-[#163763] to-[#2D5E8A] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-28 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 font-heading">
            <span className="block">MOBILE DIESEL MECHANIC</span>
            <span className="block text-[#FF9F1C]">CHARLOTTE &amp; COLUMBIA</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl font-medium mb-8 text-gray-100 max-w-3xl mx-auto">
            24/7 Emergency Service | On-Site Repairs | Fast Response
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-lg mx-auto">
            <a
              href="tel:8032306390"
              className="button-primary w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1"
            >
              Call Now for Service
            </a>
            <button
              onClick={scrollToContact}
              className="button-secondary w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#163763] transition-all duration-300 hover:-translate-y-1"
            >
              Get a Quote
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm font-semibold text-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
              <span>Licensed &amp; Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
              <span>All Makes &amp; Models</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-white" 
           style={{
             clipPath: 'ellipse(100% 100% at 50% 100%)'
           }}>
      </div>
    </section>
  );
};

export default Hero;