'use client'

import { ReactElement } from 'react';

interface USP {
  icon: string;
  title: string;
  description: string;
}


const USPSection = (): ReactElement => {
  const usps: USP[] = [
    {
      icon: "⭐",
      title: "Quality of Work",
      description: "Expert repairs by seasoned diesel mechanics."
    },
    {
      icon: "🔍",
      title: "Attention to Detail", 
      description: "Thorough inspections and meticulous work."
    },
    {
      icon: "💯",
      title: "Transparency & Honesty",
      description: "No hidden fees, just upfront pricing and clear communication."
    },
    {
      icon: "⚡",
      title: "Speed & Efficiency",
      description: "We work fast to get your fleet back on the road."
    },
    {
      icon: "📞",
      title: "Always Responsive",
      description: "We&apos;re always available and keep you updated every step of the way."
    },
    {
      icon: "✅",
      title: "Satisfaction Guaranteed",
      description: "We stand behind our work with a comprehensive warranty and your complete satisfaction is our priority."
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--primary-blue-light)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 className="section-headline mb-4" style={{ color: 'var(--dark-navy)' }}>
            Why Choose Diesel Dudes?
          </h2>
          <p className="body-large max-w-3xl mx-auto">
            We&apos;re not just mechanics – we&apos;re your trusted partners in keeping your fleet operational
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="feature-card"
            >
              <div className="text-4xl mb-4" style={{ color: 'var(--primary-blue)' }}>
                {usp.icon}
              </div>
              <h3 className="small-heading mb-3" style={{ color: 'var(--dark-navy)' }}>
                {usp.title}
              </h3>
              <p className="body-regular">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional Trust Indicators */}
        <div 
          className="rounded-2xl p-8 feature-card"
          style={{ 
            marginTop: 'var(--space-3xl)',
            backgroundColor: 'var(--background-white)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-blue)' }}>15+</div>
              <div className="body-small font-medium">Years Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-blue)' }}>24/7</div>
              <div className="body-small font-medium">Emergency Service</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-blue)' }}>100%</div>
              <div className="body-small font-medium">Satisfaction Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-blue)' }}>50+</div>
              <div className="body-small font-medium">Mile Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;