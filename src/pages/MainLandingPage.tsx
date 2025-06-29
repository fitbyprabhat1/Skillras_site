import React from 'react';
import NavBar from '../components/NavBar';
import MainHeroSection from '../sections/MainHeroSection';
import CoursesSection from '../sections/CoursesSection';
import AboutSection from '../sections/AboutSection';
import StatsSection from '../sections/StatsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FooterSection from '../sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import ScrollToTop from '../components/ScrollToTop';

const MainLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBar />
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