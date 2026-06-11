import React from 'react';
import Hero from '../components/Home/Hero';
import LogosStrip from '../components/Home/LogosStrip';
import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItWorks';
import StatsBanner from '../components/Home/StatsBanner';
import Testimonials from '../components/Home/Testimonials';
import Pricing from '../components/Home/Pricing';
import CTASection from '../components/Home/CTA';

const HomePage = () => {
  return (
    <>
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <StatsBanner />
      <Testimonials />
      <Pricing />
      <CTASection />
    </>
  );
};

export default HomePage;