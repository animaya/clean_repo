import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mr-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L18 7L16.74 12.26L23 11L21.74 16.26L24 15L22.74 20.26L20 19L18.74 24.26L16 23L14.74 18.26L9 19L10.26 13.74L4 15L5.26 9.74L2 11L3.26 5.74L6 7L7.26 1.74L12 2Z"/>
              </svg>
            </div>
            <h1 className="font-black text-2xl text-slate-900 tracking-tight">Green Plants</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#collection" className="text-slate-600 hover:text-blue-800 transition-colors font-medium tracking-tight">Collection</a>
            <a href="#experts" className="text-slate-600 hover:text-blue-800 transition-colors font-medium tracking-tight">Experts</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-800 transition-colors font-medium tracking-tight">Contact</a>
          </nav>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="font-black text-6xl lg:text-8xl text-slate-900 tracking-tighter leading-none">
                Rare Plants from Around the World
              </h2>
              <p className="text-lg lg:text-xl text-slate-600 font-light tracking-wide leading-relaxed">
                Discover extraordinary specimens curated for passionate collectors. Each plant tells a unique story of nature&apos;s artistry and botanical mastery.
              </p>
              <button className="btn-primary animate-scale">
                Explore Collection
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=600&fit=crop" 
                  alt="Rare Cactus Collection" 
                  width={600}
                  height={600}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <p className="text-lg font-semibold text-slate-900 tracking-tight">Barrel Cactus</p>
                <p className="text-sm text-slate-500">Ferocactus species</p>
                <p className="text-blue-600 font-bold text-xl mt-2 font-mono">$125</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Collection Section */}
      <section id="collection" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="font-black text-5xl text-slate-900 mb-6 tracking-tighter">Featured Collection</h3>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Handpicked specimens from remote locations worldwide, each selected for its rarity, beauty, and exceptional quality
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", alt: "Monstera Deliciosa", name: "Monstera Deliciosa", price: "$85" },
              { src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop", alt: "Fiddle Leaf Fig", name: "Fiddle Leaf Fig", price: "$125" },
              { src: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=400&h=400&fit=crop", alt: "Bird of Paradise", name: "Bird of Paradise", price: "$95" },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", alt: "Jade Plant", name: "Jade Plant", price: "$65" },
              { src: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop", alt: "Prickly Pear", name: "Prickly Pear", price: "$75" },
              { src: "https://images.unsplash.com/photo-1516664851435-7ae4bb041c9e?w=400&h=400&fit=crop", alt: "Snake Plant", name: "Snake Plant", price: "$55" }
            ].map((plant, index) => (
              <div key={index} className="plant-card">
                <Image 
                  src={plant.src} 
                  alt={plant.alt}
                  width={400}
                  height={400}
                  className="plant-card-image"
                />
                <div className="plant-card-content">
                  <h4 className="plant-card-title">{plant.name}</h4>
                  <p className="plant-card-price">{plant.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plant Experts Section */}
      <section id="experts" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="font-black text-5xl text-slate-900 mb-6 tracking-tighter">Our Plant Experts</h3>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Meet the dedicated botanists and horticulturists behind our exceptional collection
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-8 lg:p-12 border border-slate-100">
              <div className="flex items-start space-x-6">
                <Image 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" 
                  alt="Dr. Sarah Chen"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-lg font-bold text-blue-800 tracking-tight mb-2">Dr. Sarah Chen</h4>
                  <p className="text-slate-500 mb-4 font-medium">Lead Botanist & Curator</p>
                  <blockquote className="text-xl lg:text-2xl text-slate-700 font-light leading-relaxed">
                    &ldquo;Each plant in our collection is carefully selected for its unique characteristics and ability to thrive in diverse environments.&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-8 lg:p-12 border border-slate-100">
              <div className="flex items-start space-x-6">
                <Image 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" 
                  alt="Marcus Rodriguez"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-lg font-bold text-blue-800 tracking-tight mb-2">Marcus Rodriguez</h4>
                  <p className="text-slate-500 mb-4 font-medium">Plant Care Specialist</p>
                  <blockquote className="text-xl lg:text-2xl text-slate-700 font-light leading-relaxed">
                    &ldquo;Our care process ensures every plant reaches its full potential, maintaining the highest standards of health and beauty.&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="font-black text-5xl text-slate-900 mb-6 tracking-tighter">Happy Collectors</h3>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Stories from our passionate plant community around the world
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Emily Watson", 
                title: "Plant Collector", 
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
                review: "The quality of plants from Green Plants is absolutely exceptional – each one is a masterpiece.",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
              },
              { 
                name: "David Kim", 
                title: "Rare Plant Enthusiast", 
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
                review: "I've been collecting for 20 years and Green Plants always delivers the most unique specimens.",
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=200&fit=crop"
              },
              { 
                name: "Maria Santos", 
                title: "Botanical Artist", 
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=60&h=60&fit=crop&crop=face",
                review: "Every plant tells a story and Green Plants helps me find the most inspiring specimens.",
                image: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=300&h=200&fit=crop"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-4 mb-6">
                  <Image 
                    src={review.avatar} 
                    alt={review.name}
                    width={48}
                    height={48}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <p className="text-sm text-slate-500">{review.title}</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-lg font-light">
                  &ldquo;{review.review}&rdquo;
                </p>
                <Image 
                  src={review.image} 
                  alt={`${review.name}'s Plant Collection`}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plants Carousel - Discover More */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="font-black text-5xl text-slate-900 mb-6 tracking-tighter">Discover More</h3>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Explore our ever-growing collection of rare plants from the most remote corners of the world
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex space-x-8 overflow-x-auto scrollbar-hide pb-6" style={{ scrollBehavior: 'smooth' }}>
              {[
                { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=450&h=600&fit=crop", alt: "Monstera Deliciosa", name: "Monstera Deliciosa", price: "$85", rarity: "Popular" },
                { src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=450&h=600&fit=crop", alt: "Fiddle Leaf Fig", name: "Fiddle Leaf Fig", price: "$125", rarity: "Premium" },
                { src: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=450&h=600&fit=crop", alt: "Barrel Cactus", name: "Barrel Cactus", price: "$95", rarity: "Rare" },
                { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=450&h=600&fit=crop", alt: "Jade Plant", name: "Jade Plant", price: "$65", rarity: "Classic" },
                { src: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=450&h=600&fit=crop", alt: "Bird of Paradise", name: "Bird of Paradise", price: "$110", rarity: "Exotic" }
              ].map((plant, index) => (
                <div key={index} className="flex-shrink-0 w-96 group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl shadow-lg bg-white p-6 transform group-hover:scale-[1.02] transition-all duration-500 border border-slate-100">
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      <Image 
                        src={plant.src} 
                        alt={plant.alt}
                        width={450}
                        height={600}
                        className="w-full h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {plant.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-2xl text-slate-900 mb-2 tracking-tight">{plant.name}</h4>
                      <p className="text-3xl font-bold text-blue-600 mb-4 font-mono">{plant.price}</p>
                      <button className="bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 w-full tracking-tight">
                        Add to Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2, 3, 4].map((dot) => (
            <button 
              key={dot}
              className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-600 transition-colors duration-300"
            />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 lg:py-32 bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-black text-4xl lg:text-6xl text-white mb-6 tracking-tighter">Ready to Start Your Collection?</h3>
          <p className="text-lg lg:text-xl text-blue-100 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            Connect with our plant experts to find the perfect addition to your rare plant collection. We&apos;re here to help you discover the extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-blue-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all transform hover:scale-[1.02] tracking-tight shadow-lg">
              📞 Call Expert
            </button>
            <button className="btn-secondary !text-white !border-white hover:!bg-white hover:!text-blue-800">
              💬 Chat Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L18 7L16.74 12.26L23 11L21.74 16.26L24 15L22.74 20.26L20 19L18.74 24.26L16 23L14.74 18.26L9 19L10.26 13.74L4 15L5.26 9.74L2 11L3.26 5.74L6 7L7.26 1.74L12 2Z"/>
                  </svg>
                </div>
                <h4 className="font-black text-2xl text-white tracking-tight">Green Plants</h4>
              </div>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed font-light">
                Rare plants from around the world for passionate collectors. Discover the extraordinary in nature.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'instagram', 'facebook', 'pinterest'].map((social) => (
                  <a key={social} href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-6 text-white text-lg">Quick Links</h5>
              <ul className="space-y-3 text-stone-400">
                {[
                  { name: 'Collection', href: '#collection' },
                  { name: 'Plant Care', href: '#experts' },
                  { name: 'Contact Us', href: '#contact' },
                  { name: 'Shipping Info', href: '#' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-cyan-400 transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-6 text-white text-lg">Legal</h5>
              <ul className="space-y-3 text-slate-400">
                {[
                  'Privacy Policy',
                  'Terms of Service', 
                  'Return Policy',
                  'CITES Compliance'
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-cyan-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Green Plants. All rights reserved. | Rare plants sourced responsibly worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
