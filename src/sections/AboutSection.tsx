import React from 'react';
import { useInView } from '../hooks/useInView';
import { Target, Users, Award, Zap, CheckCircle, Play } from 'lucide-react';
import Button from '../components/Button';

const AboutSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const values = [
    {
      icon: <Target size={32} className="text-primary" />,
      title: "Results-Driven Learning",
      description: "Every course is designed with real-world applications and measurable outcomes in mind."
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals who have achieved success in their respective fields."
    },
    {
      icon: <Award size={32} className="text-primary" />,
      title: "Recognized Certifications",
      description: "Earn certificates that are valued by employers and showcase your expertise."
    },
    {
      icon: <Zap size={32} className="text-primary" />,
      title: "Cutting-Edge Content",
      description: "Stay ahead with the latest tools, techniques, and industry best practices."
    }
  ];

  const achievements = [
    { number: "10,000+", label: "Students Trained" },
    { number: "95%", label: "Job Placement Rate" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "50+", label: "Industry Partners" }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-dark text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div 
            ref={ref}
            className={`transition-all duration-700 transform ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Award className="text-primary mr-2" size={20} />
              <span className="text-sm font-medium">About SkillRas</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering <span className="text-primary">Digital Creators</span> Worldwide
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              At SkillRas, we believe that everyone deserves access to high-quality education that can transform their career. 
              Our mission is to bridge the gap between traditional education and the skills demanded by today's digital economy.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                "Industry-relevant curriculum updated regularly",
                "Hands-on projects with real-world applications",
                "Lifetime access to course materials and updates",
                "Active community of learners and mentors",
                "Career support and job placement assistance"
              ].map((point, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" glowing>
                Start Learning Today
              </Button>
              <Button variant="outline" size="lg">
                <Play size={20} className="mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>
          
          <div 
            className={`transition-all duration-700 transform delay-300 ${
              inView ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="grid grid-cols-2 gap-6 mb-12">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-dark-light rounded-xl p-6 text-center hover:bg-dark-lighter transition-colors"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                  <div className="text-gray-300">{achievement.label}</div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-dark-light rounded-xl p-6 hover:bg-dark-lighter transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 bg-dark rounded-xl flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;