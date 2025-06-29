import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { Menu, X } from 'lucide-react';
import { courseTitle } from '../data/courseData';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
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
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white font-bold text-xl md:text-2xl">
            {courseTitle.split(':')[0]}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {location.pathname === '/' ? (
              <>
                <button
                  onClick={() => scrollToSection('benefits')}
                  className="text-white hover:text-primary-light transition-colors"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection('curriculum')}
                  className="text-white hover:text-primary-light transition-colors"
                >
                  Curriculum
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-white hover:text-primary-light transition-colors"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-white hover:text-primary-light transition-colors"
                >
                  Pricing
                </button>
                
                <Link to=="/download" className="text-white hover:text-primary-light transition-colors">
                  Downloads
                 </Link>
                
                <Link to="/trial">
                  <Button size="sm">Try Free Chapters</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-white hover:text-primary-light transition-colors">
                  Home
                </Link>
                <Link to="/download" className="text-white hover:text-primary-light transition-colors">
                  Downloads
                </Link>
                <Link to="/trial">
                  <Button size="sm">Try Free Chapters</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-light mt-4 rounded-lg py-4 px-2 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {location.pathname === '/' ? (
                <>
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Benefits
                  </button>
                  <button
                    onClick={() => scrollToSection('curriculum')}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Pricing
                  </button>
                  <Link 
                    to="/download" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Downloads
                  </Link>
                  <Link to="/trial">
                    <Button className="w-full">Try Free Chapters</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/download" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:text-primary-light transition-colors py-2"
                  >
                    Downloads
                  </Link>
                  <Link to="/trial">
                    <Button className="w-full">Try Free Chapters</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;