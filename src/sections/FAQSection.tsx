import React, { useState } from 'react';
import { faqs } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-dark text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get answers to the most common questions about our course
          </p>
        </div>
        
        <div 
          ref={ref}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-dark-light rounded-lg overflow-hidden transition-all duration-500 transform ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div 
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-dark-lighter transition-colors"
                onClick={() => toggleFaq(faq.id)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <div className="text-primary">
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  expandedFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;