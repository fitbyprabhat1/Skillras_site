import React, { useState } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
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

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  originalPrice?: number;
  duration: string;
  students: number;
  rating: number;
  level: string;
  category: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  link: string;
  instructor: string;
  lastUpdated: string;
}

const allCourses: Course[] = [
  {
    id: 'premiere-pro',
    title: 'Premiere Pro Mastery',
    description: 'Master Adobe Premiere Pro and create professional videos that captivate and convert. Learn advanced editing techniques used by top creators.',
    icon: <Video size={32} className="text-primary" />,
    price: 4999,
    originalPrice: 9999,
    duration: '35 hours',
    students: 2547,
    rating: 4.8,
    level: 'Beginner to Advanced',
    category: 'Video Editing',
    features: [
      'Professional Video Editing',
      'Color Grading & Correction',
      'Audio Enhancement',
      'Social Media Optimization',
      'Career Guidance',
      'Live Projects',
      'Certificate of Completion'
    ],
    isPopular: true,
    link: '/premiere-pro',
    instructor: 'Alex Rodriguez',
    lastUpdated: 'December 2024'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Learn comprehensive digital marketing strategies including SEO, social media, PPC, and content marketing to grow any business.',
    icon: <TrendingUp size={32} className="text-primary" />,
    price: 6999,
    originalPrice: 12999,
    duration: '45 hours',
    students: 1823,
    rating: 4.9,
    level: 'Beginner to Expert',
    category: 'Marketing',
    features: [
      'SEO & Content Strategy',
      'Social Media Marketing',
      'Google Ads & Facebook Ads',
      'Email Marketing',
      'Analytics & Reporting',
      'Marketing Automation',
      'ROI Optimization'
    ],
    comingSoon: true,
    link: '#',
    instructor: 'Sarah Johnson',
    lastUpdated: 'Coming January 2025'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design Pro',
    description: 'Master Photoshop, Illustrator, and design principles to create stunning visuals for brands, social media, and print.',
    icon: <Palette size={32} className="text-primary" />,
    price: 5499,
    originalPrice: 10999,
    duration: '40 hours',
    students: 1456,
    rating: 4.7,
    level: 'Beginner to Advanced',
    category: 'Design',
    features: [
      'Adobe Creative Suite',
      'Brand Identity Design',
      'Social Media Graphics',
      'Print Design',
      'Portfolio Building',
      'Client Management',
      'Freelancing Tips'
    ],
    comingSoon: true,
    link: '#',
    instructor: 'Michael Chen',
    lastUpdated: 'Coming February 2025'
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Build modern, responsive websites and web applications using React, Node.js, and the latest web technologies.',
    icon: <Code size={32} className="text-primary" />,
    price: 8999,
    originalPrice: 15999,
    duration: '60 hours',
    students: 987,
    rating: 4.8,
    level: 'Beginner to Expert',
    category: 'Programming',
    features: [
      'React & JavaScript',
      'Node.js & Databases',
      'Responsive Design',
      'API Development',
      'Deployment & Hosting',
      'Version Control',
      'Testing & Debugging'
    ],
    comingSoon: true,
    link: '#',
    instructor: 'David Thompson',
    lastUpdated: 'Coming March 2025'
  },
  {
    id: 'photography',
    title: 'Professional Photography',
    description: 'Master photography fundamentals, composition, lighting, and post-processing to create stunning images that sell.',
    icon: <Camera size={32} className="text-primary" />,
    price: 4499,
    originalPrice: 8999,
    duration: '30 hours',
    students: 756,
    rating: 4.6,
    level: 'Beginner to Advanced',
    category: 'Photography',
    features: [
      'Camera Settings & Techniques',
      'Composition & Lighting',
      'Photo Editing',
      'Business & Pricing',
      'Portfolio Development',
      'Client Relations',
      'Equipment Guide'
    ],
    comingSoon: true,
    link: '#',
    instructor: 'Emma Rodriguez',
    lastUpdated: 'Coming April 2025'
  },
  {
    id: 'content-creation',
    title: 'Content Creation Mastery',
    description: 'Learn to create engaging content across all platforms, build your personal brand, and monetize your audience.',
    icon: <Megaphone size={32} className="text-primary" />,
    price: 3999,
    originalPrice: 7999,
    duration: '25 hours',
    students: 1234,
    rating: 4.7,
    level: 'Beginner to Advanced',
    category: 'Content',
    features: [
      'Content Strategy',
      'Video & Photo Creation',
      'Social Media Growth',
      'Brand Building',
      'Monetization Strategies',
      'Audience Engagement',
      'Analytics & Insights'
    ],
    comingSoon: true,
    link: '#',
    instructor: 'Jordan Smith',
    lastUpdated: 'Coming May 2025'
  }
];

const categories = ['All', 'Video Editing', 'Marketing', 'Design', 'Programming', 'Photography', 'Content'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AllCoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const { ref, inView } = useInView({ threshold: 0.1 });

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level.includes(selectedLevel);
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
        return b.rating - a.rating;
      case 'students':
        return b.students - a.students;
      default:
        return b.isPopular ? 1 : -1;
    }
  });

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
                key={course.id}
                className={`bg-dark-light rounded-xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl group ${
                  inView 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                } ${course.isPopular ? 'ring-2 ring-primary' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {course.isPopular && (
                  <div className="bg-primary text-white text-center py-2 font-bold text-sm">
                    🔥 MOST POPULAR
                  </div>
                )}
                
                {course.comingSoon && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 font-bold text-sm">
                    🚀 COMING SOON
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-dark rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {course.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400 mb-1">
                        <Star size={14} className="fill-current" />
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                      <div className="text-xs text-gray-400">{course.students.toLocaleString()} students</div>
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
                      <Clock size={12} className="mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users size={12} className="mr-1" />
                      {course.level}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Instructor: {course.instructor}</div>
                    <div className="text-xs text-gray-400">Updated: {course.lastUpdated}</div>
                  </div>
                  
                  <ul className="space-y-1 mb-6">
                    {course.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-300">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                    {course.features.length > 3 && (
                      <li className="text-xs text-gray-400 ml-3.5">
                        +{course.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  {course.comingSoon ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Link to={course.link} className="block">
                      <Button 
                        className="w-full group-hover:bg-primary-light transition-colors" 
                        glowing={course.isPopular}
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