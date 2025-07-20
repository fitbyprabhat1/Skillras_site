import React, { useState, useEffect } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import Button from '../components/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPackage } from '../hooks/useUserPackage';
import { checkCourseAccess, getRequiredPackageForCourse } from '../utils/courseAccess';
import { useSEO } from '../hooks/useSEO';
import courses from '../data/courses';
import FooterSection from '../sections/FooterSection';
import { useInView } from '../hooks/useInView';

const Broucherpage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? courses[courseId] : undefined;
  const { user } = useAuth();
  const { userPackage, loading: userPackageLoading } = useUserPackage();
  
  // SEO for course brochure page
  useSEO({
    title: course ? `${course.name} - Course Details & Curriculum | SkillRas` : 'Course Details | SkillRas',
    description: course ? (course.description || `Learn ${course.name} with our comprehensive online course. Master the skills you need to succeed in your career.`) : 'Course details and curriculum information.',
    keywords: course ? `${course.name.toLowerCase()}, course details, curriculum, ${course.author}, online course, skill development, ${course.category?.toLowerCase()}, ${course.author.toLowerCase()}` : 'course details, curriculum, online course, skill development',
    canonical: `https://skillras.com/course-info/${courseId}`,
    ogImage: course?.thumbnail
  });

  const handleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Check if user has access to this course
  const hasAccessToCourse = (): boolean => {
    if (!user || !userPackage || !courseId) return false;
    
    const accessInfo = checkCourseAccess(courseId, userPackage);
    console.log('Access check:', {
      user: !!user,
      userPackage: userPackage?.package_selected,
      courseId,
      accessInfo,
      hasAccess: accessInfo.hasAccess
    });
    return accessInfo.hasAccess;
  };

  // Mark first chapter as complete
  const markFirstChapterComplete = () => {
    if (!course || !courseId) return;
    
    const firstChapter = course.modules[0]?.chapters[0];
    if (firstChapter) {
      const progressKey = `course_progress_${courseId}`;
      const existingProgress = localStorage.getItem(progressKey);
      const completedChapters = existingProgress ? JSON.parse(existingProgress) : [];
      
      if (!completedChapters.includes(firstChapter.id)) {
        completedChapters.push(firstChapter.id);
        localStorage.setItem(progressKey, JSON.stringify(completedChapters));
        console.log('First chapter marked as complete:', firstChapter.id);
      }
    }
  };

  const handleEnrollClick = () => {
    console.log('Enroll button clicked:', {
      user: !!user,
      courseId,
      hasAccess: hasAccessToCourse()
    });
    
    if (!user) {
      console.log('No user, navigating to login');
      navigate('/login');
    } else if (hasAccessToCourse()) {
      // User has access, redirect to course player
      console.log('User has access, navigating to course player');
      markFirstChapterComplete();
      navigate(`/course/${courseId}`);
    } else {
      // User doesn't have access, redirect to enrollment
      console.log('User no access, navigating to enrollment');
      navigate(`/enroll?course=${courseId}`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <NavBarWithPackages />
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="text-gray-400 mt-2">Course ID: {courseId}</p>
      </div>
    );
  }

  // Show loading state while checking user package
  if (userPackageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <NavBarWithPackages />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking your access...</p>
        </div>
      </div>
    );
  }

  const hasAccess = hasAccessToCourse();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col mt-10">
      <NavBarWithPackages />
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center pt-10 pb-6 bg-gradient-to-b from-[#18181b] to-[#0a0a0a]">
        <img
          src={course.thumbnail}
          alt={course.name + ' Logo'}
          className="w-full max-w-5xl rounded-xl shadow-xl"
        />
        {/* Course Title and Enroll Button */}
        <div className="w-full max-w-5xl flex flex-col items-center mt-4 mb-6">
          <h2 className="text-3xl font-bold text-white mb-3 text-center">{course.name}</h2>
          {/* Coming Soon Badge */}
          {course.comingSoon && (
            <span className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🚧 Coming Soon
            </span>
          )}
          {/* Access Status Badge */}
          {isLoggedIn && !course.comingSoon && (
            <div className="mb-4">
              {hasAccess ? (
                <span className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                  ✓ You have access to this course
                </span>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
                    ⚠ Upgrade your package to access this course
                  </span>
                  {userPackage && (
                    <span className="text-gray-400 text-xs">
                      Your current package: {userPackage.package_selected}
                      {getRequiredPackageForCourse(courseId || '') && (
                        <span className="ml-2">
                          • Required: {getRequiredPackageForCourse(courseId || '')}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Enroll Button or Coming Soon */}
          {!course.comingSoon && (
            <Button
              variant="primary"
              className="px-8 py-2 text-lg font-semibold rounded-full shadow-md"
              onClick={handleEnrollClick}
            >
              {!isLoggedIn ? 'Login to Access' : hasAccess ? 'Enroll in this Course' : 'Buy Package to get access to this Course'}
            </Button>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {/* Summary */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Summary</h4>
          <div className="text-gray-300 space-y-4">
            <p>{course.description}</p>
            {course.courseQuote && (
              <blockquote className="border-l-4 border-primary pl-4 text-primary italic">
                {course.courseQuote}
              </blockquote>
            )}
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* Skills */}
        {course.skills && (
          <section className="mb-10">
            <h4 className="text-xl font-bold text-white mb-4">Skills</h4>
            <div className="flex flex-wrap gap-3">
              {course.skills.map(skill => (
                <span key={skill} className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
        <div className="border-t border-gray-700 my-8" />
        {/* Curriculum (Accordion) */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Curriculum</h4>
          <div className="space-y-3">
            {course.modules.map((mod, idx) => (
              <div key={mod.title} className="border border-gray-700 rounded-lg overflow-hidden bg-[#18181b]">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none hover:bg-primary/10 transition"
                  onClick={() => handleAccordion(idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-semibold text-white">{mod.title}</span>
                  <svg
                    className={`w-5 h-5 text-primary transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === idx && (
                  <div className="px-5 pb-4 text-gray-300 animate-fade-in">
                    <div className="mb-2 font-semibold">{mod.description}</div>
                    <ul className="list-disc ml-5">
                      {mod.chapters.map((chapter) => (
                        <li key={chapter.id} className="mb-1">
                          <span className="text-white font-medium">{chapter.title}</span>
                          <span className="ml-2 text-xs text-gray-400">({chapter.duration})</span>
                          <div className="text-gray-400 text-sm">{chapter.description}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* Instructor */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Instructor</h4>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {course.instructorImage && (
              <img
                src={course.instructorImage}
                alt={course.author}
                className="w-40 h-40 object-cover rounded-xl shadow-lg mb-4 md:mb-0"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{course.author}</h3>
              <p className="text-gray-300 mb-2">{course.instructorBio}</p>
            </div>
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* Related Courses Section */}
        <section className="mb-10 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-white mb-4">Related Courses</h4>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore courses related to {course.categories ? course.categories.join(', ').toLowerCase() : course.category.toLowerCase()} to expand your skills
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(courses)
                .filter(courseItem => {
                  // Get all categories for the current course
                  const currentCourseCategories = course.categories || [course.category];
                  // Get all categories for the course item
                  const itemCategories = courseItem.categories || [courseItem.category];
                  // Check if there's any overlap between categories
                  const hasMatchingCategory = currentCourseCategories.some(cat => 
                    itemCategories.includes(cat)
                  );
                  return hasMatchingCategory && courseItem.id !== course.id;
                })
                .map((courseItem, index) => (
                  <div
                    key={courseItem.id}
                    className={`transform transition-all duration-700 delay-${index * 100} animate-fadeIn`}
                  >
                      <Link 
                        to={`/course-info/${courseItem.id}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group block bg-gradient-to-br from-[#18181b] to-[#0a0a0a] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-700/50 hover:border-primary/30"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={courseItem.thumbnail}
                            alt={courseItem.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {courseItem.category}
                          </div>
                          {courseItem.categories && courseItem.categories.length > 1 && (
                            <div className="absolute top-3 left-3 bg-gray-800/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                              +{courseItem.categories.length - 1} more
                            </div>
                          )}
                          {/* Coming Soon Badge for Related Courses */}
                          {courseItem.comingSoon && (
                            <div className="absolute bottom-3 left-3 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              Coming Soon
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h5 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                            {courseItem.name}
                          </h5>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {courseItem.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary text-sm font-semibold">
                              By {courseItem.author}
                            </span>
                            <span className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
                              {courseItem.modules.length} modules
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
            </div>
          </div>
        </section>
        {/* Dashboard Button */}
        <div className="flex justify-center mt-10">
          <Link to="/dashboard">
            <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold shadow-md bg-white/20 text-white hover:bg-white/40 transition-all">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Broucherpage; 