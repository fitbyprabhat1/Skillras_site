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

const LandingPage: React.FC = () => {
  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    console.log('Lead data submitted successfully:', data);
    // You can add additional logic here like tracking, analytics, etc.
  };

const MainLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <WelcomePopup onSubmit={handleFormSubmit} />
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