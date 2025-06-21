import React, { useState } from 'react';
import { resultsImages } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ResultsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === resultsImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? resultsImages.length - 1 : prev - 1));
  };

  // Safeguard for empty resultsImages
  if (!resultsImages || resultsImages.length === 0) {
    return (
      <section id="results" className="py-20 px-4 bg-dark text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results from Real Creators</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              No results available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="results" className="py-20 px-4 bg-dark text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results from Creators</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the stunning Results By Creators Achived after Learning Editing
          </p>
        </div>

        <div
          ref={ref}
          className={`relative transition-all duration-700 transform ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="relative aspect-video overflow-hidden rounded-xl max-w-4xl mx-auto shadow-[0_0_20px_rgba(255,0,0,0.8)]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {resultsImages.map((result, index) => (
                <img
                  key={result.id}
                  src={result.image}
                  alt={result.title || `Result ${index + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold mb-2">
              {resultsImages[currentIndex].title || 'Untitled Result'}
            </h3>
            <p className="text-gray-300">
              {resultsImages[currentIndex].description || 'No description available.'}
            </p>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center space-x-2 mt-6">
            {resultsImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'w-6 bg-primary' : 'bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;