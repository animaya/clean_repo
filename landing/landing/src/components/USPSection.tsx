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
    <section className="bg-[#EAF2F8] section-padding">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#163763] mb-4 font-heading">
            Why Choose Diesel Dudes?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We&apos;re not just mechanics – we&apos;re your trusted partners in keeping your fleet operational
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="card-hover bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4 text-[#FF9F1C]">
                {usp.icon}
              </div>
              <h3 className="text-xl font-bold text-[#163763] mb-3 font-heading">
                {usp.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#FF9F1C] mb-2">15+</div>
              <div className="text-sm text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#FF9F1C] mb-2">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Emergency Service</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#FF9F1C] mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#FF9F1C] mb-2">50+</div>
              <div className="text-sm text-gray-600 font-medium">Mile Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;