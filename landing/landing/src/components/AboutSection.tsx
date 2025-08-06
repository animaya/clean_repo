'use client'

import { ReactElement } from 'react';

const AboutSection = (): ReactElement => {
  return (
    <section id="about" className="section-padding" style={{ backgroundColor: 'var(--background-white)' }}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-headline mb-8" style={{ color: 'var(--dark-navy)' }}>
            Diesel Mechanics With a Fleet Manager&apos;s Perspective
          </h2>
          
          <div className="space-y-6 leading-relaxed">
            <p className="body-large">
              At Diesel Dudes, we understand the importance of keeping your fleet running smoothly. 
              Our leadership team also operates a trucking company, and our lead mechanic has over 15 years 
              of experience as a fleet manager, specializing in diesel trucks and heavy equipment. 
              We&apos;re not just mechanics – we&apos;re partners in your business&apos;s success.
            </p>
            
            <p className="body-large">
              With locations serving both the Charlotte, NC, and Columbia, SC markets, Diesel Dudes offers 
              unparalleled service, quick response times, and comprehensive repairs for all diesel makes and models.
            </p>
          </div>
          
          {/* Key Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginTop: 'var(--space-3xl)' }}>
            <div className="feature-card text-center">
              <div className="text-3xl mb-4">🚛</div>
              <h3 className="small-heading mb-3" style={{ color: 'var(--dark-navy)' }}>
                Fleet Operators
              </h3>
              <p className="body-regular">
                We own and operate our own trucking fleet, so we understand your challenges firsthand.
              </p>
            </div>
            
            <div className="feature-card text-center">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="small-heading mb-3" style={{ color: 'var(--dark-navy)' }}>
                Expert Mechanics
              </h3>
              <p className="body-regular">
                15+ years of specialized diesel experience with all major truck manufacturers.
              </p>
            </div>
            
            <div className="feature-card text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="small-heading mb-3" style={{ color: 'var(--dark-navy)' }}>
                Mobile Service
              </h3>
              <p className="body-regular">
                We come to you – minimizing downtime and keeping your operations running.
              </p>
            </div>
          </div>
          
          {/* Certifications */}
          <div 
            className="rounded-2xl p-8" 
            style={{ 
              marginTop: 'var(--space-3xl)',
              background: `linear-gradient(135deg, var(--primary-blue-light) 0%, var(--off-white) 100%)`
            }}
          >
            <h3 className="subheading mb-6" style={{ color: 'var(--dark-navy)' }}>
              Certified &amp; Trusted
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 body-small font-semibold" style={{ color: 'var(--dark-navy)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
                <span>Licensed &amp; Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
                <span>ASE Certified Mechanics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
                <span>Commercial Vehicle Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success-green)' }}></div>
                <span>Emergency Service Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;