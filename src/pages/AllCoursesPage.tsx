import React, { useState } from 'react';
import { useEffect } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import { CourseService } from '../lib/courseService';
import type { Course } from '../types/course';
import { 
  Video, 
  TrendingUp, 
  Palette, 
  Code, 
  Camera, 
  Megaphone,
  Star,
  Clock,
  Users,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

// Icon mapping for categories
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'video editing':
      return <Video size={32} className="text-primary" />;
    case 'marketing':
    case 'digital marketing':
      return <TrendingUp size={32} className="text-primary" />;
    case 'design':
    case 'graphic design':
      return <Palette size={32} className="text-primary" />;
    case 'programming':
    case 'web development':
      return <Code size={32} className="text-primary" />;
    case 'photography':
      return <Camera size={32} className="text-primary" />;
    case 'content':
    case 'content creation':
      return <Megaphone size={32} className="text-primary" />;
    default:
      return <BookOpen size={32} className="text-primary" />;
  }
};

const categories = ['All', 'Video Editing', 'Digital Marketing', 'Design', 'Programming', 'Photography', 'Content Creation'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AllCoursesPage: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await CourseService.getPublishedCourses(1, 50); // Get all courses
      setAllCourses(result.courses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.skill_level.includes(selectedLevel.toLowerCase());
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.average_rating - a.average_rating;
      case 'students':
        return b.students_count - a.students_count;
      default:
        return b.is_popular ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <NavBarWithPackages />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="animate-pulse">
                <div className="h-8 bg-dark-light rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-dark-light rounded w-2/3 mx-auto"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-dark-light rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-dark"></div>
                  <div className="p-6">
                    <div className="h-4 bg-dark rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-dark rounded w-full mb-4"></div>
                    <div className="h-8 bg-dark rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <NavBarWithPackages />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Error Loading Courses</h2>
              <p className="mb-4">{error}</p>
              <Button onClick={fetchCourses}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBarWithPackages />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-dark via-dark-light to-dark">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <BookOpen className="text-primary mr-2" size={20} />
            <span className="text-sm font-medium">Explore All Courses</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master <span className="text-primary">Any Skill</span> You Want
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Choose from our comprehensive collection of expert-led courses designed to transform your career and unlock your potential.
          </p>
          
          {/* Search and Filters */}
          <div className="bg-dark-light rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="students">Most Students</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Filter size={16} />
              <span>Showing {selectedCategory} courses</span>
            </div>
          </div>
          
          <div 
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedCourses.map((course, index) => (
              <div
                key={course.course_id}
                className={`bg-dark-light rounded-xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl group ${
                  inView 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                } ${course.is_popular ? 'ring-2 ring-primary' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {course.is_popular && (
                  <div className="bg-primary text-white text-center py-2 font-bold text-sm">
                    🔥 MOST POPULAR
                  </div>
                )}
                
                {course.is_coming_soon && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 font-bold text-sm">
                    🚀 COMING SOON
                  </div>
                )}
                
                {/* Course Thumbnail */}
                <div className="relative overflow-hidden">
                  <img 
                    src={course.thumbnail_image || 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-dark/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {getCategoryIcon(course.category)}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-dark/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center text-yellow-400 text-sm">
                      <Star size={14} className="fill-current mr-1" />
                      <span className="font-medium">{course.average_rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-400">{course.students_count.toLocaleString()} students</div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                    <div className="flex items-center">
                      <Users size={12} className="mr-1" />
                      {course.skill_level}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Instructor: {course.instructor_name}</div>
                    <div className="text-xs text-gray-400">Updated: {new Date(course.last_updated_date).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-xs text-gray-300 mb-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {course.total_lessons} lessons
                    </div>
                    <div className="flex items-center text-xs text-gray-300 mb-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      Lifetime access
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      Certificate included
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                      {course.original_price && course.original_price > course.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{course.original_price.toLocaleString()}</span>
                      )}
                    </div>
                    {course.original_price && course.original_price > course.price && (
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round((1 - course.price / course.original_price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  {course.is_coming_soon ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Link to={`/course/${course.course_id}`} className="block">
                      <Button 
                        className="w-full group-hover:bg-primary-light transition-colors" 
                        glowing={course.is_popular}
                      >
                        Enroll Now
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {sortedCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-dark-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Courses Found</h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your search criteria or browse all courses.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All Levels');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-dark-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have transformed their careers with SkillRas courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages">
              <Button size="lg" glowing>
                <Award className="mr-2" size={20} />
                View Packages
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Zap className="mr-2" size={20} />
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllCoursesPage;