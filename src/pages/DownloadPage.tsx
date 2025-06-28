import React from 'react';
import NavBar from '../components/NavBar';
import ProductDownloadForm from '../components/ProductDownloadForm';

const DownloadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Product <span className="text-primary">Downloads</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access your purchased products by entering your details and product code below.
            </p>
          </div>
          
          <ProductDownloadForm />
          
          <div className="mt-12 bg-dark-light rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Need Help?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-3">
                  Can't Find Your Code?
                </h3>
                <p className="text-gray-300 mb-4">
                  Check your email for the product code sent after purchase. It should be in the subject line or body of your confirmation email.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-3">
                  Need Support?
                </h3>
                <p className="text-gray-300 mb-4">
                  Contact our support team if you're having trouble accessing your download.
                </p>
                <a 
                  href="mailto:admin@skillras.com" 
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  admin@skillras.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;