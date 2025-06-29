import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show the floating CTA when user has scrolled past the hero section
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isMainPage = location.pathname === '/';
  const isPremierePage = location.pathname === '/premiere-pro';

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <Button 
        onClick={() => {
          if (isMainPage) {
            scrollToSection('courses');
          } else if (isPremierePage) {
            scrollToSection('pricing');
          } else {
            scrollToSection('courses');
          }
        }}
        size="md"
        glowing={true}
        className="shadow-lg"
      >
        {isMainPage ? 'View Courses' : isPremierePage ? 'Enroll Now' : 'Get Started'}
      </Button>
    </div>
  );
};

export default FloatingCTA;