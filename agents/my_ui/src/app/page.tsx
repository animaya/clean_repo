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
    </div>
  );
}