// import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <a href="#" className="flex flex-col items-center">
            <span className="logo">Diesel Dudes</span>
            <span className="logo-mechanic">Mechanic Services</span>
          </a>
          <nav className="nav-menu">
            <a href="#services" className="nav-link">Services</a>
            <a href="#locations" className="nav-link">Locations</a>
            <a href="#blog" className="nav-link">Blog</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          <div className="nav-right">
            <button className="btn-header-cta">
              CALL NOW
            </button>
            <button className="mobile-menu-button">
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title text-white">
            Mobile Diesel Mechanic<br />Charlotte & Columbia
          </h1>
          <p className="hero-subtitle">
            <span className="hero-subtitle-emphasis">Emergency Roadside Assistance</span> & On-Site Diesel Repairs<br />
            Serving All Makes and Models | Call Now for Fast, Reliable Service.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">
              📞 CALL NOW FOR SERVICE
            </button>
            <button className="btn-secondary">
              GET A QUOTE
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Roadside Assistance Section */}
      <section className="emergency-section section-padding">
        <div className="container">
          {/* Teal Badge */}
          <div className="emergency-badge">
            <span className="badge-text">WHEREVER YOU NEED US</span>
          </div>

          {/* Section Title */}
          <h2 className="emergency-title text-h1 text-dark">
            24/7 EMERGENCY ROADSIDE ASSISTANCE
          </h2>

          {/* Service Cards Grid */}
          <div className="service-cards-grid">
            {/* Emergency Roadside Assistance Card */}
            <div className="service-card">
              <div className="service-card-illustration">
                <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Isometric truck illustration - Emergency Roadside */}
                  {/* Road/Platform */}
                  <path d="M60 200 L260 200 L280 180 L80 180 Z" fill="#1A1A1A"/>
                  <path d="M80 180 L260 180 L260 160 L80 160 Z" fill="#2C2C2C"/>
                  
                  {/* Truck Cabin */}
                  <path d="M120 140 L180 140 L180 100 L120 100 Z" fill="#20B2AA"/>
                  <path d="M180 140 L200 130 L200 90 L180 100 Z" fill="#1A9B94"/>
                  <path d="M120 100 L180 100 L200 90 L140 90 Z" fill="#40C4BC"/>
                  
                  {/* Truck Cargo */}
                  <path d="M180 140 L240 140 L240 110 L180 110 Z" fill="#FF4500"/>
                  <path d="M240 140 L260 130 L260 100 L240 110 Z" fill="#E63E00"/>
                  <path d="M180 110 L240 110 L260 100 L200 100 Z" fill="#FF6B33"/>
                  
                  {/* Orange stripe on cargo */}
                  <rect x="190" y="115" width="40" height="20" fill="#FFFFFF"/>
                  
                  {/* Wheels */}
                  <circle cx="140" cy="160" r="20" fill="#2C2C2C"/>
                  <circle cx="140" cy="160" r="15" fill="#666666"/>
                  <circle cx="220" cy="160" r="20" fill="#2C2C2C"/>
                  <circle cx="220" cy="160" r="15" fill="#666666"/>
                  
                  {/* Fuel pump icons on sides */}
                  <g transform="translate(90,120)">
                    <rect width="15" height="20" rx="2" fill="#FF4500"/>
                    <circle cx="7.5" cy="10" r="3" fill="#FFFFFF"/>
                  </g>
                  
                  {/* Trees */}
                  <g transform="translate(40,120)">
                    <rect x="8" y="15" width="4" height="25" fill="#8B4513"/>
                    <circle cx="10" cy="15" r="12" fill="#228B22"/>
                  </g>
                  <g transform="translate(270,125)">
                    <rect x="8" y="15" width="4" height="20" fill="#8B4513"/>
                    <circle cx="10" cy="15" r="10" fill="#228B22"/>
                  </g>
                </svg>
              </div>
              <h3 className="service-card-title">EMERGENCY ROADSIDE ASSISTANCE</h3>
              <p className="service-card-description">
                Fast response for breakdowns, no matter where you are.
              </p>
              <a href="#" className="service-card-link">LEARN MORE</a>
            </div>

            {/* On-Site Mechanic Services Card */}
            <div className="service-card">
              <div className="service-card-illustration">
                <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Isometric truck illustration - On-Site Services */}
                  {/* Road/Platform */}
                  <path d="M60 200 L260 200 L280 180 L80 180 Z" fill="#1A1A1A"/>
                  <path d="M80 180 L260 180 L260 160 L80 160 Z" fill="#2C2C2C"/>
                  
                  {/* Service Truck */}
                  <path d="M120 140 L200 140 L200 100 L120 100 Z" fill="#20B2AA"/>
                  <path d="M200 140 L220 130 L220 90 L200 100 Z" fill="#1A9B94"/>
                  <path d="M120 100 L200 100 L220 90 L140 90 Z" fill="#40C4BC"/>
                  
                  {/* Service Equipment Box */}
                  <path d="M200 140 L240 140 L240 110 L200 110 Z" fill="#FF4500"/>
                  <path d="M240 140 L260 130 L260 100 L240 110 Z" fill="#E63E00"/>
                  <path d="M200 110 L240 110 L260 100 L220 100 Z" fill="#FF6B33"/>
                  
                  {/* Tool compartments */}
                  <rect x="205" y="115" width="30" height="8" fill="#FFFFFF"/>
                  <rect x="205" y="127" width="30" height="8" fill="#FFFFFF"/>
                  
                  {/* Wheels */}
                  <circle cx="140" cy="160" r="20" fill="#2C2C2C"/>
                  <circle cx="140" cy="160" r="15" fill="#666666"/>
                  <circle cx="220" cy="160" r="20" fill="#2C2C2C"/>
                  <circle cx="220" cy="160" r="15" fill="#666666"/>
                  
                  {/* Location Pin */}
                  <g transform="translate(270,80)">
                    <path d="M10 0 C15.5 0 20 4.5 20 10 C20 17.5 10 30 10 30 S0 17.5 0 10 C0 4.5 4.5 0 10 0 Z" fill="#20B2AA"/>
                    <circle cx="10" cy="10" r="5" fill="#FFFFFF"/>
                    <path d="M7 10 L9 12 L13 8" stroke="#20B2AA" strokeWidth="2" fill="none"/>
                  </g>
                  
                  {/* Trees */}
                  <g transform="translate(40,120)">
                    <rect x="8" y="15" width="4" height="25" fill="#8B4513"/>
                    <circle cx="10" cy="15" r="12" fill="#228B22"/>
                  </g>
                </svg>
              </div>
              <h3 className="service-card-title">ON-SITE MECHANIC SERVICES</h3>
              <p className="service-card-description">
                We bring the repair shop to you, saving you time and getting you back on the road.
              </p>
              <a href="#" className="service-card-link">LEARN MORE</a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Truck Repair Services Section */}
      <section className="mobile-services-section section-padding">
        <div className="container">
          {/* Teal Badge */}
          <div className="mobile-services-badge">
            <span className="badge-text">WE'VE GOT YOU COVERED</span>
          </div>

          {/* Section Title */}
          <h2 className="mobile-services-title text-h1 text-dark">
            MOBILE TRUCK REPAIR SERVICES
          </h2>

          {/* Service Items Grid */}
          <div className="service-items-grid">
            {/* Tires */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M24 4V8M24 40V44M4 24H8M40 24H44" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11.757 11.757L14.586 14.586M33.414 33.414L36.243 36.243M36.243 11.757L33.414 14.586M14.586 33.414L11.757 36.243" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="service-grid-title">TIRES</h3>
              <p className="service-grid-description">Mobile tire repairs, replacements, and balancing.</p>
            </div>

            {/* Brakes */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                  <path d="M14 14L20 20M34 14L28 20M34 34L28 28M14 34L20 28" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="service-grid-title">BRAKES</h3>
              <p className="service-grid-description">Full brake inspections, replacements, and adjustments.</p>
            </div>

            {/* Fuel Systems */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12V36C8 38.209 9.791 40 12 40H28C30.209 40 32 38.209 32 36V28" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M32 28H36C38.209 28 40 26.209 40 24V20C40 17.791 38.209 16 36 16H32V28Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="36" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 12H28V20H12V12Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="32" r="2" fill="currentColor"/>
                  <circle cx="24" cy="32" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="service-grid-title">FUEL SYSTEMS</h3>
              <p className="service-grid-description">Fuel line, pump repairs, and emergency fuel delivery.</p>
            </div>

            {/* Electrical */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 8L12 24H20L16 40L32 24H24L28 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="service-grid-title">ELECTRICAL</h3>
              <p className="service-grid-description">Diagnostics and electrical system repairs.</p>
            </div>

            {/* Batteries */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="16" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="20" y="12" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 24H20M28 24H32" stroke="currentColor" strokeWidth="2"/>
                  <path d="M30 22V26" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="service-grid-title">BATTERIES</h3>
              <p className="service-grid-description">Mobile battery replacements and charging solutions.</p>
            </div>

            {/* Airbags */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M24 8V16M24 32V40M8 24H16M32 24H40" stroke="currentColor" strokeWidth="2"/>
                  <rect x="12" y="12" width="24" height="24" rx="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </div>
              <h3 className="service-grid-title">AIRBAGS</h3>
              <p className="service-grid-description">Diagnose and repair air suspension issues.</p>
            </div>

            {/* Wheel Seals */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M24 6L26 12L32 10L28 16L34 18L28 22L30 28L24 26L18 30L22 24L16 22L22 18L20 12L24 14V6Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="service-grid-title">WHEEL SEALS</h3>
              <p className="service-grid-description">Prevent leaks and ensure smooth operation.</p>
            </div>

            {/* Alternators & Starters */}
            <div className="service-grid-item">
              <div className="service-grid-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M24 8V16M40 24H32M24 40V32M8 24H16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M35.314 12.686L29.657 18.343M35.314 35.314L29.657 29.657M12.686 35.314L18.343 29.657M12.686 12.686L18.343 18.343" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="3" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="service-grid-title">ALTERNATORS & STARTERS</h3>
              <p className="service-grid-description">On-site replacements to keep your truck moving.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Now Section */}
      <section className="need-help-section section-padding">
        <div className="container">
          {/* Orange CTA Banner */}
          <div className="cta-banner">
            <div className="cta-banner-text">Need Help Now?</div>
            <div className="cta-banner-subtitle">Call us 24/7 for immediate assistance</div>
            <a href="tel:+18032306390" className="cta-banner-phone">
              (803) 230-6390
            </a>
          </div>

          {/* Six Feature Cards */}
          <div className="features-grid">
            {/* Feature 1 - Quality of Work */}
            <div className="feature-badge">
              <div className="feature-number">1</div>
              <div className="feature-content">
                <h4>Quality of Work</h4>
                <p>Expert repairs by seasoned diesel mechanics.</p>
              </div>
            </div>

            {/* Feature 2 - Attention to Detail */}
            <div className="feature-badge">
              <div className="feature-number">2</div>
              <div className="feature-content">
                <h4>Attention to Detail</h4>
                <p>Thorough inspections and meticulous work.</p>
              </div>
            </div>

            {/* Feature 3 - Transparency & Honesty */}
            <div className="feature-badge">
              <div className="feature-number">3</div>
              <div className="feature-content">
                <h4>Transparency & Honesty</h4>
                <p>No hidden fees, just upfront pricing and clear communication.</p>
              </div>
            </div>

            {/* Feature 4 - Speed & Efficiency */}
            <div className="feature-badge">
              <div className="feature-number">4</div>
              <div className="feature-content">
                <h4>Speed & Efficiency</h4>
                <p>We work fast to get your fleet back on the road.</p>
              </div>
            </div>

            {/* Feature 5 - Always Responsive */}
            <div className="feature-badge">
              <div className="feature-number">5</div>
              <div className="feature-content">
                <h4>Always Responsive</h4>
                <p>We're always available and keep you updated every step of the way.</p>
              </div>
            </div>

            {/* Feature 6 - Satisfaction Guaranteed */}
            <div className="feature-badge">
              <div className="feature-number">6</div>
              <div className="feature-content">
                <h4>Satisfaction Guaranteed</h4>
                <p>We stand behind our work with a comprehensive warranty and your complete satisfaction is our priority.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partner Section */}
      <section className="trusted-partner-section section-padding">
        <div className="container">
          <div className="trusted-partner-content">
            {/* Top Row: Logo and Main Title */}
            <div className="trusted-partner-header">
              <div className="trusted-partner-logo">
                <span className="trusted-partner-logo-text">Diesel Dudes</span>
                <span className="trusted-partner-logo-subtitle">MECHANIC SERVICES</span>
              </div>
              <h2 className="trusted-partner-title">IS YOUR TRUSTED MOBILE MECHANIC PARTNER</h2>
            </div>

            {/* Center Content */}
            <div className="trusted-partner-body">
              <h3 className="trusted-partner-subtitle">DIESEL MECHANICS WITH A FLEET MANAGER'S PERSPECTIVE</h3>
              
              <div className="trusted-partner-description">
                <p className="trusted-partner-paragraph">
                  At Diesel Dudes, we understand the importance of keeping your fleet running smoothly. Our leadership team also operates a trucking company, and our lead mechanic has over 15 years of experience as a fleet manager, specializing in diesel trucks and heavy equipment. We're not just mechanics – we're partners in your business's success.
                </p>
                
                <p className="trusted-partner-paragraph">
                  With locations serving both the Charlotte, NC, and Columbia, SC markets, Diesel Dudes offers unparalleled service, quick response times, and comprehensive repairs for all diesel makes and models.
                </p>
                
                <a href="#contact" className="trusted-partner-cta">
                  CONTACT US FOR DIESEL REPAIR NEEDS
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}