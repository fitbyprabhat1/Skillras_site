import React from 'react';
import { useInView } from '../hooks/useInView';
import AnimatedCounter from '../components/AnimatedCounter';
import { TrendingUp, Users, BookOpen, Award, Globe, Clock } from 'lucide-react';

const StatsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const stats = [
    {
      icon: <Users size={32} className="text-primary" />,
      number: 10000,
      suffix: '+',
      label: 'Active Students',
      description: 'Learning and growing with us'
    },
    {
      icon: <BookOpen size={32} className="text-primary" />,
      number: 15,
      suffix: '+',
      label: 'Expert Courses',
      description: 'Across multiple disciplines'
    },
    {
      icon: <Award size={32} className="text-primary" />,
      number: 95,
      suffix: '%',
      label: 'Success Rate',
      description: 'Students achieving their goals'
    },
    {
      icon: <Globe size={32} className="text-primary" />,
      number: 50,
      suffix: '+',
      label: 'Countries',
      description: 'Students from around the world'
    },
    {
      icon: <Clock size={32} className="text-primary" />,
      number: 500,
      suffix: '+',
      label: 'Hours of Content',
      description: 'High-quality learning material'
    },
    {
      icon: <TrendingUp size={32} className="text-primary" />,
      number: 85,
      suffix: '%',
      label: 'Career Growth',
      description: 'Students report career advancement'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-dark via-dark-light to-dark text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-primary">Impact</span> in Numbers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful students who have transformed their careers with SkillRas
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-dark-light rounded-xl p-8 text-center transition-all duration-700 transform hover:scale-105 hover:bg-dark-lighter ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-20 h-20 bg-dark rounded-full flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {inView ? (
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
              <p className="text-gray-300 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-dark rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-gray-300 mb-6">
              Don't just take our word for it. See what our students have achieved and start your own success story today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-medium transition-colors">
                View Success Stories
              </button>
              <button className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;