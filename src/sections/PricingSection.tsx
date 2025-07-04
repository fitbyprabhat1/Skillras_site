import React from 'react';
import { pricingPlans } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import Button from '../components/Button';
import { Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  const handlePurchase = (purchaseLink: string) => {
    window.open(purchaseLink, '_blank');
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-dark-light text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Invest in your future with our flexible pricing options. Each plan is designed to provide exceptional value.
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-dark rounded-lg overflow-hidden transition-all duration-700 transform ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              } ${plan.featured ? 'relative z-10' : ''}`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                boxShadow: plan.featured ? '0 0 20px rgba(255, 68, 68, 0.5)' : 'none'
              }}
            >
              {plan.featured && (
                <div className="bg-primary text-white text-center py-2 font-bold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-primary' : ''}`}>
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                </div>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={20} className="text-primary mr-2 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/enroll" className="block">
                  <Button 
                    className="w-full" 
                    variant={plan.featured ? 'primary' : 'outline'}
                    glowing={plan.featured}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
              
              <div className="p-4 bg-dark-lighter border-t border-dark-light flex items-center justify-center text-sm text-gray-300">
                <Shield size={16} className="mr-2" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;