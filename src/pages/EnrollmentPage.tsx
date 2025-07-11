import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import NavBarWithPackages from '../components/NavBarWithPackages';
import EnrollmentForm from '../components/EnrollmentForm';
import { CreditCard, Shield, Clock, CheckCircle, Users, Award, Percent } from 'lucide-react';

// Course data - you can move this to a separate file or fetch from API
const COURSES = {
  'premiere-pro-mastery': {
    id: 'premiere-pro-mastery',
    name: 'Premiere Pro Mastery',
    originalPrice: 7999,
    description: 'Master Adobe Premiere Pro with hands-on projects and professional techniques.',
    students: 2500,
    duration: '12 weeks',
    level: 'Beginner to Advanced'
  },
  'photoshop-fundamentals': {
    id: 'photoshop-fundamentals',
    name: 'Photoshop Fundamentals',
    originalPrice: 5999,
    description: 'Learn photo editing and digital design with Adobe Photoshop.',
    students: 3200,
    duration: '8 weeks',
    level: 'Beginner'
  },
  'web-development-bootcamp': {
    id: 'web-development-bootcamp',
    name: 'Web Development Bootcamp',
    originalPrice: 12999,
    description: 'Full-stack web development from HTML/CSS to React and Node.js.',
    students: 4500,
    duration: '16 weeks',
    level: 'Beginner to Advanced'
  },
  'digital-marketing-pro': {
    id: 'digital-marketing-pro',
    name: 'Digital Marketing Pro',
    originalPrice: 8999,
    description: 'Comprehensive digital marketing strategies and campaign management.',
    students: 1800,
    duration: '10 weeks',
    level: 'Intermediate'
  },
  'ui-ux-design-mastery': {
    id: 'ui-ux-design-mastery',
    name: 'UI/UX Design Mastery',
    originalPrice: 9999,
    description: 'Create stunning user interfaces and exceptional user experiences.',
    students: 2100,
    duration: '14 weeks',
    level: 'Beginner to Advanced'
  }
};

const EnrollmentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get course ID from URL params or search params
    const currentCourseId = courseId || searchParams.get('course');
    
    if (currentCourseId && COURSES[currentCourseId as keyof typeof COURSES]) {
      setSelectedCourse(COURSES[currentCourseId as keyof typeof COURSES]);
      setError(null);
    } else {
      setError('Course not found. Please select a valid course.');
    }
    
    setLoading(false);
  }, [courseId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading course details...</div>
      </div>
    );
  }

  if (error || !selectedCourse) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBarWithPackages />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Course Not Found</h1>
            <p className="text-xl text-gray-300 mb-8">{error}</p>
            
            <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
              <h2 className="text-2xl font-bold text-white mb-6">Available Courses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(COURSES).map((course) => (
                  <a
                    key={course.id}
                    href={`/enrollment/${course.id}`}
                    className="block p-4 bg-dark rounded-lg hover:bg-dark/80 transition-colors border border-primary/20 hover:border-primary/40"
                  >
                    <h3 className="text-white font-medium mb-2">{course.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{course.description}</p>
                    <div className="text-primary font-bold">₹{course.originalPrice.toLocaleString()}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Course <span className="text-primary">Enrollment</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Enter your referral or coupon code to unlock exclusive discounts for <strong>{selectedCourse.name}</strong>.
            </p>
            <div className="text-lg text-primary font-medium mb-8">
              {selectedCourse.level} • {selectedCourse.duration}
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Shield className="text-primary" size={20} />
                <span>Secure Enrollment</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Percent className="text-primary" size={20} />
                <span>Instant Discounts</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Clock className="text-primary" size={20} />
                <span>Quick Process</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <CheckCircle className="text-primary" size={20} />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <EnrollmentForm 
                courseId={selectedCourse.id}
                courseName={selectedCourse.name}
                originalPrice={selectedCourse.originalPrice}
              />
            </div>
            
            <div className="space-y-8">
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <CreditCard className="mr-3 text-primary" size={28} />
                  How Enrollment Works
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enter Your Code</h3>
                      <p className="text-gray-300 text-sm">Input your referral or coupon code and verify it's valid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Fill Your Details</h3>
                      <p className="text-gray-300 text-sm">Complete the enrollment form with your personal information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Complete Payment</h3>
                      <p className="text-gray-300 text-sm">Proceed to secure payment and get instant course access</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Available Discounts
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Coupon Codes</h3>
                      <p className="text-gray-300 text-sm">Get up to 60% off on courses</p>
                    </div>
                    <div className="text-primary font-bold">Up to 60%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Referral Codes</h3>
                      <p className="text-gray-300 text-sm">Friend referral benefits</p>
                    </div>
                    <div className="text-primary font-bold">Up to 45%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Affiliate Codes</h3>
                      <p className="text-gray-300 text-sm">Special partner discounts</p>
                    </div>
                    <div className="text-primary font-bold">Up to 50%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{selectedCourse.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{selectedCourse.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-dark p-3 rounded-lg">
                        <div className="text-primary font-bold text-sm">Duration</div>
                        <div className="text-white">{selectedCourse.duration}</div>
                      </div>
                      <div className="bg-dark p-3 rounded-lg">
                        <div className="text-primary font-bold text-sm">Level</div>
                        <div className="text-white">{selectedCourse.level}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Users className="text-primary" size={20} />
                      <span className="text-gray-300">{selectedCourse.students.toLocaleString()}+ students enrolled</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Award className="text-primary" size={20} />
                      <span className="text-gray-300">Certificate of completion</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Shield className="text-primary" size={20} />
                      <span className="text-gray-300">30-day money-back guarantee</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="text-primary" size={20} />
                      <span className="text-gray-300">Lifetime course access</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Other Available Courses
                </h2>
                
                <div className="space-y-3">
                  {Object.values(COURSES)
                    .filter(course => course.id !== selectedCourse.id)
                    .slice(0, 3)
                    .map((course) => (
                      <a
                        key={course.id}
                        href={`/enrollment/${course.id}`}
                        className="block p-4 bg-dark rounded-lg hover:bg-dark/80 transition-colors border border-primary/20 hover:border-primary/40"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-medium mb-1">{course.name}</h3>
                            <p className="text-gray-400 text-sm">{course.level}</p>
                          </div>
                          <div className="text-primary font-bold">₹{course.originalPrice.toLocaleString()}</div>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Need Help?
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Don't have a referral code?
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Contact our team to get a special discount code for your course enrollment.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Code not working?
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Make sure your code is entered correctly and hasn't expired. Contact support if you need assistance.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Contact Support
                    </h3>
                    <div className="space-y-2">
                      <a 
                        href="mailto:admin@skillras.com" 
                        className="text-primary hover:text-primary-light transition-colors flex items-center"
                      >
                        📧 admin@skillras.com
                      </a>
                      <span className="text-gray-400 text-sm">
                        Response time: Within 24 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;