import React, { useState } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import courses from '../data/courses';
import packageCourses from '../data/packageCourses';

// Helper to get the lowest package for a course and its color
const getCoursePackage = (courseId: string): { label: string; color: string } => {
  if (packageCourses['starter'].includes(courseId)) return { label: 'Starter', color: 'bg-red-600' };
  if (packageCourses['professional'].includes(courseId)) return { label: 'Professional', color: 'bg-green-600' };
  if (packageCourses['enterprise'].includes(courseId)) return { label: 'Enterprise', color: 'bg-blue-600' };
  return { label: '', color: '' };
};

const packageOptions = [
  { label: 'All', value: 'all' },
  { label: 'Starter', value: 'starter' },
  { label: 'Professional', value: 'professional' },
  { label: 'Enterprise', value: 'enterprise' },
];

// Dynamically get all unique categories from courses
const allCategories = ['All', ...Array.from(new Set(Object.values(courses).map(c => c.category)))];

const AllCoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Get all course objects
  let courseList = Object.values(courses);

  // Filter by package
  if (selectedPackage !== 'all') {
    const allowedIds = new Set(packageCourses[selectedPackage]);
    courseList = courseList.filter(course => allowedIds.has(course.id));
  }

  // Filter by category
  if (selectedCategory !== 'All') {
    courseList = courseList.filter(course => course.category === selectedCategory);
  }

  // Filter by search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    courseList = courseList.filter(
      course =>
        course.name.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBarWithPackages />
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-dark via-dark-light to-dark">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">All <span className="text-primary">Courses</span></h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-dark-light border border-gray-600 text-white"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-dark-light border border-gray-600 text-white"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedPackage}
              onChange={e => setSelectedPackage(e.target.value)}
              className="px-4 py-2 rounded-lg bg-dark-light border border-gray-600 text-white"
            >
              {packageOptions.map(pkg => (
                <option key={pkg.value} value={pkg.value}>{pkg.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
      <section className="py-12 px-4">
        <div
          ref={ref as React.LegacyRef<HTMLDivElement>}
          className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courseList.map((course, idx) => {
            const pkg = getCoursePackage(course.id);
            return (
              <Link
                to={`/broucher/${course.id}`}
                key={course.id}
                className="rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-dark"
              >
                <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden relative">
                  <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                  {/* Package badge */}
                  {pkg.label && (
                    <span className={`absolute top-3 right-3 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10 ${pkg.color}`}>
                      {pkg.label}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white text-left mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-400 text-left">By {course.author}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AllCoursesPage;