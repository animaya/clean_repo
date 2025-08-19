'use client'

import { useState } from 'react'

const pricingPlans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/ month',
    billing: 'billed monthly',
    features: [
      'Commercial License',
      '100+ HTML UI Elements',
      '01 Domain Support',
      '6 Month Premium Support',
      'Lifetime Updates'
    ]
  },
  {
    name: 'Standard',
    price: '$49',
    period: '/ month',
    billing: 'billed monthly',
    features: [
      'Commercial License',
      '100+ HTML UI Elements',
      'Unlimited Domain Support',
      '6 Month Premium Support',
      'Lifetime Updates'
    ],
    highlighted: true
  },
  {
    name: 'Premium',
    price: '$99',
    period: '/ month',
    billing: 'billed monthly',
    features: [
      'Commercial License',
      '100+ HTML UI Elements',
      'Unlimited Domain Support',
      '6 Month Premium Support',
      'Lifetime Updates'
    ]
  }
]

const testimonials = [
  {
    quote: '"OMG! I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish."',
    author: 'Diego Morata',
    role: 'Web Developer'
  },
  {
    quote: '"Simply the best. Better than all the rest. I\'d recommend this product to beginners and advanced users."',
    author: 'Franklin Hicks',
    role: 'Digital Marketer'
  }
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="bg-[#ECF2F7] px-4 sm:px-8 lg:px-[164px] py-[60px] sm:py-[80px] lg:py-[120px]">
      <div className="max-w-[1100px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-[60px]">
          <h2 
            className="mb-[24px]"
            style={{
              color: '#161C2D',
              fontFamily: 'Gilroy',
              fontWeight: 700,
              fontSize: 'clamp(32px, 6vw, 48px)',
              lineHeight: 'clamp(38px, 7vw, 58px)',
              letterSpacing: 'clamp(-0.5px, -0.15vw, -0.96px)'
            }}
          >
            Pricing & Plans
          </h2>
          <p 
            style={{
              color: '#161C2D',
              opacity: 0.7,
              fontFamily: 'Gilroy',
              fontWeight: 400,
              fontSize: 'clamp(16px, 4vw, 19px)',
              lineHeight: 'clamp(24px, 5vw, 32px)',
              letterSpacing: '-0.2px',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-[60px]">
          <div className="flex items-center bg-white rounded-lg p-2 shadow-sm">
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                !isYearly 
                  ? 'bg-[#473BF0] text-white' 
                  : 'text-[#161C2D] hover:bg-gray-50'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isYearly 
                  ? 'bg-[#473BF0] text-white' 
                  : 'text-[#161C2D] hover:bg-gray-50'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly
            </button>
            {isYearly && (
              <div className="ml-2 bg-[#B9FF66] text-[#161C2D] px-3 py-1 rounded-full text-sm font-bold">
                SAVE 25%
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-[80px]">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl p-8 shadow-sm ${
                plan.highlighted ? 'ring-2 ring-[#473BF0] scale-105' : ''
              }`}
            >
              <div className="text-center mb-6">
                <h3 
                  className="mb-4"
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px'
                  }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '48px',
                      lineHeight: '58px'
                    }}
                  >
                    {plan.price}
                  </span>
                  <span 
                    className="ml-2"
                    style={{
                      color: '#161C2D',
                      opacity: 0.7,
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '19px',
                      lineHeight: '32px'
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px'
                  }}
                >
                  {plan.billing}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-[#27AE60] mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.8,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '17px',
                        lineHeight: '29px'
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full bg-[#473BF0] text-white rounded-lg py-4 font-bold text-lg hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] flex items-center justify-center"
                style={{
                  fontFamily: 'Gilroy',
                  fontSize: '17px',
                  lineHeight: '21px',
                  letterSpacing: '-0.5px'
                }}
              >
                Start Free Trial
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <p 
                className="text-center mt-4"
                style={{
                  color: '#161C2D',
                  opacity: 0.5,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '26px'
                }}
              >
                No credit card required
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
              <div 
                className="text-6xl opacity-20 mb-4"
                style={{ color: '#161C2D' }}
              >
                "
              </div>
              <p 
                className="mb-6"
                style={{
                  color: '#161C2D',
                  opacity: 0.8,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '19px',
                  lineHeight: '32px',
                  letterSpacing: '-0.2px'
                }}
              >
                {testimonial.quote}
              </p>
              <div>
                <p 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '29px'
                  }}
                >
                  {testimonial.author}
                </p>
                <p 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px'
                  }}
                >
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}