import React from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import MainHeroSection from '../sections/MainHeroSection';
import CoursesSection from '../sections/CoursesSection';
import AboutSection from '../sections/AboutSection';
import StatsSection from '../sections/StatsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FooterSection from '../sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import ScrollToTop from '../components/ScrollToTop';
import WelcomePopup from '../components/WelcomePopup';
import { useSEO } from '../hooks/useSEO';

const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
  console.log('Lead data submitted successfully:', data);
  // You can add additional logic here like tracking, analytics, etc.
};

const MainLandingPage: React.FC = () => {
  useSEO({
    title: 'SkillRas: Master Digital Skills & Transform Your Career | skillras',
    description: 'SkillRas (skillras) helps you master digital skills. Learn video editing, digital marketing, web development, and more with expert-led courses at SkillRas.',
    keywords: 'skillras, SkillRas, video editing, premiere pro, digital marketing, web development, online courses, skill development, career transformation',
    canonical: 'https://skillras.com'
  });

  return (
    <div className="min-h-screen bg-dark text-white w-full overflow-x-hidden" style={{ backgroundColor: '#000000' }}>
      <WelcomePopup onSubmit={handleFormSubmit} />
      <NavBarWithPackages />
      <MainHeroSection />
      <CoursesSection />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
      <FooterSection />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
};

export default MainLandingPage;