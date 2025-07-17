import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import Button from '../components/Button';
import courses from '../data/courses';
import packageCourses from '../data/packageCourses';

const getAllUniqueCourses = () => {
  // Get all course ids from all packages
  const allIds = Object.values(packageCourses).flat();
  // Remove duplicates
  const uniqueIds = Array.from(new Set(allIds));
  // Map to course data
  return uniqueIds.map((id) => courses[id]).filter(Boolean);
};

const CoursesSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const allCourses = getAllUniqueCourses();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Responsive visibleCount
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(3);
      }
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? allCourses.length - visibleCount : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount >= allCourses.length ? 0 : prev + 1));
  };

  let visibleCourses = allCourses.slice(startIndex, startIndex + visibleCount);
  // If at the end, wrap around
  if (visibleCourses.length < visibleCount && allCourses.length > visibleCount) {
    visibleCourses = visibleCourses.concat(allCourses.slice(0, visibleCount - visibleCourses.length));
  }

  return (
    <section id="courses" className="py-20 px-4 bg-dark-light text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Courses</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start your journey with our top courses. Swipe to explore more!
          </p>
          <Link to="/courses">
            <Button variant="outline" size="lg">
              View All Courses
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4 mb-8">
          <button onClick={handlePrev} className="bg-dark rounded-full p-2 border border-gray-600 hover:bg-primary/20 transition">
            <span className="sr-only">Previous</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div
            ref={ref as React.LegacyRef<HTMLDivElement>}
            className={`grid grid-cols-1 md:grid-cols-${visibleCount} gap-8 w-full max-w-4xl`}
          >
            {visibleCourses.map((course, index) => (
              <div
                key={course.id}
                className={`rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-dark ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link to={`/course/${course.id}`} className="block">
                  {/* 16:9 aspect ratio image */}
                  <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Title and author below image, left-aligned */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white text-left mb-1">{course.name}</h3>
                    <p className="text-sm text-gray-400 text-left">By {course.author}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button onClick={handleNext} className="bg-dark rounded-full p-2 border border-gray-600 hover:bg-primary/20 transition">
            <span className="sr-only">Next</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;