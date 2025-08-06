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
    <section id="areas" className="bg-white section-padding">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#163763] mb-6 font-heading">
            Service Area Map
          </h2>
        </div>
        
        {/* Map Placeholder */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-[#EAF2F8] to-[#F9FBFC] rounded-3xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-[#163763] mb-2">
              Serving Charlotte &amp; Columbia Metro Areas
            </h3>
            <p className="text-gray-600 text-lg">
              Professional mobile diesel repair services across NC and SC
            </p>
          </div>
        </div>
        
        {/* Service Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {serviceAreas.map((area, index) => (
            <div key={index} className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-[#163763] mb-6 font-heading">
                {area.state}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {area.cities.map((city, cityIndex) => (
                  <div
                    key={cityIndex}
                    className="bg-[#F9FBFC] rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-[#EAF2F8] transition-colors"
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
          <p className="text-[#345E8D] italic text-lg font-medium">
            Plus surrounding areas within 50 miles of Charlotte &amp; Columbia
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-[#EAF2F8] rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-[#5FA85B] rounded-full animate-pulse"></div>
            <span className="text-[#163763] font-semibold">
              Available 24/7 for Emergency Service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;