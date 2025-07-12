import React from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import HeroSection from '../sections/HeroSection';
import BenefitsSection from '../sections/BenefitsSection';
import ResultsSection from '../sections/ResultsSection';
import CurriculumSection from '../sections/CurriculumSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import PricingSection from '../sections/PricingSection';
import FAQSection from '../sections/FAQSection';
import FooterSection from '../sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import ScrollToTop from '../components/ScrollToTop';

const LandingPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBarWithPackages />
      <HeroSection />
      <BenefitsSection />
      <ResultsSection />
      <CurriculumSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;