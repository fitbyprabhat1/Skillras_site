import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../components/auth/SignUpForm';
import { ArrowLeft } from 'lucide-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark-light border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-white hover:text-primary transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <Link to="/" className="text-white font-bold text-xl">
              SkillRas
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;