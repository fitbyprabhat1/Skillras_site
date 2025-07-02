import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PaymentForm from '../components/PaymentForm';
import { ArrowLeft, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Course data - in a real app, this would come from your database
const courseData = {
  'premiere-pro': {
    name: 'Premiere Pro Mastery',
    price: 4999,
    originalPrice: 9999,
    description: 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects'
  },
  'digital-marketing': {
    name: 'Digital Marketing Mastery',
    price: 6999,
    originalPrice: 12999,
    description: 'Learn comprehensive digital marketing strategies'
  },
  'graphic-design': {
    name: 'Graphic Design Pro',
    price: 5499,
    originalPrice: 10999,
    description: 'Master Photoshop, Illustrator, and design principles'
  },
  'starter-package': {
    name: 'Starter Package',
    price: 7999,
    originalPrice: 15999,
    description: 'Perfect for beginners starting their digital journey'
  },
  'professional-package': {
    name: 'Professional Package',
    price: 14999,
    originalPrice: 29999,
    description: 'Most popular choice for career advancement'
  },
  'enterprise-package': {
    name: 'Enterprise Package',
    price: 24999,
    originalPrice: 49999,
    description: 'Complete skill transformation for professionals'
  }
};

const PaymentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  if (!courseId || !courseData[courseId as keyof typeof courseData]) {
    return <Navigate to="/courses" replace />;
  }

  const course = courseData[courseId as keyof typeof courseData];
  const isPackage = courseId.includes('package');

  const handlePaymentSuccess = () => {
    // Handle successful payment - could redirect to course access page
    console.log('Payment successful for:', courseId);
  };

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            to={isPackage ? "/packages" : "/courses"} 
            className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to {isPackage ? 'Packages' : 'Courses'}
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Secure <span className="text-primary">Checkout</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete your enrollment for {course.name} with our secure payment system
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Shield className="text-primary" size={24} />
            <span className="font-medium">Bank-Level Security</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <CreditCard className="text-primary" size={24} />
            <span className="font-medium">Multiple Payment Options</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <CheckCircle className="text-primary" size={24} />
            <span className="font-medium">Instant Access</span>
          </div>
        </div>

        {/* Payment Form */}
        <PaymentForm
          courseId={courseId}
          courseName={course.name}
          originalPrice={course.price}
          packageType={isPackage ? 'package' : 'single_course'}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-dark-light rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Why Choose SkillRas?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-primary" size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Secure Payments</h4>
                <p className="text-gray-300 text-sm">
                  Your payment information is encrypted and processed securely through Razorpay
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-primary" size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Instant Access</h4>
                <p className="text-gray-300 text-sm">
                  Get immediate access to your course content after successful payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="text-primary" size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Money-Back Guarantee</h4>
                <p className="text-gray-300 text-sm">
                  30-day money-back guarantee if you're not satisfied with the course
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;