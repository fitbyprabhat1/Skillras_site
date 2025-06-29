import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import Button from '../components/Button';
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
  ArrowRight
} from 'lucide-react';

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
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
  link: string;
}

const courses: Course[] = [
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
    features: [
      'React & JavaScript',
      'Node.js & Databases',
      'Responsive Design',
      'API Development',
      'Deployment & Hosting'
    ],
    comingSoon: true,
    link: '#'
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
    features: [
      'Camera Settings & Techniques',
      'Composition & Lighting',
      'Photo Editing',
      'Business & Pricing',
      'Portfolio Development'
    ],
    comingSoon: true,
    link: '#'
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
    features: [
      'Content Strategy',
      'Video & Photo Creation',
      'Social Media Growth',
      'Brand Building',
      'Monetization Strategies'
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
            Choose Your <span className="text-primary">Learning Path</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master in-demand skills with our comprehensive courses designed by industry experts. 
            Start your journey to success today.
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
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
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-dark-light rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {course.icon}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-400 mb-1">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 font-medium">{course.rating}</span>
                    </div>
                    <div className="text-sm text-gray-400">{course.students.toLocaleString()} students</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.level}
                  </div>
                </div>
                
                <ul className="space-y-2 mb-8">
                  {course.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                  {course.features.length > 3 && (
                    <li className="text-sm text-gray-400 ml-5">
                      +{course.features.length - 3} more features
                    </li>
                  )}
                </ul>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {course.originalPrice && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
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
        
        <div className="text-center mt-16">
          <div className="bg-dark rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Can't Decide Which Course to Take?</h3>
            <p className="text-gray-300 mb-6">
              Book a free consultation with our learning advisors to find the perfect course for your goals.
            </p>
            <Button variant="outline" size="lg">
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;