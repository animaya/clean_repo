import { ReactElement } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import ServiceAreaMap from '@/components/ServiceAreaMap';
import USPSection from '@/components/USPSection';
import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home(): ReactElement {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ServicesSection />
      <ServiceAreaMap />
      <USPSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </main>
  );
}