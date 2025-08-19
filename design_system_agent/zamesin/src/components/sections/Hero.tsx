import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-[#161C2D] overflow-hidden min-h-[500px] sm:min-h-[600px] lg:h-[770px] px-4 sm:px-8 lg:px-[165px]">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Subtle dot patterns on the right side - hidden on mobile */}
        <div className="hidden lg:block absolute top-20 right-20 w-48 h-48 opacity-10">
          <div className="grid grid-cols-8 gap-4">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Additional dot pattern lower - hidden on mobile */}
        <div className="hidden lg:block absolute bottom-32 right-32 w-32 h-32 opacity-5">
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center min-h-full py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1110px] gap-8 lg:gap-[60px]">
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left w-full lg:max-w-[500px]">
            {/* Main Heading */}
            <h1 
              className="text-white mb-6 lg:mb-[30px]" 
              style={{ 
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                fontSize: 'clamp(32px, 8vw, 60px)',
                lineHeight: 'clamp(38px, 9vw, 65px)',
                letterSpacing: 'clamp(-1px, -0.2vw, -2px)',
              }}
            >
              Get more visitors,<br />get more sales.
            </h1>
            
            {/* Description */}
            <p 
              className="text-white mb-6 lg:mb-[30px] max-w-full lg:max-w-[500px] mx-auto lg:mx-0" 
              style={{ 
                fontFamily: 'var(--font-inter)',
                fontWeight: 400,
                fontSize: 'clamp(16px, 4vw, 19px)',
                lineHeight: 'clamp(24px, 5vw, 32px)',
                letterSpacing: '-0.2px',
                opacity: 0.65,
              }}
            >
              With lots of unique blocks, you can easily build a page without coding. Build your next consultancy website within few minutes.
            </p>
            
            {/* CTA Link */}
            <a 
              href="#"
              className="inline-flex items-center text-[#B9FF66] hover:text-[#a3e659] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] rounded-lg px-2 py-1"
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: 'clamp(16px, 4vw, 19px)',
                lineHeight: 'clamp(24px, 5vw, 32px)',
                letterSpacing: '-0.2px'
              }}
              aria-label="Start a free trial"
            >
              Start a free trial
              <svg 
                className="ml-2" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                aria-hidden="true"
              >
                <path 
                  d="M1 8h14m-7-7l7 7-7 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Video/Image Section */}
          <div className="relative w-full max-w-[430px] lg:w-[430px] h-[250px] lg:h-[300px]">
            {/* Background Image */}
            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gray-700/30">
              <Image
                src="/images/hero-bg-image.png"
                alt="Hero Background"
                fill
                sizes="(max-width: 768px) 100vw, 430px"
                priority
                className="object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-[#161C2D] opacity-[0.1] rounded-xl" />
            </div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#B9FF66]"
                aria-label="Play video"
              >
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
                  <path d="M15 7.26795C16.3333 8.03775 16.3333 9.96225 15 10.732L3 17.1962C1.66667 17.966 8.88178e-07 17.0037 8.88178e-07 15.4641L8.88178e-07 2.5359C8.88178e-07 0.996304 1.66667 0.0339827 3 0.803848L15 7.26795Z" fill="#473BF0"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}