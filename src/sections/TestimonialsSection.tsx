import React, { useState, useEffect } from 'react';
import { testimonials, courseStats } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const TestimonialsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-dark text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful marketers who have transformed their careers with our course
          </p>
        </div>
        
        <div ref={ref} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`bg-dark-light p-6 rounded-lg text-center transition-all duration-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '0ms' }}>
              <h3 className="text-4xl font-bold text-primary mb-2">
                {inView ? <AnimatedCounter end={courseStats.students} /> : 0}+
              </h3>
              <p className="text-gray-300">Students Enrolled</p>
            </div>
            
            <div className={`bg-dark-light p-6 rounded-lg text-center transition-all duration-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '150ms' }}>
              <h3 className="text-4xl font-bold text-primary mb-2">
                {inView ? <AnimatedCounter end={courseStats.lessons} /> : 0}
              </h3>
              <p className="text-gray-300">Comprehensive Lessons</p>
            </div>
            
            <div className={`bg-dark-light p-6 rounded-lg text-center transition-all duration-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
              <h3 className="text-4xl font-bold text-primary mb-2">
                {inView ? <AnimatedCounter end={courseStats.hours} /> : 0}+
              </h3>
              <p className="text-gray-300">Hours of Content</p>
            </div>
            
            <div className={`bg-dark-light p-6 rounded-lg text-center transition-all duration-500 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '450ms' }}>
              <h3 className="text-4xl font-bold text-primary mb-2">
                {inView ? <AnimatedCounter end={courseStats.rating} decimals={1} /> : 0}/5
              </h3>
              <p className="text-gray-300">Average Rating</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-dark-light p-8 rounded-lg">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-bold text-xl">{testimonial.name}</h3>
                        <p className="text-gray-300">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < testimonial.rating ? "text-primary fill-primary" : "text-gray-400"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 italic">"{testimonial.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-primary hover:bg-primary-light text-white p-2 rounded-full"
            disabled={isAnimating}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-primary hover:bg-primary-light text-white p-2 rounded-full"
            disabled={isAnimating}
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-primary w-6' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;