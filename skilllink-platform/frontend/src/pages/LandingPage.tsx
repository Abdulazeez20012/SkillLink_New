import React from 'react';
import Navbar from '../components/landing/Navbar';
// import HeroSection from '../components/landing/HeroSection';
// import HeroSection from '@/components/landing/HeroSection';
import { HeroSection } from '@/components/landing/HeroSection';
import ProgramsSection from '../components/landing/ProgramsSection';
import CoreValuesSection from '../components/landing/CoreValuesSection';
import CommunitySection from '../components/landing/CommunitySection';
import FAQSection from '../components/landing/FAQSection';
import NewsletterSection from '../components/landing/NewsletterSection';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <div id="programs">
          <ProgramsSection />
        </div>
        <CoreValuesSection />
        <div id="community">
          <CommunitySection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <NewsletterSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
