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

      {/* Service Area Map Section */}
      <section className="service-area-section section-padding">
        <div className="container">
          {/* Section Title */}
          <h2 className="service-area-title text-h1 text-dark">
            SERVICE AREA MAP
          </h2>
          
          {/* Subtitle */}
          <p className="service-area-subtitle">
            24/7 Mobile Diesel Repair Services Along the I-77 Corridor
          </p>

          {/* Map and Locations Layout */}
          <div className="service-area-content">
            {/* Map Container */}
            <div className="service-area-map">
              <div className="map-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="I-77 Corridor Service Area"
                  className="map-image"
                />
                <div className="corridor-label">
                  <span className="corridor-text">I-77 CORRIDOR</span>
                </div>
              </div>
            </div>

            {/* Locations Grid */}
            <div className="service-locations">
              {/* North Carolina */}
              <div className="location-group">
                <h3 className="location-group-title">NORTH CAROLINA</h3>
                <div className="location-pills">
                  <span className="location-pill">Charlotte</span>
                  <span className="location-pill">Huntersville</span>
                  <span className="location-pill">Concord</span>
                  <span className="location-pill">Monroe</span>
                  <span className="location-pill">Gastonia</span>
                  <span className="location-pill">Indian Land</span>
                  <span className="location-pill">Matthews</span>
                  <span className="location-pill">Cornelius</span>
                  <span className="location-pill">Mooresville</span>
                  <span className="location-pill">Statesville</span>
                  <span className="location-pill">Kannapolis</span>
                  <span className="location-pill">Harrisburg</span>
                </div>
              </div>

              {/* South Carolina */}
              <div className="location-group">
                <h3 className="location-group-title">SOUTH CAROLINA</h3>
                <div className="location-pills">
                  <span className="location-pill">Columbia</span>
                  <span className="location-pill">Rock Hill</span>
                  <span className="location-pill">Fort Mill</span>
                  <span className="location-pill">Lexington</span>
                  <span className="location-pill">West Columbia</span>
                  <span className="location-pill">Irmo</span>
                  <span className="location-pill">Blythewood</span>
                  <span className="location-pill">York</span>
                  <span className="location-pill">Chester</span>
                  <span className="location-pill">Winnsboro</span>
                  <span className="location-pill">Gaffney</span>
                  <span className="location-pill">Spartanburg</span>
                </div>
              </div>

              {/* Additional Coverage Note */}
              <div className="coverage-note">
                <p>Plus surrounding areas within 50 miles of Charlotte & Columbia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section section-padding">
        <div className="container">
          <div className="final-cta-content">
            {/* Diesel Repair Icon */}
            <div className="final-cta-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Toolbox Icon */}
                <rect x="20" y="30" width="40" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <rect x="25" y="35" width="30" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="25" y="47" width="30" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                
                {/* Handle */}
                <path d="M30 30V25C30 21.686 32.686 19 36 19H44C47.314 19 50 21.686 50 25V30" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                
                {/* Wrench */}
                <g transform="translate(55,15) rotate(45)">
                  <rect x="0" y="6" width="20" height="4" rx="2" fill="currentColor"/>
                  <circle cx="2" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="8" r="2" fill="currentColor"/>
                </g>
                
                {/* Screwdriver */}
                <g transform="translate(10,25) rotate(-30)">
                  <rect x="0" y="7" width="15" height="2" fill="currentColor"/>
                  <circle cx="0" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </g>
              </svg>
            </div>

            {/* Main Heading */}
            <h2 className="final-cta-title">
              READY FOR FAST, RELIABLE DIESEL REPAIR?
            </h2>

            {/* Subtitle */}
            <p className="final-cta-subtitle">
              Contact Diesel Dudes Today!
            </p>

            {/* Action Buttons */}
            <div className="final-cta-buttons">
              <a href="tel:+18032306390" className="btn-primary">
                📞 CALL NOW FOR SERVICE
              </a>
              <a href="#contact" className="btn-secondary">
                REQUEST ON-SITE SERVICES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Contact Information Section */}
          <div className="footer-contact">
            <div className="footer-logo">
              <span className="footer-logo-text">Diesel Dudes</span>
              <span className="footer-logo-subtitle">MECHANIC SERVICES</span>
            </div>
            <div className="footer-emergency">
              <div className="footer-emergency-label">24/7 Emergency Service</div>
              <a href="tel:+18032306390" className="footer-phone">
                (803) 230-6390
              </a>
              <div className="footer-availability">Available Day & Night</div>
            </div>
          </div>

          {/* Services Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">SERVICES</h3>
            <div className="footer-links">
              <a href="#emergency" className="footer-link">Emergency Roadside</a>
              <a href="#engine" className="footer-link">Engine Repair</a>
              <a href="#brakes" className="footer-link">Brake Repairs</a>
              <a href="#tires" className="footer-link">Tire Services</a>
              <a href="#electrical" className="footer-link">Electrical & Battery</a>
              <a href="#services" className="footer-link-all">All Services →</a>
            </div>
          </div>

          {/* Service Areas Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">SERVICE AREAS</h3>
            <div className="footer-links">
              <a href="#charlotte" className="footer-link">Charlotte, NC</a>
              <a href="#columbia" className="footer-link">Columbia, SC</a>
              <a href="#rock-hill" className="footer-link">Rock Hill, SC</a>
              <a href="#gastonia" className="footer-link">Gastonia, NC</a>
              <a href="#corridor" className="footer-link">I-77 Corridor</a>
              <a href="#locations" className="footer-link-all">All Locations →</a>
            </div>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">COMPANY</h3>
            <div className="footer-links">
              <a href="#about" className="footer-link">About Us</a>
              <a href="#mechanics" className="footer-link">Diesel Mechanic</a>
              <a href="#blog" className="footer-link">Blog & Tips</a>
              <a href="#contact" className="footer-link">Contact Us</a>
              <a href="#emergency" className="footer-link">Emergency Service</a>
            </div>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h3 className="footer-column-title">RESOURCES</h3>
            <div className="footer-links">
              <a href="#breakdown-guide" className="footer-link">I-77 Breakdown Guide</a>
              <a href="#problems" className="footer-link">Common Problems</a>
              <a href="#terms" className="footer-link">Terms of Service</a>
              <a href="#privacy" className="footer-link">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <div className="footer-copyright">
              © 2025 Diesel Dudes. All rights reserved.
            </div>
            <div className="footer-social">
              {/* Facebook Icon */}
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* YouTube Icon */}
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}