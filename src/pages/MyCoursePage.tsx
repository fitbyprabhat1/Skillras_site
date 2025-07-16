import React from 'react';
import { Link } from 'react-router-dom';
import { useUserPackage } from '../hooks/useUserPackage';
import { Lock, Crown, Star, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import packageCourses from '../data/packageCourses';
import courses from '../data/courses';
import NavBarWithPackages from '../components/NavBarWithPackages';

const packageNames = {
  'starter': 'Starter',
  'professional': 'Professional',
  'enterprise': 'Enterprise',
};

const MyCoursePage: React.FC = () => {
  const { userPackage } = useUserPackage();

  if (!userPackage) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <NavBarWithPackages />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-red-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Required</h2>
            <p className="text-gray-300 mb-6">
              You need to complete your enrollment and payment to access your courses.
            </p>
            <Button onClick={() => window.location.href = '/enroll'}>
              Complete Enrollment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get course ids for the user's package
  const availableCourseIds = packageCourses[userPackage.package_selected] || [];
  // Get course data for those ids
  const availableCourses = availableCourseIds.map((id) => courses[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <NavBarWithPackages />
      <div className="container mx-auto px-2 sm:px-4 py-8 flex-1 mt-16 sm:mt-20">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <Crown className="text-primary mr-2 md:mr-3" size={24} />
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Welcome, {userPackage.name}!
            </h1>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 md:p-4 inline-block">
            <div className="flex items-center space-x-2">
              <Star className="text-primary" size={16} />
              <span className="text-white font-semibold text-sm md:text-base">
                {packageNames[userPackage.package_selected as keyof typeof packageNames]} Package
              </span>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableCourses.map(course => (
            <div
              key={course.id}
              className={
                'bg-dark-light rounded-xl p-6 border border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 flex flex-col items-center'
              }
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-pink-400 flex items-center justify-center mb-4 shadow-md overflow-hidden">
                <img src={course.thumbnail} alt={course.name} className="w-20 h-20 object-cover rounded-xl" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 text-center drop-shadow">{course.name}</h3>
              <p className="text-gray-300 text-sm mb-4 text-center">{course.description}</p>
              <Link to={`/course/${course.id}`} className="w-full">
                <Button className="w-full" variant="primary">
                  Start Learning
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Package Benefits */}
        <div className="bg-dark-light rounded-xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Your {packageNames[userPackage.package_selected as keyof typeof packageNames]} Package Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-primary" size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Course Access</h3>
                <p className="text-gray-300 text-sm">
                  Access to {availableCourses.length} course{availableCourses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="text-primary" size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Lifetime Access</h3>
                <p className="text-gray-300 text-sm">
                  Learn at your own pace with lifetime access
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="text-primary" size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Certificate</h3>
                <p className="text-gray-300 text-sm">
                  Get certified upon course completion
                </p>
              </div>
            </div>
          </div>
          {userPackage.package_selected !== 'enterprise' && (
            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">
                Want access to more courses? Upgrade your package!
              </p>
              <Button 
                onClick={() => window.location.href = '/packages'}
                variant="primary"
              >
                View All Packages
              </Button>
            </div>
          )}
        </div>

        {/* Dashboard Button */}
        <div className="flex justify-center mt-10">
          <Link to="/dashboard">
            <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold shadow-md bg-white/20 text-white hover:bg-white/40 transition-all">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCoursePage; 