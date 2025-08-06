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
    <section className="hero-section relative overflow-hidden text-white" style={{
      background: `linear-gradient(135deg, var(--dark-navy) 0%, var(--primary-blue) 100%)`
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 container text-center flex items-center justify-center min-h-[600px]">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 className="hero-headline mb-6 text-white">
            <span className="block">MOBILE DIESEL MECHANIC</span>
            <span className="block" style={{ color: 'var(--warning-orange)' }}>CHARLOTTE &amp; COLUMBIA</span>
          </h1>
          
          {/* Subtitle */}
          <p className="body-large mb-8 text-gray-100 max-w-3xl mx-auto">
            24/7 Emergency Service | On-Site Repairs | Fast Response
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-lg mx-auto" style={{ marginTop: 'var(--space-xl)' }}>
            <a
              href="tel:8032306390"
              className="button-primary w-full sm:w-auto text-center"
            >
              Call Now for Service
            </a>
            <button
              onClick={scrollToContact}
              className="button-secondary w-full sm:w-auto text-white bg-transparent border-2 border-white hover:bg-white"
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
              Get a Quote
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm font-semibold text-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
              <span>Licensed &amp; Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
              <span>All Makes &amp; Models</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-9" 
           style={{
             backgroundColor: 'var(--background-white)',
             clipPath: 'ellipse(100% 100% at 50% 100%)'
           }}>
      </div>
    </section>
  );
};

export default Hero;