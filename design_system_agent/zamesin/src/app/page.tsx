export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Navigation Bar */}
      <nav className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-[206px] px-[100px] py-0">
        <div className="flex items-center gap-[10px] py-[10px]">
          {/* Logo */}
          <div className="w-[219.54px] h-[36px]">
            <img src="/images/positivus-logo.svg" alt="Positivus" className="w-full h-full" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-[40px]">
          <a href="#" className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">About us</a>
          <a href="#" className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Services</a>
          <a href="#" className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Use Cases</a>
          <a href="#" className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Pricing</a>
          <a href="#" className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Blog</a>
          <button className="border border-[#191A23] rounded-[14px] px-[35px] py-[20px] text-[20px] font-[400] leading-[28px] text-[#000000] hover:bg-[#191A23] hover:text-[#FFFFFF] transition-colors font-space-grotesk">
            Request a quote
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <header className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-[206px] px-[100px] py-0 mt-[70px]">
        {/* Left Content */}
        <div className="flex flex-col gap-[35px] max-w-[531px]">
          <h1 className="text-[50px] font-[500] leading-[76.56px] text-[#000000] font-space-grotesk">
            Navigating the<br/>
            digital landscape<br/>
            for success<br/>
          </h1>
          
          <p className="text-[20px] font-[400] leading-[28px] text-[#000000] max-w-[498px] font-space-grotesk">
            Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.
          </p>
          
          <button className="bg-[#191A23] text-[#FFFFFF] rounded-[14px] px-[35px] py-[20px] text-[20px] font-[400] leading-[28px] hover:bg-[#333] transition-colors w-fit font-space-grotesk">
            Book a consultation
          </button>
        </div>

        {/* Right Illustration */}
        <div className="relative w-[600.46px] h-[515px] flex-shrink-0">
          <img src="/images/megaphone-illustration.svg" alt="Digital marketing illustration" className="w-full h-full" />
        </div>
      </header>

      {/* Company Logos Section */}
      <section className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-[100px] py-0 mt-[70px]">
        {/* Amazon */}
        <div className="w-[124.11px] h-[48px]">
          <img src="/images/amazon-logo.svg" alt="Amazon" className="w-full h-full" />
        </div>
        
        {/* Dribbble */}
        <div className="w-[126.37px] h-[48px]">
          <img src="/images/dribbble-logo.svg" alt="Dribbble" className="w-full h-full" />
        </div>
        
        {/* HubSpot */}
        <div className="w-[128.63px] h-[48px]">
          <img src="/images/hubspot-logo.svg" alt="HubSpot" className="w-full h-full" />
        </div>
        
        {/* Notion */}
        <div className="w-[145.55px] h-[48px]">
          <img src="/images/notion-logo.svg" alt="Notion" className="w-full h-full" />
        </div>
        
        {/* Netflix */}
        <div className="w-[125.24px] h-[48px]">
          <img src="/images/netflix-logo.svg" alt="Netflix" className="w-full h-full" />
        </div>
        
        {/* Zoom */}
        <div className="w-[110.57px] h-[48px]">
          <img src="/images/zoom-logo.svg" alt="Zoom" className="w-full h-full" />
        </div>
      </section>
    </div>
  );
}