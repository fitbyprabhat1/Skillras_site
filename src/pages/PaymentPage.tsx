import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import PaymentForm from '../components/PaymentForm';
import { ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  difficulty_level: string;
  duration_weeks: number;
  total_lessons: number;
}

const PaymentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const packageType = searchParams.get('package') as 'single_course' | 'package' || 'single_course';
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to success page or course access page
    console.log('Payment successful!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="animate-spin text-primary mx-auto mb-4" size={48} />
              <p className="text-white text-lg">Loading course details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error || 'Course not found'}</p>
              <Link to="/courses" className="inline-block mt-4 text-primary hover:text-primary-light">
                ← Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/courses" 
            className="inline-flex items-center text-primary hover:text-primary-light transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Enroll in <span className="text-primary">{course.title}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete your enrollment to get lifetime access to this comprehensive course
          </p>
        </div>

        {/* Course Summary */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-dark-light rounded-xl p-8 border border-primary/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">{course.title}</h2>
                <p className="text-gray-300 mb-6">{course.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <span className="w-24 text-sm">Level:</span>
                    <span className="font-medium">{course.difficulty_level}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-24 text-sm">Duration:</span>
                    <span className="font-medium">{course.duration_weeks} weeks</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-24 text-sm">Lessons:</span>
                    <span className="font-medium">{course.total_lessons} lessons</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₹{course.price.toLocaleString()}
                  </div>
                  <div className="text-gray-400">One-time payment</div>
                  <div className="text-sm text-green-400 mt-2">
                    ✓ Lifetime Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <PaymentForm
          courseId={course.id}
          courseName={course.title}
          originalPrice={course.price}
          packageType={packageType}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Security Notice */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-dark-light rounded-lg p-6 border border-gray-600">
            <h3 className="text-white font-bold mb-3">🔒 Secure Payment</h3>
            <p className="text-gray-300 text-sm">
              Your payment information is processed securely through Razorpay. 
              We never store your payment details on our servers.
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4 text-xs text-gray-400">
              <span>SSL Encrypted</span>
              <span>•</span>
              <span>PCI Compliant</span>
              <span>•</span>
              <span>Bank Grade Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;