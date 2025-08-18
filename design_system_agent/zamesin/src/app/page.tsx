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

      {/* Services Section */}
      <section className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[50px] lg:px-[100px] py-0 mt-[70px] md:mt-[100px] lg:mt-[140px]">
        {/* Services Grid - 3 rows of 2 cards each */}
        <div className="flex flex-col gap-[20px] md:gap-[30px] lg:gap-[40px]">
          
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px] lg:gap-[40px]">
            {/* Search Engine Optimization Card */}
            <div className="w-full md:w-[600px] bg-[#F3F3F3] border border-[#191A23] rounded-[25px] md:rounded-[35px] lg:rounded-[45px] p-[30px] md:p-[40px] lg:p-[50px] flex flex-col md:flex-row md:items-center justify-between gap-[30px] md:gap-[50px] lg:gap-[77px] shadow-[0px_3px_0px_0px_rgba(25,26,35,1)] md:shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#E8E8E8] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[20px] md:text-[25px] lg:text-[30px] font-[500] leading-[1.2] text-[#000000] font-space-grotesk">Search engine</span>
                  </div>
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[20px] md:text-[25px] lg:text-[30px] font-[500] leading-[1.2] text-[#000000] font-space-grotesk">optimization</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#191A23] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#B9FF66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[16px] md:text-[18px] lg:text-[20px] font-[400] leading-[1.4] text-[#000000] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[150px] md:w-[180px] lg:w-[210px] h-[120px] md:h-[145px] lg:h-[170px] flex-shrink-0 mx-auto md:mx-0">
                <img src="/images/seo-illustration-7b85c1.png" alt="SEO illustration" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Pay-per-click Advertising Card */}
            <div className="w-[600px] bg-[#B9FF66] border border-[#191A23] rounded-[45px] p-[50px] flex items-center justify-between gap-[77px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#A8E055] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Pay-per-click</span>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">advertising</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#191A23] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#B9FF66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[210px] h-[148px] flex-shrink-0">
                <img src="/images/ppc-illustration-32ecef.png" alt="PPC illustration" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px] lg:gap-[40px]">
            {/* Social Media Marketing Card */}
            <div className="w-full md:w-[600px] bg-[#191A23] border border-[#191A23] rounded-[25px] md:rounded-[35px] lg:rounded-[45px] p-[30px] md:p-[40px] lg:p-[50px] flex flex-col md:flex-row md:items-center justify-between gap-[30px] md:gap-[50px] lg:gap-[77px] shadow-[0px_3px_0px_0px_rgba(25,26,35,1)] md:shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#2C2D35] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Social Media</span>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Marketing</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-[400] leading-[28px] text-[#FFFFFF] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[210px] h-[210px] flex-shrink-0">
                <img src="/images/social-media-illustration-3b0fc0.png" alt="Social Media illustration" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Email Marketing Card */}
            <div className="w-[600px] bg-[#F3F3F3] border border-[#191A23] rounded-[45px] p-[50px] flex items-center justify-between gap-[77px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#E8E8E8] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Email</span>
                  </div>
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Marketing</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#191A23] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#B9FF66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[210px] h-[193px] flex-shrink-0">
                <img src="/images/email-marketing-illustration-11ac5c.png" alt="Email Marketing illustration" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px] lg:gap-[40px]">
            {/* Content Creation Card */}
            <div className="w-[600px] bg-[#B9FF66] border border-[#191A23] rounded-[45px] p-[50px] flex items-center justify-between gap-[77px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#A8E055] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Content</span>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Creation</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#191A23] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#B9FF66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[210px] h-[196px] flex-shrink-0">
                <img src="/images/content-creation-illustration-3c1439.png" alt="Content Creation illustration" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Analytics and Tracking Card */}
            <div className="w-[600px] bg-[#191A23] border border-[#191A23] rounded-[45px] p-[50px] flex items-center justify-between gap-[77px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:bg-[#2C2D35] transition-colors duration-300 cursor-pointer">
              <div className="flex flex-col gap-[93px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Analytics and</span>
                  </div>
                  <div className="bg-[#B9FF66] rounded-[7px] px-[7px] w-fit">
                    <span className="text-[30px] font-[500] leading-[38.28px] text-[#000000] font-space-grotesk">Tracking</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px] cursor-pointer group">
                  <div className="w-[41px] h-[41px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                      <path d="M12.5 1L16 5L12.5 9M16 5L1 5" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-[400] leading-[28px] text-[#FFFFFF] font-space-grotesk">Learn more</span>
                </div>
              </div>
              
              <div className="w-[210px] h-[170px] flex-shrink-0">
                <img src="/images/analytics-illustration-48e811.png" alt="Analytics illustration" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full max-w-[1440px] mx-auto px-[100px] py-0 mt-[140px]">
        <div className="flex flex-col gap-[40px]">
          
          {/* Row 1 */}
          <div className="flex justify-center gap-[40px]">
            {/* John Smith - CEO and Founder */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/john-smith.png" 
                      alt="John Smith" 
                      className="w-[120px] h-[180px] object-cover"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">John Smith</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">CEO and Founder</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy
                </p>
              </div>
            </div>

            {/* Jane Doe - Director of Operations */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/jane-doe.png" 
                      alt="Jane Doe" 
                      className="w-[130px] h-[80px] object-cover"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">Jane Doe</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">Director of Operations</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  7+ years of experience in project management and team leadership. Strong organizational and communication skills
                </p>
              </div>
            </div>

            {/* Michael Brown - Senior SEO Specialist */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/michael-brown.png" 
                      alt="Michael Brown" 
                      className="w-[140px] h-[95px] object-cover"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">Michael Brown</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">Senior SEO Specialist</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization
                </p>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex justify-center gap-[40px]">
            {/* Emily Johnson - PPC Manager */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/emily-johnson.png" 
                      alt="Emily Johnson" 
                      className="w-[140px] h-[210px] object-cover -mt-8"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">Emily Johnson</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">PPC Manager</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis
                </p>
              </div>
            </div>

            {/* Brian Williams - Social Media Specialist */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/brian-williams.png" 
                      alt="Brian Williams" 
                      className="w-[120px] h-[180px] object-cover -mt-6"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">Brian Williams</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">Social Media Specialist</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement
                </p>
              </div>
            </div>

            {/* Sarah Kim - Content Creator */}
            <div className="w-[387px] h-[331px] bg-[#FFFFFF] border border-[#191A23] rounded-[45px] p-[40px_35px] shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] flex flex-col gap-[10px] relative">
              {/* LinkedIn Icon - Top Right Corner */}
              <div className="absolute top-[35px] right-[35px] w-[44px] h-[44px] bg-[#000000] rounded-full flex items-center justify-center">
                <img src="/images/team/linkedin-icon.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
              </div>
              
              <div className="flex flex-col gap-[28px]">
                {/* Person */}
                <div className="flex items-end gap-[20px]">
                  {/* Picture */}
                  <div className="w-[98px] h-[98px] rounded-full overflow-hidden bg-[#B9FF66] flex items-center justify-center">
                    <img 
                      src="/images/team/sarah-kim.png" 
                      alt="Sarah Kim" 
                      className="w-[98px] h-[98px] object-cover"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1">
                    <h3 className="text-[20px] font-[500] leading-[25.52px] text-[#000000] font-space-grotesk">Sarah Kim</h3>
                    <p className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk mt-[3px]">Content Creator</p>
                  </div>
                </div>
                {/* Line */}
                <hr className="w-[317px] border-t border-[#000000]" />
                {/* Description */}
                <p className="w-[317px] text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">
                  2+ years of experience in writing and editing<br/>Skilled in creating compelling, SEO-optimized content for various industries
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full max-w-[1440px] mx-auto flex items-center px-[100px] py-0 mt-[140px]">
        <div className="w-[1240px] bg-[#F3F3F3] rounded-[45px] p-[60px_100px_80px] flex flex-row gap-[10px] relative">
          {/* Form */}
          <div className="flex flex-col gap-[40px] z-10">
            {/* Radio Buttons */}
            <div className="flex flex-row gap-[35px]">
              {/* Say Hi */}
              <div className="flex items-center gap-[14px]">
                <div className="relative">
                  <div className="w-[28px] h-[28px] bg-[#FFFFFF] border border-[#000000] rounded-full"></div>
                  <div className="absolute top-[6px] left-[6px] w-[16px] h-[16px] bg-[#B9FF66] rounded-full"></div>
                </div>
                <span className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">Say Hi</span>
              </div>
              
              {/* Get a Quote */}
              <div className="flex items-center gap-[14px]">
                <div className="w-[28px] h-[28px] bg-[#FFFFFF] border border-[#000000] rounded-full"></div>
                <span className="text-[18px] font-[400] leading-[22.97px] text-[#000000] font-space-grotesk">Get a Quote</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[25px]">
              {/* Name Field */}
              <div className="flex flex-col gap-[5px]">
                <label className="text-[16px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Name</label>
                <div className="w-[556px] bg-[#FFFFFF] border border-[#000000] rounded-[14px] p-[18px_30px] flex items-center">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full text-[18px] font-[400] leading-[22.97px] text-[#898989] font-space-grotesk bg-transparent outline-none placeholder-[#898989]"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-[5px]">
                <label className="text-[16px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Email*</label>
                <div className="w-[556px] bg-[#FFFFFF] border border-[#000000] rounded-[14px] p-[18px_30px] flex items-center">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full text-[18px] font-[400] leading-[22.97px] text-[#898989] font-space-grotesk bg-transparent outline-none placeholder-[#898989]"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-[5px] h-[223px]">
                <label className="text-[16px] font-[400] leading-[28px] text-[#000000] font-space-grotesk">Message*</label>
                <div className="w-[556px] h-[190px] bg-[#FFFFFF] border border-[#000000] rounded-[14px] p-[18px_30px] flex">
                  <textarea 
                    placeholder="Message" 
                    className="w-full h-full text-[18px] font-[400] leading-[22.97px] text-[#898989] font-space-grotesk bg-transparent outline-none placeholder-[#898989] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-[556px] bg-[#191A23] text-[#FFFFFF] rounded-[14px] px-[35px] py-[20px] flex items-center justify-center hover:bg-[#2C2D35] transition-colors">
              <span className="text-[20px] font-[400] leading-[28px] font-space-grotesk">Send Message</span>
            </button>
          </div>

          {/* Main Illustration - positioned absolutely to the right */}
          <div className="absolute top-0 right-0 w-[691.57px] h-[648px] pointer-events-none overflow-hidden rounded-r-[45px]">
            {/* Complete illustration with radiating lines */}
            <img src="/images/contact-main-illustration.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
}