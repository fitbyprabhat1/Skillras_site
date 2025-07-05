import React from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import ProductDownloadForm from '../components/ProductDownloadForm';
import { Download, Shield, Clock, CheckCircle } from 'lucide-react';

const DownloadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Product <span className="text-primary">Downloads</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access Downloads instantly. Enter your details and product code to get your download link.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Shield className="text-primary" size={20} />
                <span>Secure Downloads</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Clock className="text-primary" size={20} />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <CheckCircle className="text-primary" size={20} />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <ProductDownloadForm />
            </div>
            
            <div className="space-y-8">
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Download className="mr-3 text-primary" size={28} />
                  How It Works
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enter Your Details</h3>
                      <p className="text-gray-300 text-sm">Fill in your name, email, and 10-digit phone number</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Enter Product Code</h3>
                      <p className="text-gray-300 text-sm">Input the unique code you received after purchase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Download Instantly</h3>
                      <p className="text-gray-300 text-sm">Get immediate access to your product download</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div className="bg-dark-light rounded-xl p-8 border border-primary/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Need Help?
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Can't Find Your Code?
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Check your email for the product code sent after purchase. Look for emails from SkillRas with your order confirmation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Download Issues?
                    </h3>
                    <p className="text-gray-300 mb-4">
                      If you're having trouble downloading, try using a different browser or disable ad blockers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Contact Support
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Our support team is here to help with any download issues.
                    </p>
                    <div className="flex flex-col space-y-2">
                      <a 
                        href="mailto:admin@skillras.com" 
                        className="text-primary hover:text-primary-light transition-colors flex items-center"
                      >
                        <span>📧 admin@skillras.com</span>
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

export default DownloadPage;