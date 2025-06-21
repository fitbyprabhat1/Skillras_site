import React from 'react';
import { benefits } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import * as LucideIcons from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Dynamic icon rendering from Lucide React
  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={36} className="text-primary mb-4" /> : null;
  };

  return (
    <section id="benefits" className="py-20 px-4 bg-dark text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose This Course?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive curriculum is designed to give you the skills and confidence to excel in digital marketing.
          </p>
        </div>

        <div
          ref={ref}
          className="flex flex-wrap justify-center gap-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`bg-dark-light p-6 rounded-lg transition-all duration-700 transform w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${
                inView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-dark-lighter rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {renderIcon(benefit.icon)}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;