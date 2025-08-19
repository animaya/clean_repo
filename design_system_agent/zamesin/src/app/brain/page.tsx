import Image from 'next/image'

export default function BrainLanding() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="relative bg-[#161C2D] px-[165px] py-6">
        <nav className="flex items-center justify-between" style={{ width: '1110px', height: '50px' }}>
          {/* Logo */}
          <div 
            className="text-white"
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '28px',
              letterSpacing: '-0.13px',
              width: '154px',
              height: '28px'
            }}
          >
            Brainwave.io
          </div>
          
          {/* Navigation Links */}
          <div 
            className="text-white"
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: '26px',
              letterSpacing: '-0.1px',
              width: '333px',
              height: '26px',
              textAlign: 'right'
            }}
          >
            Demos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pages&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Support&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contact
          </div>
          
          {/* CTA Button */}
          <button 
            className="bg-[#473BF0] text-white rounded-lg flex items-center justify-center hover:bg-[#3730e6] transition-colors"
            style={{
              width: '183px',
              height: '50px',
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: '17px',
              lineHeight: '21px',
              letterSpacing: '-0.5px'
            }}
          >
            Start a free trial
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#161C2D] overflow-hidden" style={{ height: '770px' }}>
        {/* Background */}
        <div className="absolute inset-0">
          {/* Subtle dot patterns on the right side */}
          <div className="absolute top-20 right-20 w-48 h-48 opacity-10">
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Additional dot pattern lower */}
          <div className="absolute bottom-32 right-32 w-32 h-32 opacity-5">
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-full px-[165px]">
          <div className="flex items-center justify-between w-full max-w-[1110px] gap-[60px]">
            {/* Content Section */}
            <div className="flex-1" style={{ maxWidth: '500px' }}>
              {/* Main Heading */}
              <h1 
                className="text-white mb-[30px]" 
                style={{ 
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '60px',
                  lineHeight: '65px',
                  letterSpacing: '-2px',
                  width: '541px',
                  height: '130px'
                }}
              >
                Get more visitors,<br />get more sales.
              </h1>
              
              {/* Description */}
              <p 
                className="text-white mb-[30px]" 
                style={{ 
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 400,
                  fontSize: '19px',
                  lineHeight: '32px',
                  letterSpacing: '-0.2px',
                  opacity: 0.65,
                  width: '500px',
                  height: '96px'
                }}
              >
                With lots of unique blocks, you can easily build a page without coding. Build your next consultancy website within few minutes.
              </p>
              
              {/* CTA Link */}
              <a 
                href="#"
                className="inline-flex items-center text-[#B9FF66] hover:text-[#a3e659] transition-colors"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  fontSize: '19px',
                  lineHeight: '32px',
                  letterSpacing: '-0.2px'
                }}
              >
                Start a free trial
                <svg 
                  className="ml-2" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
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
            <div className="relative" style={{ width: '430px', height: '300px' }}>
              {/* Background Image */}
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gray-700/30">
                <Image
                  src="/images/hero-bg-image.png"
                  alt="Hero Background"
                  fill
                  className="object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-[#161C2D] opacity-[0.1] rounded-xl" />
              </div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M15 7.26795C16.3333 8.03775 16.3333 9.96225 15 10.732L3 17.1962C1.66667 17.966 8.88178e-07 17.0037 8.88178e-07 15.4641L8.88178e-07 2.5359C8.88178e-07 0.996304 1.66667 0.0339827 3 0.803848L15 7.26795Z" fill="#473BF0"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white" style={{ padding: '120px 164px' }}>
        <div className="flex items-start justify-center gap-[24px]" style={{ width: '1112px', height: '135px', margin: '0 auto' }}>
          {/* Feature 1 - Organize your campaigns */}
          <div className="flex items-start" style={{ width: '344px', height: '134px' }}>
            {/* Icon Container */}
            <div className="relative flex-shrink-0 mr-[25px]" style={{ width: '35px', height: '37px', marginTop: '9px' }}>
              {/* Layers Icon */}
              <div className="absolute inset-0">
                <Image
                  src="/images/layers-icon-overlay.svg"
                  alt=""
                  width={35}
                  height={27}
                  style={{ position: 'absolute', top: '0px', left: '0px' }}
                />
                <Image
                  src="/images/layers-icon.svg"
                  alt=""
                  width={35}
                  height={16}
                  style={{ position: 'absolute', top: '21px', left: '0px' }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 
                className="mb-[15px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: '21px',
                  lineHeight: '32px',
                  letterSpacing: '-0.5px',
                  width: '240px',
                  height: '32px'
                }}
              >
                Organize your campaigns
              </h3>
              <p 
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '17px',
                  lineHeight: '29px',
                  letterSpacing: '-0.2px',
                  width: '283px',
                  height: '87px'
                }}
              >
                With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
              </p>
            </div>
          </div>

          {/* Feature 2 - Manage customers */}
          <div className="flex items-start" style={{ width: '341px', height: '134px' }}>
            {/* Icon Container */}
            <div className="relative flex-shrink-0 mr-[25px]" style={{ width: '37px', height: '38px', marginTop: '9px' }}>
              {/* Sync Icon */}
              <div className="absolute inset-0">
                <Image
                  src="/images/sync-icon-main.svg"
                  alt=""
                  width={18}
                  height={21}
                  style={{ position: 'absolute', top: '0px', left: '8px' }}
                />
                <Image
                  src="/images/sync-icon-part1.svg"
                  alt=""
                  width={13}
                  height={7}
                  style={{ position: 'absolute', top: '23px', left: '24px' }}
                />
                <Image
                  src="/images/sync-icon-part2.svg"
                  alt=""
                  width={13}
                  height={7}
                  style={{ position: 'absolute', top: '31px', left: '24px' }}
                />
                <Image
                  src="/images/sync-icon-base.svg"
                  alt=""
                  width={25}
                  height={12}
                  style={{ position: 'absolute', top: '24px', left: '0px' }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 
                className="mb-[15px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: '21px',
                  lineHeight: '32px',
                  letterSpacing: '-0.5px',
                  width: '179px',
                  height: '32px'
                }}
              >
                Manage customers
              </h3>
              <p 
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '17px',
                  lineHeight: '29px',
                  letterSpacing: '-0.2px',
                  width: '275px',
                  height: '87px'
                }}
              >
                With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
              </p>
            </div>
          </div>

          {/* Feature 3 - Track progress fast */}
          <div className="flex items-start" style={{ width: '353px', height: '134px' }}>
            {/* Icon Container */}
            <div className="relative flex-shrink-0 mr-[26px]" style={{ width: '34px', height: '34px', marginTop: '9px' }}>
              {/* Chart Bars Icon */}
              <div className="absolute inset-0">
                <Image
                  src="/images/chart-bar-1.svg"
                  alt=""
                  width={7}
                  height={15}
                  style={{ position: 'absolute', top: '19px', left: '14px' }}
                />
                <Image
                  src="/images/chart-bar-2.svg"
                  alt=""
                  width={7}
                  height={7}
                  style={{ position: 'absolute', top: '27px', left: '0px' }}
                />
                <Image
                  src="/images/chart-bar-3.svg"
                  alt=""
                  width={7}
                  height={22}
                  style={{ position: 'absolute', top: '12px', left: '27px' }}
                />
                <Image
                  src="/images/chart-bar-base.svg"
                  alt=""
                  width={25}
                  height={13}
                  style={{ position: 'absolute', top: '0px', left: '3px' }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 
                className="mb-[15px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: '21px',
                  lineHeight: '32px',
                  letterSpacing: '-0.5px',
                  width: '175px',
                  height: '32px'
                }}
              >
                Track progress fast
              </h3>
              <p 
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '17px',
                  lineHeight: '29px',
                  letterSpacing: '-0.2px',
                  width: '292px',
                  height: '87px'
                }}
              >
                With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="bg-white" style={{ padding: '120px 164px' }}>
        <div className="relative" style={{ width: '1102px', height: '424px', margin: '0 auto' }}>
          {/* Left Side - Dashboard Image */}
          <div className="absolute" style={{ left: '0px', top: '0px', width: '500px', height: '383px' }}>
            {/* Background shadow containers */}
            <div 
              className="absolute bg-[#94A2B6] rounded-lg"
              style={{
                left: '0px',
                top: '0px',
                width: '500px',
                height: '383px',
                boxShadow: '0px 42px 44px -10px rgba(1, 23, 48, 0.12)'
              }}
            />
            <div 
              className="absolute bg-[#94A2B6] rounded-lg"
              style={{
                left: '0px',
                top: '0px',
                width: '500px',
                height: '383px',
                boxShadow: '0px 42px 44px -10px rgba(1, 23, 48, 0.12)'
              }}
            />
            
            {/* Main Dashboard Image */}
            <div 
              className="absolute"
              style={{
                left: '-1px',
                top: '-1px',
                width: '579px',
                height: '417px'
              }}
            >
              <Image
                src="/images/dashboard-laptop-56586a.png"
                alt="Dashboard Interface"
                width={479}
                height={317}
                className="rounded-lg"
                style={{
                  width: '579px',
                  height: '417px'
                }}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="absolute" style={{ left: '692px', top: '84px', width: '410px', height: '280px' }}>
            {/* Main Heading */}
            <h2 
              className="absolute"
              style={{
                left: '0px',
                top: '0px',
                color: '#161C2D',
                fontFamily: 'Gilroy',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                letterSpacing: '-1.2px',
                width: '389px',
                height: '96px'
              }}
            >
              Track your progress with our advanced site.
            </h2>

            {/* Description */}
            <p 
              className="absolute"
              style={{
                left: '0px',
                top: '117px',
                color: '#161C2D',
                opacity: 0.7,
                fontFamily: 'Gilroy',
                fontWeight: 400,
                fontSize: '19px',
                lineHeight: '32px',
                letterSpacing: '-0.2px',
                width: '410px',
                height: '96px'
              }}
            >
              We share common trends and strategies for improving your rental income and making sure you stay in high demand.
            </p>

            {/* CTA Button */}
            <div className="absolute" style={{ left: '0px', top: '248px', width: '180px', height: '32px' }}>
              <a 
                href="#"
                className="absolute flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  left: '0px',
                  top: '-1px',
                  width: '177.62px',
                  height: '32px'
                }}
              >
                <span
                  className="absolute"
                  style={{
                    left: '0px',
                    top: '0px',
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '32px',
                    letterSpacing: '-1.2px',
                    width: '135px',
                    height: '32px'
                  }}
                >
                  Start a free trial
                </span>
                
                {/* Arrow Icon Group */}
                <div 
                  className="absolute"
                  style={{
                    left: '165px',
                    top: '10px',
                    width: '13px',
                    height: '11.27px'
                  }}
                >
                  {/* Arrow Path 1 */}
                  <svg 
                    className="absolute"
                    width="7" 
                    height="12" 
                    viewBox="0 0 7 12" 
                    fill="none"
                    style={{
                      left: '6.93px',
                      top: '0px'
                    }}
                  >
                    <path 
                      d="M1 1L6 6L1 11" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Arrow Path 2 */}
                  <svg 
                    className="absolute"
                    width="13" 
                    height="2" 
                    viewBox="0 0 13 2" 
                    fill="none"
                    style={{
                      left: '0px',
                      top: '4.33px'
                    }}
                  >
                    <path 
                      d="M0 1H12" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Section */}
      <section className="bg-white" style={{ padding: '120px 164px' }}>
        <div className="relative" style={{ width: '1110px', height: '468px', margin: '0 auto' }}>
          {/* Left Side - Content */}
          <div className="absolute" style={{ left: '0px', top: '94px', width: '434px', height: '280px' }}>
            {/* Main Heading */}
            <h2 
              className="absolute"
              style={{
                left: '0px',
                top: '0px',
                color: '#161C2D',
                fontFamily: 'Gilroy',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                letterSpacing: '-1.2px',
                width: '404px',
                height: '96px'
              }}
            >
              Understand your visitors fast. Take quick actions.
            </h2>

            {/* Description */}
            <p 
              className="absolute"
              style={{
                left: '0px',
                top: '117px',
                color: '#161C2D',
                opacity: 0.7,
                fontFamily: 'Gilroy',
                fontWeight: 400,
                fontSize: '19px',
                lineHeight: '32px',
                letterSpacing: '-0.2px',
                width: '434px',
                height: '96px'
              }}
            >
              We share common trends and strategies for improving your rental income and making sure you stay in high demand.
            </p>

            {/* CTA Button */}
            <div className="absolute" style={{ left: '0px', top: '248px', width: '180px', height: '32px' }}>
              <a 
                href="#"
                className="absolute flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  left: '0px',
                  top: '-1px',
                  width: '177.62px',
                  height: '32px'
                }}
              >
                <span
                  className="absolute"
                  style={{
                    left: '0px',
                    top: '0px',
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '32px',
                    letterSpacing: '-1.2px',
                    width: '135px',
                    height: '32px'
                  }}
                >
                  Start a free trial
                </span>
                
                {/* Arrow Icon Group */}
                <div 
                  className="absolute"
                  style={{
                    left: '165px',
                    top: '10px',
                    width: '13px',
                    height: '11.27px'
                  }}
                >
                  {/* Arrow Path 1 */}
                  <svg 
                    className="absolute"
                    width="7" 
                    height="12" 
                    viewBox="0 0 7 12" 
                    fill="none"
                    style={{
                      left: '6.93px',
                      top: '0px'
                    }}
                  >
                    <path 
                      d="M1 1L6 6L1 11" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Arrow Path 2 */}
                  <svg 
                    className="absolute"
                    width="13" 
                    height="2" 
                    viewBox="0 0 13 2" 
                    fill="none"
                    style={{
                      left: '0px',
                      top: '4.33px'
                    }}
                  >
                    <path 
                      d="M0 1H12" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Right Side - Dashboard Visualization */}
          <div className="absolute" style={{ left: '601px', top: '0px', width: '509px', height: '468px' }}>
            {/* Background Chart Image */}
            <div 
              className="absolute rounded-lg"
              style={{
                left: '245px',
                top: '47px',
                width: '264px',
                height: '382px',
                opacity: 0.48
              }}
            >
              <Image
                src="/images/dashboard-chart-56586a.png"
                alt="Analytics Chart"
                width={264}
                height={382}
                className="rounded-lg object-cover"
              />
            </div>

            {/* Main Dashboard Interface */}
            <div 
              className="absolute rounded-lg"
              style={{
                left: '0px',
                top: '0px',
                width: '327px',
                height: '468px',
                boxShadow: '0px 31px 34px -20px rgba(0, 0, 0, 0.09)'
              }}
            >
              <div className="relative w-full h-full bg-[#161C2D] rounded-lg overflow-hidden">
                <Image
                  src="/images/dashboard-main-56586a.png"
                  alt="Dashboard Interface"
                  width={327}
                  height={468}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Services Section */}
      <section className="bg-white" style={{ padding: '120px 164px' }}>
        <div className="relative" style={{ width: '1011px', height: '511px', margin: '0 auto' }}>
          {/* Left Side - Image Grid */}
          <div className="absolute" style={{ left: '0px', top: '0px', width: '449px', height: '511px' }}>
            {/* Image 1 - Top Left */}
            <div 
              className="absolute rounded-lg overflow-hidden"
              style={{ 
                left: '0px', 
                top: '0px', 
                width: '212px', 
                height: '206px' 
              }}
            >
              <Image
                src="/images/service-image-1.png"
                alt="Customer service experience"
                width={212}
                height={206}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Image 2 - Top Right */}
            <div 
              className="absolute rounded-lg overflow-hidden"
              style={{ 
                left: '237px', 
                top: '25px', 
                width: '212px', 
                height: '255px' 
              }}
            >
              <Image
                src="/images/service-image-3.png"
                alt="Customer engagement"
                width={212}
                height={255}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Image 3 - Bottom Left */}
            <div 
              className="absolute rounded-lg overflow-hidden"
              style={{ 
                left: '0px', 
                top: '231px', 
                width: '212px', 
                height: '255px' 
              }}
            >
              <Image
                src="/images/service-image-4.png"
                alt="Service delivery"
                width={212}
                height={255}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Image 4 - Bottom Right */}
            <div 
              className="absolute rounded-lg overflow-hidden"
              style={{ 
                left: '237px', 
                top: '305px', 
                width: '212px', 
                height: '206px' 
              }}
            >
              <Image
                src="/images/service-image-2.png"
                alt="Customer satisfaction"
                width={212}
                height={206}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="absolute" style={{ left: '601px', top: '138px', width: '410px', height: '280px' }}>
            {/* Main Heading */}
            <h2 
              className="absolute"
              style={{
                left: '0px',
                top: '0px',
                color: '#161C2D',
                fontFamily: 'Gilroy',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                letterSpacing: '-1.2px',
                width: '410px',
                height: '96px'
              }}
            >
              Make your customers happy by giving services.
            </h2>

            {/* Description */}
            <p 
              className="absolute"
              style={{
                left: '0px',
                top: '117px',
                color: '#161C2D',
                opacity: 0.7,
                fontFamily: 'Gilroy',
                fontWeight: 400,
                fontSize: '19px',
                lineHeight: '32px',
                letterSpacing: '-0.2px',
                width: '410px',
                height: '96px'
              }}
            >
              We share common trends and strategies for improving your rental income and making sure you stay in high demand.
            </p>

            {/* CTA Button */}
            <div className="absolute" style={{ left: '0px', top: '248px', width: '180px', height: '32px' }}>
              <a 
                href="#"
                className="absolute flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  left: '0px',
                  top: '-1px',
                  width: '177.62px',
                  height: '32px'
                }}
              >
                <span
                  className="absolute"
                  style={{
                    left: '0px',
                    top: '0px',
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '32px',
                    letterSpacing: '-1.2px',
                    width: '135px',
                    height: '32px'
                  }}
                >
                  Start a free trial
                </span>
                
                {/* Arrow Icon Group */}
                <div 
                  className="absolute"
                  style={{
                    left: '165px',
                    top: '10px',
                    width: '13px',
                    height: '11.27px'
                  }}
                >
                  {/* Arrow Path 1 */}
                  <svg 
                    className="absolute"
                    width="7" 
                    height="12" 
                    viewBox="0 0 7 12" 
                    fill="none"
                    style={{
                      left: '6.93px',
                      top: '0px'
                    }}
                  >
                    <path 
                      d="M1 1L6 6L1 11" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Arrow Path 2 */}
                  <svg 
                    className="absolute"
                    width="13" 
                    height="2" 
                    viewBox="0 0 13 2" 
                    fill="none"
                    style={{
                      left: '0px',
                      top: '4.33px'
                    }}
                  >
                    <path 
                      d="M0 1H12" 
                      stroke="#473BF0" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Plans Section */}
      <section className="bg-[#ECF2F7] px-4 sm:px-8 lg:px-[164px] py-[60px] sm:py-[80px] lg:py-[120px]">
        <div className="relative max-w-[1110px] mx-auto">
          {/* Desktop layout */}
          <div className="hidden lg:block relative" style={{ height: '1074px' }}>
            {/* Desktop Section Title */}
          {/* Section Title */}
          <div className="absolute" style={{ left: '170px', top: '0px', width: '769px', height: '129px' }}>
            <h2 
              className="absolute text-center"
              style={{
                left: '0px',
                top: '0px',
                color: '#161C2D',
                fontFamily: 'Gilroy',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '48px',
                letterSpacing: '-1.2px',
                width: '769px',
                height: '48px'
              }}
            >
              Pricing & Plans
            </h2>
            <p 
              className="absolute text-center"
              style={{
                left: '90px',
                top: '65px',
                color: '#161C2D',
                opacity: 0.7,
                fontFamily: 'Gilroy',
                fontWeight: 400,
                fontSize: '19px',
                lineHeight: '32px',
                letterSpacing: '-0.2px',
                width: '589px',
                height: '64px'
              }}
            >
              With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
            </p>
          </div>

          {/* Toggle Section */}
          <div className="absolute" style={{ left: '388px', top: '179px', width: '334px', height: '34px' }}>
            <div className="flex items-center justify-center gap-4">
              <span 
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '19px',
                  lineHeight: '32px',
                  letterSpacing: '-0.2px'
                }}
              >
                Monthly
              </span>
              
              {/* Toggle Switch - Yearly Selected */}
              <div className="relative" style={{ width: '72px', height: '33px' }}>
                <div 
                  className="absolute inset-0 bg-[#161C2D] opacity-15 rounded-full"
                  style={{ width: '72px', height: '33px' }}
                />
                <div 
                  className="absolute bg-white rounded-full shadow-sm"
                  style={{ 
                    width: '21px', 
                    height: '21px',
                    left: '44px',
                    top: '6px'
                  }}
                />
              </div>
              
              <span 
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '19px',
                  lineHeight: '32px',
                  letterSpacing: '-0.2px'
                }}
              >
                Yearly
              </span>
              
              {/* Save Badge */}
              <div 
                className="bg-[#473BF0] bg-opacity-10 rounded-full flex items-center justify-center"
                style={{ width: '95px', height: '29px', marginLeft: '12px' }}
              >
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '13px',
                    lineHeight: '16px',
                    letterSpacing: '1.625px',
                    textTransform: 'uppercase'
                  }}
                >
                  SAVE 25%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="absolute flex gap-[31px]" style={{ left: '0px', top: '263px', width: '1110px', height: '604px' }}>
            {/* Starter Plan */}
            <div 
              className="relative bg-white rounded-lg border border-[#E7E9ED]"
              style={{ width: '349px', height: '604px' }}
            >
              {/* Plan Header */}
              <div className="absolute" style={{ left: '49px', top: '37px', width: '78px', height: '16px' }}>
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '13px',
                    lineHeight: '16px',
                    letterSpacing: '1.625px',
                    textTransform: 'uppercase'
                  }}
                >
                  Starter
                </span>
              </div>

              {/* Pricing */}
              <div className="absolute" style={{ left: '49px', top: '93px', width: '134px', height: '65px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '65px',
                    letterSpacing: '-0.8px'
                  }}
                >
                  $19
                </span>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Rubik',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.094px',
                    marginLeft: '4px'
                  }}
                >
                  / month
                </span>
              </div>

              {/* Billing Info */}
              <div className="absolute" style={{ left: '49px', top: '169px', width: '95px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  billed monthly
                </span>
              </div>

              {/* Features List */}
              <div className="absolute" style={{ left: '49px', top: '233px', width: '251px', height: '176px' }}>
                {/* Commercial License */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Commercial License
                  </span>
                </div>

                {/* 100+ HTML UI Elements */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    100+ HTML UI Elements
                  </span>
                </div>

                {/* 01 Domain Support */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    01 Domain Support
                  </span>
                </div>

                {/* 6 Month Premium Support - Not Available */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <div className="w-[17px] h-[12px] mr-[11px] mt-[8px] flex-shrink-0 relative">
                    <Image
                      src="/images/cross-icon-path1.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                    <Image
                      src="/images/cross-icon-path2.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                  </div>
                  <span 
                    style={{
                      color: '#161C2D',
                      opacity: 0.7,
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    6 Month Premium Support
                  </span>
                </div>

                {/* Lifetime Updates - Not Available */}
                <div className="flex items-center" style={{ height: '29px' }}>
                  <div className="w-[17px] h-[12px] mr-[11px] mt-[8px] flex-shrink-0 relative">
                    <Image
                      src="/images/cross-icon-path1.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                    <Image
                      src="/images/cross-icon-path2.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                  </div>
                  <span 
                    style={{
                      color: '#161C2D',
                      opacity: 0.7,
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Lifetime Updates
                  </span>
                </div>
              </div>

              {/* CTA Button - Starter (Transparent with Border) */}
              <div className="absolute" style={{ left: '49px', top: '469px', width: '205px', height: '59px' }}>
                <button 
                  className="w-full h-full bg-transparent text-[#473BF0] rounded-lg border border-[#473BF0] border-opacity-20 flex items-center justify-center hover:bg-[#473BF0] hover:text-white hover:border-[#473BF0] transition-all group"
                  style={{
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '32px',
                    letterSpacing: '-0.6px'
                  }}
                >
                  Start Free Trial
                  <div className="ml-[36px] relative" style={{ width: '14px', height: '12px' }}>
                    <svg 
                      className="absolute group-hover:stroke-white transition-colors"
                      width="7" 
                      height="12" 
                      viewBox="0 0 7 12" 
                      fill="none"
                      style={{ right: '0px', top: '0px' }}
                    >
                      <path 
                        d="M1 1L6 6L1 11" 
                        stroke="#473BF0" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg 
                      className="absolute group-hover:stroke-white transition-colors"
                      width="13" 
                      height="2" 
                      viewBox="0 0 13 2" 
                      fill="none"
                      style={{ left: '0px', top: '5px' }}
                    >
                      <path 
                        d="M0 1H12" 
                        stroke="#473BF0" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* No Credit Card Required */}
              <div className="absolute" style={{ left: '49px', top: '540px', width: '157px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  No credit card required
                </span>
              </div>
            </div>

            {/* Standard Plan */}
            <div 
              className="relative bg-white rounded-lg border border-[#E7E9ED]"
              style={{ width: '349px', height: '604px' }}
            >
              {/* Plan Header */}
              <div className="absolute" style={{ left: '49px', top: '37px', width: '78px', height: '16px' }}>
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '13px',
                    lineHeight: '16px',
                    letterSpacing: '1.625px',
                    textTransform: 'uppercase'
                  }}
                >
                  Standard
                </span>
              </div>

              {/* Pricing */}
              <div className="absolute" style={{ left: '49px', top: '93px', width: '152px', height: '65px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '65px',
                    letterSpacing: '-0.8px'
                  }}
                >
                  $49
                </span>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Rubik',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.094px',
                    marginLeft: '4px'
                  }}
                >
                  / month
                </span>
              </div>

              {/* Billing Info */}
              <div className="absolute" style={{ left: '49px', top: '169px', width: '95px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  billed monthly
                </span>
              </div>

              {/* Features List */}
              <div className="absolute" style={{ left: '49px', top: '233px', width: '251px', height: '176px' }}>
                {/* Commercial License */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Commercial License
                  </span>
                </div>

                {/* 100+ HTML UI Elements */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    100+ HTML UI Elements
                  </span>
                </div>

                {/* Unlimited Domain Support */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Unlimited Domain Support
                  </span>
                </div>

                {/* 6 Month Premium Support */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    6 Month Premium Support
                  </span>
                </div>

                {/* Lifetime Updates - Not Available */}
                <div className="flex items-center" style={{ height: '29px' }}>
                  <div className="w-[17px] h-[12px] mr-[11px] mt-[8px] flex-shrink-0 relative">
                    <Image
                      src="/images/cross-icon-path1.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                    <Image
                      src="/images/cross-icon-path2.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="absolute"
                    />
                  </div>
                  <span 
                    style={{
                      color: '#161C2D',
                      opacity: 0.7,
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Lifetime Updates
                  </span>
                </div>
              </div>

              {/* CTA Button - Primary */}
              <div className="absolute" style={{ left: '49px', top: '469px', width: '205px', height: '59px' }}>
                <button 
                  className="w-full h-full bg-[#473BF0] text-white rounded-lg flex items-center justify-center hover:bg-[#3730e6] transition-colors group"
                  style={{
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '32px',
                    letterSpacing: '-0.6px'
                  }}
                >
                  Start Free Trial
                  <div className="ml-[36px] relative" style={{ width: '14px', height: '12px' }}>
                    <svg 
                      className="absolute"
                      width="7" 
                      height="12" 
                      viewBox="0 0 7 12" 
                      fill="none"
                      style={{ right: '0px', top: '0px' }}
                    >
                      <path 
                        d="M1 1L6 6L1 11" 
                        stroke="white" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg 
                      className="absolute"
                      width="13" 
                      height="2" 
                      viewBox="0 0 13 2" 
                      fill="none"
                      style={{ left: '0px', top: '5px' }}
                    >
                      <path 
                        d="M0 1H12" 
                        stroke="white" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* No Credit Card Required */}
              <div className="absolute" style={{ left: '49px', top: '540px', width: '157px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  No credit card required
                </span>
              </div>
            </div>

            {/* Premium Plan */}
            <div 
              className="relative bg-white rounded-lg border border-[#E7E9ED]"
              style={{ width: '349px', height: '604px' }}
            >
              {/* Plan Header */}
              <div className="absolute" style={{ left: '49px', top: '37px', width: '78px', height: '16px' }}>
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '13px',
                    lineHeight: '16px',
                    letterSpacing: '1.625px',
                    textTransform: 'uppercase'
                  }}
                >
                  Premium
                </span>
              </div>

              {/* Pricing */}
              <div className="absolute" style={{ left: '49px', top: '93px', width: '152px', height: '65px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '65px',
                    letterSpacing: '-0.8px'
                  }}
                >
                  $99
                </span>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Rubik',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.094px',
                    marginLeft: '4px'
                  }}
                >
                  / month
                </span>
              </div>

              {/* Billing Info */}
              <div className="absolute" style={{ left: '49px', top: '169px', width: '95px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  billed monthly
                </span>
              </div>

              {/* Features List */}
              <div className="absolute" style={{ left: '49px', top: '233px', width: '251px', height: '176px' }}>
                {/* Commercial License */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Commercial License
                  </span>
                </div>

                {/* 100+ HTML UI Elements */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    100+ HTML UI Elements
                  </span>
                </div>

                {/* Unlimited Domain Support */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Unlimited Domain Support
                  </span>
                </div>

                {/* 6 Month Premium Support */}
                <div className="flex items-center" style={{ height: '29px', marginBottom: '15px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    6 Month Premium Support
                  </span>
                </div>

                {/* Lifetime Updates */}
                <div className="flex items-center" style={{ height: '29px' }}>
                  <Image
                    src="/images/check-icon.svg"
                    alt=""
                    width={17}
                    height={12}
                    className="mr-[11px] mt-[8px] flex-shrink-0"
                  />
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 400,
                      fontSize: '17px',
                      lineHeight: '29px',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    Lifetime Updates
                  </span>
                </div>
              </div>

              {/* CTA Button - Premium (Transparent with Border) */}
              <div className="absolute" style={{ left: '49px', top: '469px', width: '205px', height: '59px' }}>
                <button 
                  className="w-full h-full bg-transparent text-[#473BF0] rounded-lg border border-[#473BF0] border-opacity-20 flex items-center justify-center hover:bg-[#473BF0] hover:text-white hover:border-[#473BF0] transition-all group"
                  style={{
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '32px',
                    letterSpacing: '-0.6px'
                  }}
                >
                  Start Free Trial
                  <div className="ml-[36px] relative" style={{ width: '14px', height: '12px' }}>
                    <svg 
                      className="absolute group-hover:stroke-white transition-colors"
                      width="7" 
                      height="12" 
                      viewBox="0 0 7 12" 
                      fill="none"
                      style={{ right: '0px', top: '0px' }}
                    >
                      <path 
                        d="M1 1L6 6L1 11" 
                        stroke="#473BF0" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg 
                      className="absolute group-hover:stroke-white transition-colors"
                      width="13" 
                      height="2" 
                      viewBox="0 0 13 2" 
                      fill="none"
                      style={{ left: '0px', top: '5px' }}
                    >
                      <path 
                        d="M0 1H12" 
                        stroke="#473BF0" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* No Credit Card Required */}
              <div className="absolute" style={{ left: '49px', top: '540px', width: '157px', height: '26px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '26px',
                    letterSpacing: '-0.1px'
                  }}
                >
                  No credit card required
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="absolute flex gap-[70px]" style={{ left: '0px', top: '974px', width: '1073px', height: '246px' }}>
            {/* Testimonial 1 */}
            <div className="relative" style={{ width: '502px', height: '246px' }}>
              {/* Quote Mark */}
              <div className="absolute" style={{ left: '-4px', top: '0px', width: '46px', height: '103px' }}>
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 600,
                    fontSize: '104px',
                    lineHeight: '103px',
                    letterSpacing: '-1.44px'
                  }}
                >
                  "
                </span>
              </div>

              {/* Testimonial Text */}
              <div className="absolute" style={{ left: '3px', top: '86px', width: '499px', height: '108px' }}>
                <p 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '34px',
                    letterSpacing: '-0.5px'
                  }}
                >
                  "OMG! I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish."
                </p>
              </div>

              {/* Author */}
              <div className="absolute" style={{ left: '3px', top: '217px', width: '232px', height: '29px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.2px'
                  }}
                >
                  Diego Morata
                </span>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.2px',
                    marginLeft: '8px'
                  }}
                >
                  Web Developer
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="relative" style={{ width: '502px', height: '246px' }}>
              {/* Quote Mark */}
              <div className="absolute" style={{ left: '-4px', top: '0px', width: '46px', height: '103px' }}>
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 600,
                    fontSize: '104px',
                    lineHeight: '103px',
                    letterSpacing: '-1.44px'
                  }}
                >
                  "
                </span>
              </div>

              {/* Testimonial Text */}
              <div className="absolute" style={{ left: '3px', top: '86px', width: '499px', height: '108px' }}>
                <p 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '34px',
                    letterSpacing: '-0.5px'
                  }}
                >
                  "Simply the best. Better than all the rest. I'd recommend this product to beginners and advanced users."
                </p>
              </div>

              {/* Author */}
              <div className="absolute" style={{ left: '3px', top: '217px', width: '235px', height: '29px' }}>
                <span 
                  style={{
                    color: '#161C2D',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.2px'
                  }}
                >
                  Franklin Hicks
                </span>
                <span 
                  style={{
                    color: '#161C2D',
                    opacity: 0.7,
                    fontFamily: 'Gilroy',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '29px',
                    letterSpacing: '-0.2px',
                    marginLeft: '8px'
                  }}
                >
                  Digital Marketer
                </span>
              </div>
            </div>
          </div>
          </div>

          {/* Mobile/Tablet Responsive Layout */}
          <div className="block lg:hidden">
            {/* Section Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 
                className="mb-4 sm:mb-6"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '36px',
                  letterSpacing: '-1px'
                }}
              >
                Pricing & Plans
              </h2>
              <p 
                className="mx-auto"
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '28px',
                  letterSpacing: '-0.1px',
                  maxWidth: '400px'
                }}
              >
                With lots of unique blocks, you can easily build a page without coding. Build your next landing page.
              </p>
            </div>

            {/* Toggle Section */}
            <div className="flex items-center justify-center gap-3 mb-8 sm:mb-12">
              <span 
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.1px'
                }}
              >
                Monthly
              </span>
              
              {/* Toggle Switch - Yearly Selected */}
              <div className="relative" style={{ width: '56px', height: '28px' }}>
                <div 
                  className="absolute inset-0 bg-[#161C2D] opacity-15 rounded-full"
                />
                <div 
                  className="absolute bg-white rounded-full"
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    left: '34px',
                    top: '6px'
                  }}
                />
              </div>
              
              <span 
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.1px'
                }}
              >
                Yearly
              </span>
              
              {/* Save Badge */}
              <div 
                className="bg-[#473BF0] bg-opacity-10 rounded-full flex items-center justify-center ml-2"
                style={{ width: '75px', height: '24px' }}
              >
                <span 
                  style={{
                    color: '#473BF0',
                    fontFamily: 'Gilroy',
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '14px',
                    letterSpacing: '1.25px',
                    textTransform: 'uppercase'
                  }}
                >
                  Save 25%
                </span>
              </div>
            </div>

            {/* Pricing Cards - Stacked on mobile, 2-column on tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Starter Plan - Mobile/Tablet */}
              <div className="bg-white rounded-lg border border-[#E7E9ED] p-6 sm:col-span-2 lg:col-span-1">
                <div className="mb-4">
                  <span 
                    style={{
                      color: '#473BF0',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '14px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Starter
                  </span>
                </div>

                <div className="mb-4">
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '32px',
                      lineHeight: '40px',
                      letterSpacing: '-1px'
                    }}
                  >
                    $19
                  </span>
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Rubik',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.1px',
                      marginLeft: '4px'
                    }}
                  >
                    / month
                  </span>
                  <div className="mt-1">
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.7,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      billed monthly
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Commercial License</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">100+ HTML UI Elements</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">01 Domain Support</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[14px] h-[10px] mr-3 mt-1 flex-shrink-0 relative">
                      <Image src="/images/cross-icon-path1.svg" alt="" width={10} height={10} className="absolute" />
                      <Image src="/images/cross-icon-path2.svg" alt="" width={10} height={10} className="absolute" />
                    </div>
                    <span className="text-sm text-[#161C2D] opacity-70">6 Month Premium Support</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[14px] h-[10px] mr-3 mt-1 flex-shrink-0 relative">
                      <Image src="/images/cross-icon-path1.svg" alt="" width={10} height={10} className="absolute" />
                      <Image src="/images/cross-icon-path2.svg" alt="" width={10} height={10} className="absolute" />
                    </div>
                    <span className="text-sm text-[#161C2D] opacity-70">Lifetime Updates</span>
                  </div>
                </div>

                <button className="w-full bg-[#473BF0] bg-opacity-[0.08] text-[#473BF0] rounded-lg py-3 px-6 flex items-center justify-center hover:bg-[#473BF0] hover:text-white transition-all mb-4">
                  <span className="font-bold text-sm mr-2">Start Free Trial</span>
                  <div className="relative w-3 h-3">
                    <Image src="/images/arrow-right-path1.svg" alt="" width={6} height={10} className="absolute right-0" />
                    <Image src="/images/arrow-right-path2.svg" alt="" width={10} height={2} className="absolute left-0 top-1" />
                  </div>
                </button>

                <p className="text-xs text-[#161C2D] opacity-70 text-center">No credit card required</p>
              </div>

              {/* Standard Plan - Mobile/Tablet */}
              <div className="bg-white rounded-lg border border-[#E7E9ED] p-6 sm:col-span-2 lg:col-span-1">
                <div className="mb-4">
                  <span 
                    style={{
                      color: '#473BF0',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '14px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Standard
                  </span>
                </div>

                <div className="mb-4">
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '32px',
                      lineHeight: '40px',
                      letterSpacing: '-1px'
                    }}
                  >
                    $49
                  </span>
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Rubik',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.1px',
                      marginLeft: '4px'
                    }}
                  >
                    / month
                  </span>
                  <div className="mt-1">
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.7,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      billed monthly
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Commercial License</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">100+ HTML UI Elements</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Unlimited Domain Support</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">6 Month Premium Support</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[14px] h-[10px] mr-3 mt-1 flex-shrink-0 relative">
                      <Image src="/images/cross-icon-path1.svg" alt="" width={10} height={10} className="absolute" />
                      <Image src="/images/cross-icon-path2.svg" alt="" width={10} height={10} className="absolute" />
                    </div>
                    <span className="text-sm text-[#161C2D] opacity-70">Lifetime Updates</span>
                  </div>
                </div>

                <button className="w-full bg-[#473BF0] text-white rounded-lg py-3 px-6 flex items-center justify-center hover:bg-[#3730e6] transition-colors mb-4">
                  <span className="font-bold text-sm mr-2">Start Free Trial</span>
                  <div className="relative w-3 h-3">
                    <svg className="absolute" width="6" height="10" viewBox="0 0 7 12" fill="none" style={{right: '0px', top: '0px'}}>
                      <path d="M1 1L6 6L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg className="absolute" width="10" height="2" viewBox="0 0 13 2" fill="none" style={{left: '0px', top: '4px'}}>
                      <path d="M0 1H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>

                <p className="text-xs text-[#161C2D] opacity-70 text-center">No credit card required</p>
              </div>

              {/* Premium Plan - Mobile/Tablet */}
              <div className="bg-white rounded-lg border border-[#E7E9ED] p-6 sm:col-span-2 lg:col-span-1">
                <div className="mb-4">
                  <span 
                    style={{
                      color: '#473BF0',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '14px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Premium
                  </span>
                </div>

                <div className="mb-4">
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '32px',
                      lineHeight: '40px',
                      letterSpacing: '-1px'
                    }}
                  >
                    $99
                  </span>
                  <span 
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Rubik',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.1px',
                      marginLeft: '4px'
                    }}
                  >
                    / month
                  </span>
                  <div className="mt-1">
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.7,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      billed monthly
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Commercial License</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">100+ HTML UI Elements</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Unlimited Domain Support</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">6 Month Premium Support</span>
                  </div>
                  <div className="flex items-start">
                    <Image src="/images/check-icon.svg" alt="" width={14} height={10} className="mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm text-[#161C2D]">Lifetime Updates</span>
                  </div>
                </div>

                <button className="w-full bg-[#473BF0] bg-opacity-[0.08] text-[#473BF0] rounded-lg py-3 px-6 flex items-center justify-center hover:bg-[#473BF0] hover:text-white transition-all mb-4">
                  <span className="font-bold text-sm mr-2">Start Free Trial</span>
                  <div className="relative w-3 h-3">
                    <Image src="/images/arrow-right-path1.svg" alt="" width={6} height={10} className="absolute right-0" />
                    <Image src="/images/arrow-right-path2.svg" alt="" width={10} height={2} className="absolute left-0 top-1" />
                  </div>
                </button>

                <p className="text-xs text-[#161C2D] opacity-70 text-center">No credit card required</p>
              </div>
            </div>

            {/* Mobile/Tablet Testimonials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="relative">
                <div className="absolute -left-2 -top-2">
                  <span 
                    style={{
                      color: '#473BF0',
                      fontFamily: 'Gilroy',
                      fontWeight: 600,
                      fontSize: '60px',
                      lineHeight: '60px',
                      letterSpacing: '-1px'
                    }}
                  >
                    "
                  </span>
                </div>
                <div className="mt-8">
                  <p 
                    className="mb-4"
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '26px',
                      letterSpacing: '-0.3px'
                    }}
                  >
                    "OMG! I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish."
                  </p>
                  <div>
                    <span 
                      style={{
                        color: '#161C2D',
                        fontFamily: 'Gilroy',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      Diego Morata
                    </span>
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.7,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.1px',
                        marginLeft: '8px'
                      }}
                    >
                      Web Developer
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="relative">
                <div className="absolute -left-2 -top-2">
                  <span 
                    style={{
                      color: '#473BF0',
                      fontFamily: 'Gilroy',
                      fontWeight: 600,
                      fontSize: '60px',
                      lineHeight: '60px',
                      letterSpacing: '-1px'
                    }}
                  >
                    "
                  </span>
                </div>
                <div className="mt-8">
                  <p 
                    className="mb-4"
                    style={{
                      color: '#161C2D',
                      fontFamily: 'Gilroy',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '26px',
                      letterSpacing: '-0.3px'
                    }}
                  >
                    "Simply the best. Better than all the rest. I'd recommend this product to beginners and advanced users."
                  </p>
                  <div>
                    <span 
                      style={{
                        color: '#161C2D',
                        fontFamily: 'Gilroy',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.1px'
                      }}
                    >
                      Franklin Hicks
                    </span>
                    <span 
                      style={{
                        color: '#161C2D',
                        opacity: 0.7,
                        fontFamily: 'Gilroy',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.1px',
                        marginLeft: '8px'
                      }}
                    >
                      Digital Marketer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}