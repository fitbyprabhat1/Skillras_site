import React, { useEffect, useState } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import EnrollmentForm from '../components/EnrollmentForm';
import { CreditCard, Shield, Clock, CheckCircle, Users, Award, Percent } from 'lucide-react';

const EnrollmentPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  useEffect(() => {
    // Get package from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    if (packageParam && ['starter', 'professional', 'enterprise'].includes(packageParam)) {
      setSelectedPackage(packageParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Course <span className="text-primary">Enrollment</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Select your package, enter your referral or coupon code to unlock exclusive discounts and enroll in your chosen courses.
            </p>
            
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
                courseId="multi-course-package"
                courseName="SkillRas Course Packages"
                originalPrice={9999}
                preSelectedPackage={selectedPackage}
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
                      <h3 className="text-white font-medium mb-1">Select Your Package</h3>
                      <p className="text-gray-300 text-sm">Choose from Starter, Professional, or Enterprise packages</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enter Your Code</h3>
                      <p className="text-gray-300 text-sm">Input your referral or coupon code and verify it's valid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Fill Your Details</h3>
                      <p className="text-gray-300 text-sm">Complete the enrollment form with your personal information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      4
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
                      <p className="text-gray-300 text-sm">Get up to 70% off on packages</p>
                    </div>
                    <div className="text-primary font-bold">Up to 70%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Referral Codes</h3>
                      <p className="text-gray-300 text-sm">Friend referral benefits</p>
                    </div>
                    <div className="text-primary font-bold">Up to 50%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Affiliate Codes</h3>
                      <p className="text-gray-300 text-sm">Special partner discounts</p>
                    </div>
                    <div className="text-primary font-bold">Up to 60%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Package Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">SkillRas Course Packages</h3>
                    <p className="text-gray-300 text-sm mb-4">Choose from our comprehensive course packages designed for different skill levels and career goals.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Users className="text-primary" size={20} />
                      <span className="text-gray-300">10,000+ students enrolled</span>
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