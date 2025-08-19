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
    </main>
  );
}