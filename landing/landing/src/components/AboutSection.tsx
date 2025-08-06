'use client'

import { ReactElement } from 'react';

const AboutSection = (): ReactElement => {
  return (
    <section id="about" className="bg-white section-padding">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#163763] mb-8 font-heading">
            Diesel Mechanics With a Fleet Manager&apos;s Perspective
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              At Diesel Dudes, we understand the importance of keeping your fleet running smoothly. 
              Our leadership team also operates a trucking company, and our lead mechanic has over 15 years 
              of experience as a fleet manager, specializing in diesel trucks and heavy equipment. 
              We&apos;re not just mechanics – we&apos;re partners in your business&apos;s success.
            </p>
            
            <p>
              With locations serving both the Charlotte, NC, and Columbia, SC markets, Diesel Dudes offers 
              unparalleled service, quick response times, and comprehensive repairs for all diesel makes and models.
            </p>
          </div>
          
          {/* Key Differentiators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F9FBFC] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🚛</div>
              <h3 className="text-xl font-bold text-[#163763] mb-3 font-heading">
                Fleet Operators
              </h3>
              <p className="text-gray-600">
                We own and operate our own trucking fleet, so we understand your challenges firsthand.
              </p>
            </div>
            
            <div className="bg-[#F9FBFC] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-[#163763] mb-3 font-heading">
                Expert Mechanics
              </h3>
              <p className="text-gray-600">
                15+ years of specialized diesel experience with all major truck manufacturers.
              </p>
            </div>
            
            <div className="bg-[#F9FBFC] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-[#163763] mb-3 font-heading">
                Mobile Service
              </h3>
              <p className="text-gray-600">
                We come to you – minimizing downtime and keeping your operations running.
              </p>
            </div>
          </div>
          
          {/* Certifications */}
          <div className="mt-16 bg-gradient-to-r from-[#EAF2F8] to-[#F9FBFC] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#163763] mb-6 font-heading">
              Certified &amp; Trusted
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-semibold text-[#163763]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
                <span>Licensed &amp; Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
                <span>ASE Certified Mechanics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
                <span>Commercial Vehicle Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#5FA85B] rounded-full"></div>
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