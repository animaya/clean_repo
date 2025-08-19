import Image from 'next/image'

export default function ContentSections() {
  return (
    <>
      {/* Progress Tracking Section */}
      <section className="bg-white py-12 px-4 sm:py-20 lg:py-[120px] sm:px-8 lg:px-[164px]">
        <div className="max-w-[1102px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-[102px]">
            {/* Left Side - Dashboard Image */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="relative w-full max-w-[500px] h-[280px] lg:h-[383px] mx-auto">
                <Image
                  src="/images/dashboard-laptop-56586a.png"
                  alt="Dashboard Interface"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
              <h2 
                className="mb-6 lg:mb-[30px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 6vw, 48px)',
                  lineHeight: 'clamp(34px, 7vw, 58px)',
                  letterSpacing: 'clamp(-0.5px, -0.15vw, -0.96px)',
                }}
              >
                Track your progress with our advanced site.
              </h2>
              
              <p 
                className="mb-6 lg:mb-[40px] max-w-[500px] mx-auto lg:mx-0"
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 4vw, 19px)',
                  lineHeight: 'clamp(24px, 5vw, 32px)',
                  letterSpacing: '-0.2px',
                }}
              >
                We share common trends and strategies for improving your rental income and making sure you stay in high demand.
              </p>
              
              <a
                href="#"
                className="inline-flex items-center justify-center bg-[#473BF0] text-white rounded-lg hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] px-6 py-3 lg:px-8 lg:py-4"
                style={{
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 3vw, 17px)',
                  lineHeight: '21px',
                  letterSpacing: '-0.5px',
                }}
                aria-label="Start a free trial"
              >
                <span>Start a free trial</span>
                <div className="ml-2 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 8h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="bg-white py-12 px-4 sm:py-20 lg:py-[120px] sm:px-8 lg:px-[164px]">
        <div className="max-w-[1102px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-[102px]">
            {/* Left Side - Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 
                className="mb-6 lg:mb-[30px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 6vw, 48px)',
                  lineHeight: 'clamp(34px, 7vw, 58px)',
                  letterSpacing: 'clamp(-0.5px, -0.15vw, -0.96px)',
                }}
              >
                Understand your visitors fast. Take quick actions.
              </h2>
              
              <p 
                className="mb-6 lg:mb-[40px] max-w-[500px] mx-auto lg:mx-0"
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 4vw, 19px)',
                  lineHeight: 'clamp(24px, 5vw, 32px)',
                  letterSpacing: '-0.2px',
                }}
              >
                We share common trends and strategies for improving your rental income and making sure you stay in high demand.
              </p>
              
              <a
                href="#"
                className="inline-flex items-center justify-center bg-[#473BF0] text-white rounded-lg hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] px-6 py-3 lg:px-8 lg:py-4"
                style={{
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 3vw, 17px)',
                  lineHeight: '21px',
                  letterSpacing: '-0.5px',
                }}
                aria-label="Start a free trial"
              >
                <span>Start a free trial</span>
                <div className="ml-2 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 8h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Right Side - Analytics Images */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full max-w-[500px] h-[280px] lg:h-[383px] mx-auto">
                <div className="absolute left-0 top-0 w-1/2 h-1/2">
                  <Image
                    src="/images/analytics-illustration-48e811.png"
                    alt="Analytics Chart"
                    fill
                    sizes="250px"
                    className="object-contain"
                  />
                </div>
                <div className="absolute right-0 bottom-0 w-3/5 h-3/5">
                  <Image
                    src="/images/dashboard-chart-56586a.png"
                    alt="Dashboard Interface"
                    fill
                    sizes="300px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service Section */}
      <section className="bg-white py-12 px-4 sm:py-20 lg:py-[120px] sm:px-8 lg:px-[164px]">
        <div className="max-w-[1102px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-[102px]">
            {/* Left Side - Service Images */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="relative w-full max-w-[500px] h-[280px] lg:h-[383px] mx-auto">
                <div className="grid grid-cols-2 gap-2 lg:gap-4 h-full">
                  <div className="relative">
                    <Image
                      src="/images/service-image-1.png"
                      alt="Customer service experience"
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/service-image-2.png"
                      alt="Customer engagement"
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/service-image-3.png"
                      alt="Service delivery"
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-contain"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/service-image-4.png"
                      alt="Customer satisfaction"
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
              <h2 
                className="mb-6 lg:mb-[30px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 6vw, 48px)',
                  lineHeight: 'clamp(34px, 7vw, 58px)',
                  letterSpacing: 'clamp(-0.5px, -0.15vw, -0.96px)',
                }}
              >
                Make your customers happy by giving services.
              </h2>
              
              <p 
                className="mb-6 lg:mb-[40px] max-w-[500px] mx-auto lg:mx-0"
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 4vw, 19px)',
                  lineHeight: 'clamp(24px, 5vw, 32px)',
                  letterSpacing: '-0.2px',
                }}
              >
                We share common trends and strategies for improving your rental income and making sure you stay in high demand.
              </p>
              
              <a
                href="#"
                className="inline-flex items-center justify-center bg-[#473BF0] text-white rounded-lg hover:bg-[#3730e6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B9FF66] px-6 py-3 lg:px-8 lg:py-4"
                style={{
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 3vw, 17px)',
                  lineHeight: '21px',
                  letterSpacing: '-0.5px',
                }}
                aria-label="Start a free trial"
              >
                <span>Start a free trial</span>
                <div className="ml-2 flex items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M1 8h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}