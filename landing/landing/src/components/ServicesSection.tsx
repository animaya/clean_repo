'use client'

import { ReactElement } from 'react';

interface Service {
  icon: string;
  title: string;
  description: string;
}


const ServicesSection = (): ReactElement => {
  const services: Service[] = [
    {
      icon: "🔧",
      title: "Tires",
      description: "Mobile tire repairs, replacements, and balancing."
    },
    {
      icon: "🛑",
      title: "Brakes",
      description: "Full brake inspections, replacements, and adjustments."
    },
    {
      icon: "⛽",
      title: "Fuel Systems",
      description: "Fuel line, pump repairs, and emergency fuel delivery."
    },
    {
      icon: "⚡",
      title: "Electrical",
      description: "Diagnostics and electrical system repairs."
    },
    {
      icon: "🔋",
      title: "Batteries",
      description: "Mobile battery replacements and charging solutions."
    },
    {
      icon: "💨",
      title: "Airbags",
      description: "Diagnose and repair air suspension issues."
    },
    {
      icon: "⚙️",
      title: "Wheel Seals",
      description: "Prevent leaks and ensure smooth operation."
    },
    {
      icon: "🔄",
      title: "Alternators & Starters",
      description: "On-site replacements to keep your truck moving."
    }
  ];

  const scrollToServices = (): void => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="bg-[#F9FBFC] section-padding">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#163763] mb-4 font-heading">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive diesel repair services delivered directly to your location
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-hover bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-4 text-[#FF9F1C]">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#163763] mb-3 font-heading">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={scrollToServices}
            className="button-primary px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl"
          >
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;