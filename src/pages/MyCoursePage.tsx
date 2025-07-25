import React from 'react';
import { Link } from 'react-router-dom';
import { useUserPackage } from '../hooks/useUserPackage';
import { Lock, Crown, Star, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import packageCourses from '../data/packageCourses';
import courses from '../data/courses';
import NavBarWithPackages from '../components/NavBarWithPackages';
import { useEffect, useState } from 'react';

const packageNames = {
  'starter': 'Starter',
  'professional': 'Professional',
  'enterprise': 'Enterprise',
};

// Helper to get the lowest package for a course and its color
const getCoursePackage = (courseId: string): { label: string; color: string } => {
  if (packageCourses['starter'].includes(courseId)) return { label: 'Starter', color: 'bg-red-600' };
  if (packageCourses['professional'].includes(courseId)) return { label: 'Professional', color: 'bg-green-600' };
  if (packageCourses['enterprise'].includes(courseId)) return { label: 'Enterprise', color: 'bg-blue-600' };
  return { label: '', color: '' };
};

// Helper to check if all chapters are completed for a course
const isCourseCompleted = (course: any): boolean => {
  const progressKey = `course_progress_${course.id}`;
  const completedChapters = (() => {
    try {
      const stored = localStorage.getItem(progressKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  const allChapters = course.modules.flatMap((m: any) => m.chapters);
  return allChapters.length > 0 && allChapters.every((ch: any) => completedChapters.includes(ch.id));
};

// Helper to check if any chapter is completed for a course
const isAnyChapterCompleted = (course: any): boolean => {
  const progressKey = `course_progress_${course.id}`;
  const completedChapters = (() => {
    try {
      const stored = localStorage.getItem(progressKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  return completedChapters.length > 0;
};

// Tab labels
const TABS = [
  { key: 'notStarted', label: 'Not Started' },
  { key: 'started', label: 'Enrolled & Started' },
];

const MyCoursePage: React.FC = () => {
  const { userPackage } = useUserPackage();
  const [activeTab, setActiveTab] = useState<'notStarted' | 'started'>('notStarted');

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

  // In the course card, update the image rendering:
  // Use the provided image URL for all course thumbnails for now.

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#18181b] to-red-500/30 bg-no-repeat bg-left-bottom">
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

        {/* Tabbed Course View */}
        <div className="mb-12 mx-2 sm:mx-0">
          <div className="flex justify-center mb-6 gap-4">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`px-6 py-2 rounded-full font-semibold transition-all border-2 focus:outline-none ${
                  activeTab === tab.key
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-dark-light text-gray-300 border-gray-600 hover:bg-primary/10'
                }`}
                onClick={() => setActiveTab(tab.key as 'notStarted' | 'started')}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'notStarted' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 text-center">Not Started / Not Completed Any Chapter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.filter(course => !isAnyChapterCompleted(course)).map(course => {
                  const pkg = getCoursePackage(course.id);
                  const completed = isCourseCompleted(course);
                  return (
                    <Link
                      to={`/course-info/${course.id}`}
                      key={course.id}
                      className="group transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    >
                      <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden rounded-xl relative">
                        <img src={course.thumbnail} alt={course.name} className={`w-full h-full object-cover${completed ? ' grayscale' : ''}`} />
                        <span className={`absolute top-3 right-3 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10 ${pkg.color}`}>
                          {pkg.label}
                        </span>
                        {completed && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <span className="bg-black/70 text-white text-base font-bold px-4 py-2 rounded-lg">Completed</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white text-left mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-400 text-left">By {course.author}</p>
                      </div>
                    </Link>
                  );
                })}
                {availableCourses.filter(course => !isAnyChapterCompleted(course)).length === 0 && (
                  <div className="text-gray-400 text-center">No courses in this category.</div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'started' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 text-center">Enrolled & Started Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.filter(course => isAnyChapterCompleted(course)).map(course => {
                  const pkg = getCoursePackage(course.id);
                  const completed = isCourseCompleted(course);
                  const allChapters = course.modules.flatMap((m: any) => m.chapters);
                  const progressKey = `course_progress_${course.id}`;
                  let completedChapters: string[] = [];
                  try {
                    const stored = localStorage.getItem(progressKey);
                    completedChapters = stored ? JSON.parse(stored) : [];
                  } catch {
                    completedChapters = [];
                  }
                  const percentComplete = allChapters.length > 0 ? Math.round((completedChapters.length / allChapters.length) * 100) : 0;
                  return (
                    <Link
                      to={`/course/${course.id}`}
                      key={course.id}
                      className="group transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    >
                      <div className="w-full aspect-[16/9] bg-gray-200 overflow-hidden rounded-xl relative">
                        <img src={course.thumbnail} alt={course.name} className={`w-full h-full object-cover${completed ? ' grayscale' : ''}`} />
                        {/* Progress badge */}
                        <span className="absolute bottom-3 left-3 bg-primary/90 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10">
                          {percentComplete}%
                        </span>
                        <span className={`absolute top-3 right-3 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10 ${pkg.color}`}>
                          {pkg.label}
                        </span>
                        {completed && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <span className="bg-black/70 text-white text-base font-bold px-4 py-2 rounded-lg">Completed</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white text-left mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-400 text-left">By {course.author}</p>
                      </div>
                    </Link>
                  );
                })}
                {availableCourses.filter(course => isAnyChapterCompleted(course)).length === 0 && (
                  <div className="text-gray-400 text-center">No courses in this category.</div>
                )}
              </div>
            </div>
          )}
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