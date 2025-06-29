import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Play, Star, Users, BookOpen, Award, ChevronDown } from 'lucide-react';

const MainHeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const heroTexts = [
    "Master Digital Skills",
    "Build Your Career",
    "Create Amazing Content",
    "Earn More Money"
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center text-white py-20 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-red-600/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>
      
      <div className="container mx-auto max-w-7xl z-10">
        <div className="text-center">
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
              <Star className="text-primary mr-2" size={20} />
              <span className="text-sm font-medium">Trusted by 10,000+ Students Worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">Learn to </span>
              <span className="text-primary block md:inline transition-all duration-500">
                {heroTexts[currentText]}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your career with our comprehensive online courses. From video editing to digital marketing, 
              master the skills that matter in today's digital world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={() => scrollToSection('courses')} 
                size="lg" 
                glowing={true}
                className="text-lg px-8 py-4"
              >
                <BookOpen className="mr-2" size={24} />
                Explore Courses
              </Button>
              <Button 
                onClick={() => scrollToSection('about')} 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
              >
                <Play className="mr-2" size={24} />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Users className="text-primary" size={32} />
                <div className="text-left">
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-gray-400">Active Students</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <BookOpen className="text-primary" size={32} />
                <div className="text-left">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-gray-400">Expert Courses</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Award className="text-primary" size={32} />
                <div className="text-left">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-float">
          <button 
            onClick={() => scrollToSection('courses')}
            className="text-white opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Scroll down"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;