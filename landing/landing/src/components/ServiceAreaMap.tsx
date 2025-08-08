'use client'

import { ReactElement } from 'react';


const ServiceAreaMap = (): ReactElement => {
  // North Carolina cities
  const ncCities = [
    "Charlotte", "Huntersville", "Concord", "Monroe",
    "Gastonia", "Indian Land", "Matthews", "Cornelius",
    "Mooresville", "Statesville", "Kannapolis", "Harrisburg"
  ];

  // South Carolina cities  
  const scCities = [
    "Columbia", "Rock Hill", "Fort Mill", "Lexington",
    "West Columbia", "Irmo", "Blythewood", "York",
    "Chester", "Winnsboro", "Gaffney", "Spartanburg"
  ];

  return (
    <section id="areas" className="section-padding" style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--dark-navy)' }}>
            SERVICE AREA MAP
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            24/7 Mobile Diesel Repair Services Along the I-77 Corridor
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          
          {/* Left Side - I-77 Corridor Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-200 to-amber-400" style={{ aspectRatio: '4/5' }}>
              {/* Placeholder for truck/highway image */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-300 flex items-end justify-center p-8">
                {/* Truck silhouette placeholder */}
                <div className="absolute bottom-4 left-4 w-32 h-20 bg-black/20 rounded-lg flex items-center justify-center">
                  <svg className="w-24 h-12 text-black/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8h-3l-1-1h-5l-1 1H7v1c0 .6.4 1 1 1h1l1 1v1h8v-1l1-1h1c.6 0 1-.4 1-1V8zm-8 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                
                {/* I-77 Corridor Badge */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="px-8 py-4 rounded-full shadow-lg" style={{ backgroundColor: '#FF6B35' }}>
                    <span className="text-white font-bold text-xl md:text-2xl tracking-wide">
                      I-77 CORRIDOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Service Areas */}
          <div className="order-1 lg:order-2 space-y-8">
            
            {/* North Carolina */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--dark-navy)' }}>
                NORTH CAROLINA
              </h3>
              <div className="flex flex-wrap gap-3">
                {ncCities.map((city, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 rounded-full border-2 transition-all duration-300 hover:shadow-md cursor-pointer"
                    style={{ 
                      borderColor: '#E2E8F0',
                      backgroundColor: 'white',
                      color: 'var(--dark-navy)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      e.currentTarget.style.backgroundColor = 'var(--primary-blue-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <span className="font-medium text-sm md:text-base">{city}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* South Carolina */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--dark-navy)' }}>
                SOUTH CAROLINA
              </h3>
              <div className="flex flex-wrap gap-3">
                {scCities.map((city, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 rounded-full border-2 transition-all duration-300 hover:shadow-md cursor-pointer"
                    style={{ 
                      borderColor: '#E2E8F0',
                      backgroundColor: 'white',
                      color: 'var(--dark-navy)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      e.currentTarget.style.backgroundColor = 'var(--primary-blue-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <span className="font-medium text-sm md:text-base">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Note */}
        <div className="text-center mt-16">
          <div className="inline-block px-8 py-4 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
            <p className="text-lg font-medium" style={{ color: 'var(--dark-navy)' }}>
              Plus surrounding areas within 50 miles of Charlotte & Columbia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;