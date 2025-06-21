import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { courseTitle, courseSubtitle, courseVideoId } from '../data/courseData';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-dark to-dark-light flex items-center justify-center text-white py-20 px-4">
      <div className="absolute inset-0 overflow-hidden">
        
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/premium-psd/youtube-sign-dark-abstract-shape-iconic-background-web-social-banner-advertisement-3d-render_492780-1465.jpg')] bg-cover bg-center opacity-10"></div> /.. 
      </div>
      
      <div className="container mx-auto max-w-6xl z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-primary">{courseTitle.split(':')[0]}:</span>
              <br />
              <span>{courseTitle.split(':')[1]}</span>
            </h1>
            <p className="text-xl mb-8 text-light-dark">{courseSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection('pricing')} size="lg" glowing={true}>
                Enroll Now
              </Button>
              <Button onClick={() => scrollToSection('curriculum')} variant="outline" size="lg">
                View Curriculum
              </Button>
            </div>
          </div>
          
          <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              <YouTubeEmbed videoId={courseVideoId} />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-float">
          <button 
            onClick={() => scrollToSection('benefits')}
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

export default HeroSection;