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
      
      <div className="container mx-auto px-4 py-4 md:py-8 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Course <span className="text-primary">Enrollment & Signup</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
              Create your account, select your package, and enter your referral or coupon code to unlock exclusive discounts and enroll in your chosen courses.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-8 md:mb-12 px-4">
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-300 text-sm md:text-base">
                <Shield className="text-primary" size={18} />
                <span className="text-center">Secure Enrollment</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-300 text-sm md:text-base">
                <Percent className="text-primary" size={18} />
                <span className="text-center">Instant Discounts</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-300 text-sm md:text-base">
                <Clock className="text-primary" size={18} />
                <span className="text-center">Quick Process</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-300 text-sm md:text-base">
                <CheckCircle className="text-primary" size={18} />
                <span className="text-center">Lifetime Access</span>
              </div>
            </div>
          </div>
          
          {/* Enrollment Form - Now appears first */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-12">
            <EnrollmentForm 
              courseId="multi-course-package"
              courseName="SkillRas Course Packages"
              originalPrice={9999}
              preSelectedPackage={selectedPackage}
            />
          </div>
          
          {/* Information Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start">
              <div className="space-y-6 md:space-y-8">
                <div className="bg-dark-light rounded-xl p-4 md:p-8 border border-primary/10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                    <CreditCard className="mr-2 md:mr-3 text-primary" size={24} />
                    How Enrollment Works
                  </h2>
                  
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1 text-sm md:text-base">Select Your Package</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Choose from Starter, Professional, or Enterprise packages</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1 text-sm md:text-base">Enter Your Code</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Input your referral or coupon code and verify it's valid</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1 text-sm md:text-base">Fill Your Details</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Complete the enrollment form with your personal information</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1 text-sm md:text-base">Complete Payment</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Proceed to secure payment and get instant course access</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-light rounded-xl p-4 md:p-8 border border-primary/10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                    Available Discounts
                  </h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between p-3 md:p-4 bg-dark rounded-lg">
                      <div>
                        <h3 className="text-white font-medium text-sm md:text-base">Coupon Codes</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Get up to 70% off on packages</p>
                      </div>
                      <div className="text-primary font-bold text-sm md:text-base">Up to 70%</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 md:p-4 bg-dark rounded-lg">
                      <div>
                        <h3 className="text-white font-medium text-sm md:text-base">Referral Codes</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Friend referral benefits</p>
                      </div>
                      <div className="text-primary font-bold text-sm md:text-base">Up to 50%</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 md:p-4 bg-dark rounded-lg">
                      <div>
                        <h3 className="text-white font-medium text-sm md:text-base">Affiliate Codes</h3>
                        <p className="text-gray-300 text-xs md:text-sm">Special partner discounts</p>
                      </div>
                      <div className="text-primary font-bold text-sm md:text-base">Up to 60%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="bg-dark-light rounded-xl p-4 md:p-8 border border-primary/10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                    Package Details
                  </h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <h3 className="text-base md:text-lg font-medium text-white mb-2">SkillRas Course Packages</h3>
                      <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">Choose from our comprehensive course packages designed for different skill levels and career goals.</p>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Users className="text-primary" size={16} />
                        <span className="text-gray-300 text-xs md:text-sm">10,000+ students enrolled</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Award className="text-primary" size={16} />
                        <span className="text-gray-300 text-xs md:text-sm">Certificate of completion</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Shield className="text-primary" size={16} />
                        <span className="text-gray-300 text-xs md:text-sm">30-day money-back guarantee</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Clock className="text-primary" size={16} />
                        <span className="text-gray-300 text-xs md:text-sm">Lifetime course access</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-light rounded-xl p-4 md:p-8 border border-primary/10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                    Need Help?
                  </h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <h3 className="text-base md:text-lg font-medium text-white mb-2">
                        Don't have a referral code?
                      </h3>
                      <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-3">
                        Contact our team to get a special discount code for your course enrollment.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base md:text-lg font-medium text-white mb-2">
                        Code not working?
                      </h3>
                      <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-3">
                        Make sure your code is entered correctly and hasn't expired. Contact support if you need assistance.
                      </p>
                    </div>
                    
                    <div className="pt-3 md:pt-4 border-t border-gray-600">
                      <h3 className="text-base md:text-lg font-medium text-white mb-2">
                        Contact Support
                      </h3>
                      <div className="space-y-2">
                        <a 
                          href="mailto:admin@skillras.com" 
                          className="text-primary hover:text-primary-light transition-colors text-sm md:text-base flex items-center"
                        >
                          📧 admin@skillras.com
                        </a>
                        <span className="text-gray-400 text-xs md:text-sm">
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
    </div>
  );
};

export default EnrollmentPage;