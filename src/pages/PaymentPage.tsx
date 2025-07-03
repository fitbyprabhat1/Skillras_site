import React from 'react';
import NavBar from '../components/NavBar';
import PaymentForm from '../components/PaymentForm';
import { CreditCard, Shield, Clock, CheckCircle, Users, Award, Percent } from 'lucide-react';

const PaymentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Payment <span className="text-primary">Verification</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enter your coupon or affiliate code to unlock exclusive discounts and proceed with your course enrollment.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Shield className="text-primary" size={20} />
                <span>Secure Process</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Percent className="text-primary" size={20} />
                <span>Instant Discounts</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Clock className="text-primary" size={20} />
                <span>Quick Verification</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <CheckCircle className="text-primary" size={20} />
                <span>Guaranteed Access</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <PaymentForm />
            </div>
            
            <div className="space-y-8">
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <CreditCard className="mr-3 text-primary" size={28} />
                  How It Works
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enter Your Code</h3>
                      <p className="text-gray-300 text-sm">Input your coupon or affiliate code and verify it's valid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Fill Your Details</h3>
                      <p className="text-gray-300 text-sm">Complete the form with your personal information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Get Instant Access</h3>
                      <p className="text-gray-300 text-sm">Receive your discount and proceed to course enrollment</p>
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
                      <h3 className="text-white font-medium">Affiliate Codes</h3>
                      <p className="text-gray-300 text-sm">Special partner discounts</p>
                    </div>
                    <div className="text-primary font-bold">Up to 45%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Referral Codes</h3>
                      <p className="text-gray-300 text-sm">Friend referral benefits</p>
                    </div>
                    <div className="text-primary font-bold">Up to 40%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Why Choose SkillRas?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="text-primary" size={20} />
                    <span className="text-gray-300">10,000+ successful students</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="text-primary" size={20} />
                    <span className="text-gray-300">Industry-recognized certificates</span>
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
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Need Help?
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Don't have a code?
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

export default PaymentPage;