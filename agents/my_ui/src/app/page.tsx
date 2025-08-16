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
    </div>
  );
}