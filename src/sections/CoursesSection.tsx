import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import Button from '../components/Button';
import { 
  Video, 
  TrendingUp, 
  Palette,
  Star,
  Clock,
  Users,
  ArrowRight,
  BookOpen,
  Code,
  Camera,
  Megaphone
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  duration: string;
  students: number;
  rating: number;
  level: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  link: string;
}

// Show only 3 featured courses on main page with thumbnails
const featuredCourses: Course[] = [
  {
    id: 'premiere-pro',
    title: 'Premiere Pro Mastery',
    description: 'Master Adobe Premiere Pro and create professional videos that captivate and convert. Learn advanced editing techniques used by top creators.',
    icon: <Video size={32} className="text-primary" />,
    thumbnail: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 4999,
    originalPrice: 9999,
    duration: '35 hours',
    students: 2547,
    rating: 4.8,
    level: 'Beginner to Advanced',
    features: [
      'Professional Video Editing',
      'Color Grading & Correction',
      'Audio Enhancement',
      'Social Media Optimization',
      'Career Guidance'
    ],
    isPopular: true,
    link: '/premiere-pro'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Learn comprehensive digital marketing strategies including SEO, social media, PPC, and content marketing to grow any business.',
    icon: <TrendingUp size={32} className="text-primary" />,
    thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 6999,
    originalPrice: 12999,
    duration: '45 hours',
    students: 1823,
    rating: 4.9,
    level: 'Beginner to Expert',
    features: [
      'SEO & Content Strategy',
      'Social Media Marketing',
      'Google Ads & Facebook Ads',
      'Email Marketing',
      'Analytics & Reporting'
    ],
    comingSoon: true,
    link: '#'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design Pro',
    description: 'Master Photoshop, Illustrator, and design principles to create stunning visuals for brands, social media, and print.',
    icon: <Palette size={32} className="text-primary" />,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 5499,
    originalPrice: 10999,
    duration: '40 hours',
    students: 1456,
    rating: 4.7,
    level: 'Beginner to Advanced',
    features: [
      'Adobe Creative Suite',
      'Brand Identity Design',
      'Social Media Graphics',
      'Print Design',
      'Portfolio Building'
    ],
    comingSoon: true,
    link: '#'
  }
];

const CoursesSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section id="courses" className="py-20 px-4 bg-dark-light text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Courses</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start your journey with our most popular courses designed by industry experts. 
            Master in-demand skills and transform your career.
          </p>
          <Link to="/courses">
            <Button variant="outline" size="lg">
              <BookOpen className="mr-2" size={20} />
              View All Courses
            </Button>
          </Link>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {featuredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`bg-dark rounded-xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl group ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              } ${course.isPopular ? 'ring-2 ring-primary' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
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
              
              {/* Course Thumbnail */}
              <div className="relative overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 w-12 h-12 bg-dark/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {course.icon}
                </div>
                <div className="absolute bottom-4 right-4 bg-dark/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Star size={14} className="fill-current mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">{course.students.toLocaleString()} students</div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock size={14} className="mr-1" />
                    {course.duration}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {course.level}
                  </div>
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
                
                <div className="flex items-center justify-between mb-6">
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
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-dark rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Want to See All Our Courses?</h3>
            <p className="text-gray-300 mb-6">
              Explore our complete catalog of expert-led courses across multiple disciplines. 
              Find the perfect learning path for your goals.
            </p>
            <Link to="/courses">
              <Button size="lg" glowing>
                <BookOpen className="mr-2" size={20} />
                Explore All Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;