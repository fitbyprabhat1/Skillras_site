import React from 'react';
import NavBar from '../components/NavBar';
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
import WelcomePopup from '../components/WelcomePopup';

const LandingPage: React.FC = () => {
  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log('Lead data submitted successfully:', data);
    // You can add additional logic here like tracking, analytics, etc.
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBar />
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