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
    <section id="services" className="section-padding" style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 className="section-headline mb-4" style={{ color: 'var(--dark-navy)' }}>
            Our Services
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Comprehensive diesel repair services delivered directly to your location
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ marginBottom: 'var(--space-2xl)' }}>
          {services.map((service, index) => (
            <div
              key={index}
              className="feature-card"
            >
              <div className="text-4xl mb-4" style={{ color: 'var(--warning-orange)' }}>
                {service.icon}
              </div>
              <h3 className="small-heading mb-3" style={{ color: 'var(--dark-navy)' }}>
                {service.title}
              </h3>
              <p className="body-regular">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={scrollToServices}
            className="button-primary"
          >
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;