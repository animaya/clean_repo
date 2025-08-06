'use client'

import { ReactElement } from 'react';

interface ServiceArea {
  state: string;
  cities: string[];
}


const ServiceAreaMap = (): ReactElement => {
  const serviceAreas: ServiceArea[] = [
    {
      state: "North Carolina",
      cities: [
        "Charlotte", "Huntersville", "Concord", "Monroe", "Gastonia",
        "Indian Land", "Matthews", "Cornelius", "Mooresville",
        "Kannapolis", "Harrisburg"
      ]
    },
    {
      state: "South Carolina", 
      cities: [
        "Columbia", "Rock Hill", "Fort Mill", "Lexington",
        "West Columbia", "Irmo", "Blythewood", "York", "Chester",
        "Winnsboro", "Gaffney"
      ]
    }
  ];

  return (
    <section id="areas" className="section-padding" style={{ backgroundColor: 'var(--background-white)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 className="section-headline mb-6" style={{ color: 'var(--dark-navy)' }}>
            Service Area Map
          </h2>
        </div>
        
        {/* Map Placeholder */}
        <div className="max-w-3xl mx-auto" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div 
            className="rounded-3xl p-12 text-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, var(--primary-blue-light) 0%, var(--off-white) 100%)`
            }}
          >
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="subheading mb-2" style={{ color: 'var(--dark-navy)' }}>
              Serving Charlotte &amp; Columbia Metro Areas
            </h3>
            <p className="body-large">
              Professional mobile diesel repair services across NC and SC
            </p>
          </div>
        </div>
        
        {/* Service Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {serviceAreas.map((area, index) => (
            <div key={index} className="text-center lg:text-left">
              <h3 className="subheading mb-6" style={{ color: 'var(--dark-navy)' }}>
                {area.state}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {area.cities.map((city, cityIndex) => (
                  <div
                    key={cityIndex}
                    className="rounded-lg px-4 py-3 font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--off-white)',
                      color: 'var(--medium-gray)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-blue-light)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--off-white)'}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Coverage Note */}
        <div className="text-center mt-12">
          <p className="body-large italic font-medium" style={{ color: 'var(--primary-blue)' }}>
            Plus surrounding areas within 50 miles of Charlotte &amp; Columbia
          </p>
          <div 
            className="mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3"
            style={{ backgroundColor: 'var(--primary-blue-light)' }}
          >
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--success-green)' }}></div>
            <span className="font-semibold" style={{ color: 'var(--dark-navy)' }}>
              Available 24/7 for Emergency Service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;