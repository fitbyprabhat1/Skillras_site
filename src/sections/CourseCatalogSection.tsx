import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Master modern web development with React, Node.js, and more',
    image: '/images/web-dev-course.jpg',
    duration: '6 months',
    level: 'Beginner to Advanced',
    price: '$199',
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Learn Python, Machine Learning, and Data Analysis',
    image: '/images/data-science-course.jpg',
    duration: '4 months',
    level: 'Intermediate',
    price: '$249',
  },
  // Add more courses...
];

const CourseCatalogSection: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-300 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">{course.duration}</span>
                  <span className="text-green-400 font-bold">
                    {course.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCatalogSection;
