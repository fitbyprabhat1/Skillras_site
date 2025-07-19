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
import { useSEO } from '../hooks/useSEO';

const LandingPage: React.FC = () => {
  useSEO({
    title: 'Learn Adobe Premiere Pro - Complete Video Editing Course | SkillRas',
    description: 'Master Adobe Premiere Pro with our comprehensive video editing course. Learn professional video editing techniques, color grading, and post-production workflows.',
    keywords: 'adobe premiere pro, video editing, video editing course, premiere pro tutorial, video editing software, post production',
    canonical: 'https://skillras.com/premiere-pro'
  });

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