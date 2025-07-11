import React, { useState } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import Button from '../components/Button';
import { 
  Package, 
  Star, 
  Check, 
  X, 
  Crown, 
  Zap, 
  Users, 
  Award,
  BookOpen,
  Clock,
  Shield,
  Headphones,
  Video,
  TrendingUp,
  Palette,
  Camera,
  Code,
  Megaphone
} from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface Course {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: string;
  level: string;
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  courses: Course[];
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  color: string;
  badge?: string;
  totalHours: number;
  supportLevel: string;
  mentoringSessions: number;
}

const allCourses: Course[] = [
  {
    id: 'premiere-pro',
    name: 'Premiere Pro Mastery',
    icon: <Video size={20} className="text-primary" />,
    duration: '35 hours',
    level: 'Beginner to Advanced'
  },
  {
    id: 'After effects',
    name: 'After effects Mastery',
    icon: <TrendingUp size={20} className="text-primary" />,
    duration: '45 hours',
    level: 'Beginner to Expert'
  },
  {
    id: 'Excel',
    name: 'MS Excel',
    icon: <Palette size={20} className="text-primary" />,
    duration: '40 hours',
    level: 'Beginner to Advanced'
  },
];

const packages: PackageData[] = [
  {
    id: 'starter',
    name: 'Starter (Basic)',
    description: 'Perfect for beginners starting their digital journey',
    price: 7999,
    originalPrice: 9999,
    discount: 50,
    courses: [
      allCourses[0], // Premiere Pro
    ],
    features: [
      '1 Complete Courses',
      'Lifetime Access',
      '30% Affilate Comission',
      'Basic Email Support',
      'Basic Whatsapp Support',
      'Certificate of Completion',
      'Downloadable Resources'
    ],
    color: 'from-blue-500 to-blue-600',
    badge: 'Best for Beginners',
    totalHours: 90,
    supportLevel: 'Email Support',
    mentoringSessions: 0
  },
  {
    id: 'professional',
    name: 'Pro (Intermediate)',
    description: 'Most popular choice for career advancement',
    price: 9600,
    originalPrice: 14999,
    discount: 36,
    courses: [
      allCourses[0], // Premiere Pro
      allCourses[1], // after effects
     
    ],
    features: [
      '2 Complete Courses',
      'Lifetime Access',
      '50% Affilate Comission',
      'Email Support',
      'Whatsapp Support',
      'Certificate of Completion',
      'Downloadable Resources'
    ],
    isPopular: true,
    color: 'from-primary to-red-600',
    badge: 'Most Popular',
    totalHours: 195,
    supportLevel: 'Priority Support',
    mentoringSessions: 1
  },
  {
    id: 'enterprise',
    name: 'Mastery (Advanced)',
    description: 'Complete skill transformation for professionals',
    price: 13200,
    originalPrice: 29999,
    discount: 55,
    courses: allCourses,
    features: [
      '2 Complete Courses',
      'Lifetime Access',
      '50% Affilate Comission',
      'Email Support',
      'Whatsapp Support',
      'Certificate of Completion',
      'Downloadable Resources'
    ],
    isPremium: true,
    color: 'from-purple-500 to-purple-600',
    badge: 'Best Value',
    totalHours: 235,
    supportLevel: 'VIP Support',
    mentoringSessions: 3
  }
];

const PackagesPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
   if (packageId === "starter") {
    router.push('/enroll');
  }
    // Here you would typically redirect to checkout or open a modal

      };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBarWithPackages />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-dark via-dark-light to-dark">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center bg-primary/20 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <Package className="text-primary mr-2" size={20} />
            <span className="text-sm font-medium">Course Packages</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="text-primary">Learning Path</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Save big with our comprehensive course packages. Get multiple courses at a fraction of the individual price 
            and accelerate your career transformation.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-3">
              <Users className="text-primary" size={32} />
              <div className="text-left">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-gray-400">Students Enrolled</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <BookOpen className="text-primary" size={32} />
              <div className="text-left">
                <div className="text-3xl font-bold">6</div>
                <div className="text-gray-400">Expert Courses</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="text-primary" size={32} />
              <div className="text-left">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
          
          <Button onClick={toggleComparison} variant="outline" size="lg">
            {showComparison ? 'Hide' : 'Show'} Detailed Comparison
          </Button>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div 
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative bg-dark-light rounded-xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl ${
                  inView 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                } ${pkg.isPopular ? 'ring-2 ring-primary scale-105' : ''} ${pkg.isPremium ? 'ring-2 ring-purple-500' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    pkg.isPopular ? 'bg-primary' : pkg.isPremium ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {pkg.badge}
                  </div>
                )}
                
                {/* Premium Crown */}
                {pkg.isPremium && (
                  <div className="absolute top-4 right-4">
                    <Crown className="text-purple-400" size={24} />
                  </div>
                )}
                
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-gray-300 text-sm mb-6">{pkg.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-6">
                      {pkg.price === 0 ? (
                        <div className="text-3xl font-bold text-primary">Custom Pricing</div>
                      ) : (
                        <>
                          <div className="text-4xl font-bold text-primary mb-2">
                            ₹{pkg.price.toLocaleString()}
                          </div>
                          {pkg.originalPrice > 0 && (
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-lg text-gray-400 line-through">
                                ₹{pkg.originalPrice.toLocaleString()}
                              </span>
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                                {pkg.discount}% OFF
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Course List */}
                  {pkg.courses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center">
                        <BookOpen size={16} className="mr-2" />
                        Included Courses ({pkg.courses.length})
                      </h4>
                      <div className="space-y-2">
                        {pkg.courses.map((course, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            {course.icon}
                            <span className="ml-2 text-gray-300">{course.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Package Stats */}
                  {pkg.totalHours > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-dark rounded-lg">
                      <div className="text-center">
                        <Clock className="text-primary mx-auto mb-1" size={20} />
                        <div className="text-lg font-bold">{pkg.totalHours}h</div>
                        <div className="text-xs text-gray-400">Total Content</div>
                      </div>
                      <div className="text-center">
                        <Headphones className="text-primary mx-auto mb-1" size={20} />
                        <div className="text-lg font-bold">{pkg.mentoringSessions}</div>
                        <div className="text-xs text-gray-400">Mentoring</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center">
                      <Star size={16} className="mr-2" />
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {pkg.features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Check size={16} className="text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {pkg.features.length > 6 && (
                        <li className="text-sm text-gray-400 ml-6">
                          +{pkg.features.length - 6} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    onClick={() => handlePackageSelect(pkg.id)}
                    className="w-full" 
                    variant={pkg.isPopular || pkg.isPremium ? 'primary' : 'outline'}
                    glowing={pkg.isPopular}
                  >
                    {pkg.price === 0 ? 'Get Custom Quote' : 'Choose Package'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      {showComparison && (
        <section className="py-20 px-4 bg-dark-light">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Detailed Package Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-dark rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-dark-lighter">
                    <th className="p-4 text-left">Features</th>
                    {packages.map((pkg) => (
                      <th key={pkg.id} className="p-4 text-center">
                        <div className="font-bold">{pkg.name}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {pkg.price === 0 ? 'Custom' : `₹${pkg.price.toLocaleString()}`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Number of Courses</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {pkg.courses.length === 0 ? 'Custom' : pkg.courses.length}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Total Content Hours</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {pkg.totalHours === 0 ? 'Custom' : `${pkg.totalHours}h`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Support Level</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {pkg.supportLevel}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Mentoring Sessions</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {pkg.mentoringSessions === 0 ? (pkg.id === 'custom' ? 'Custom' : 'None') : pkg.mentoringSessions}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Lifetime Access</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        <Check className="text-green-500 mx-auto" size={20} />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Certificate</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        <Check className="text-green-500 mx-auto" size={20} />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="p-4 font-medium">Job Assistance</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {pkg.id === 'starter' ? (
                          <X className="text-red-500 mx-auto" size={20} />
                        ) : (
                          <Check className="text-green-500 mx-auto" size={20} />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-dark-light rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Can I upgrade my package later?</h3>
              <p className="text-gray-300">
                Yes! You can upgrade to any higher package at any time. You'll only pay the difference between your current package and the new one.
              </p>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">What's included in the mentoring sessions?</h3>
              <p className="text-gray-300">
                One-on-one video calls with industry experts to review your progress, get personalized feedback, and receive career guidance tailored to your goals.
              </p>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Is there a money-back guarantee?</h3>
              <p className="text-gray-300">
                Yes! We offer a 30-day money-back guarantee on all packages. If you're not satisfied, we'll refund your purchase in full.
              </p>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">How does the Custom Package work?</h3>
              <p className="text-gray-300">
                Contact our team to discuss your specific needs. We'll create a tailored learning path with custom pricing based on your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-dark-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have already started their journey to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" glowing>
              <Zap className="mr-2" size={20} />
              Choose Your Package
            </Button>
            <Button variant="outline" size="lg">
              <Shield className="mr-2" size={20} />
              30-Day Guarantee
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;