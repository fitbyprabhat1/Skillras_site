import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../Button';
import { 
  BookOpen, 
  Play, 
  Lock, 
  Clock, 
  Users, 
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  difficulty_level: string;
  duration_weeks: number;
  total_lessons: number;
  discount_percentage: number;
  trial_description: string;
}

interface TrialChapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  video_id: string | null;
  is_locked: boolean;
  order: number;
}

interface UserAccess {
  course_id: string;
  access_type: 'trial' | 'full' | 'premium';
}

const CoursesDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [trialChapters, setTrialChapters] = useState<TrialChapter[]>([]);
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trial' | 'courses'>('trial');

  useEffect(() => {
    if (profile) {
      fetchCoursesData();
    }
  }, [profile]);

  const fetchCoursesData = async () => {
    try {
      setError(null);
      
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
      }

      // Fetch trial chapters
      const { data: trialData, error: trialError } = await supabase
        .from('trial_chapters')
        .select('*')
        .order('order', { ascending: true });

      if (trialError) {
        console.error('Error fetching trial chapters:', trialError);
      }

      // Fetch user access
      const { data: accessData, error: accessError } = await supabase
        .from('user_course_access')
        .select('course_id, access_type')
        .eq('user_id', profile?.user_id);

      if (accessError) {
        console.error('Error fetching user access:', accessError);
      }

      setCourses(coursesData || []);
      setTrialChapters(trialData || []);
      setUserAccess(accessData || []);

      // Grant trial access if user doesn't have any access yet and courses exist
      if ((!accessData || accessData.length === 0) && coursesData && coursesData.length > 0) {
        await grantTrialAccess(coursesData);
      }
    } catch (error) {
      console.error('Error fetching courses data:', error);
      setError('Failed to load courses data');
    } finally {
      setLoading(false);
    }
  };

  const grantTrialAccess = async (coursesData: Course[]) => {
    try {
      // Grant trial access to all courses
      const trialAccessData = coursesData.map(course => ({
        user_id: profile?.user_id,
        course_id: course.id,
        access_type: 'trial' as const
      }));

      const { error } = await supabase
        .from('user_course_access')
        .insert(trialAccessData);

      if (!error) {
        // Refresh access data
        const { data: accessData } = await supabase
          .from('user_course_access')
          .select('course_id, access_type')
          .eq('user_id', profile?.user_id);
        
        setUserAccess(accessData || []);
      } else {
        console.error('Error granting trial access:', error);
      }
    } catch (error) {
      console.error('Error granting trial access:', error);
    }
  };

  const getUserAccessType = (courseId: string): string => {
    const access = userAccess.find(a => a.course_id === courseId);
    return access?.access_type || 'none';
  };

  const getAccessBadge = (accessType: string) => {
    switch (accessType) {
      case 'trial':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded">Trial Access</span>;
      case 'full':
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">Full Access</span>;
      case 'premium':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded">Premium Access</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded">No Access</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-light rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-light rounded-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Courses</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => fetchCoursesData()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-dark-light rounded-lg p-1">
        <button
          onClick={() => setActiveTab('trial')}
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            activeTab === 'trial'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <Play size={20} className="mr-2" />
            Free Trial Chapters
          </div>
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            activeTab === 'courses'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <BookOpen size={20} className="mr-2" />
            Available Courses
          </div>
        </button>
      </div>

      {/* Trial Chapters Tab */}
      {activeTab === 'trial' && (
        <div className="bg-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Trial Chapters</h3>
              <p className="text-gray-400">
                Get started with these free chapters to experience our teaching style
              </p>
            </div>
            <Link to="/trial">
              <Button size="sm" glowing>
                <Play size={16} className="mr-2" />
                Start Learning
              </Button>
            </Link>
          </div>

          {trialChapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trialChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`bg-dark rounded-lg p-4 border transition-all hover:border-primary/50 ${
                    chapter.is_locked ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        chapter.is_locked 
                          ? 'bg-gray-600' 
                          : 'bg-primary/20'
                      }`}>
                        {chapter.is_locked ? (
                          <Lock size={20} className="text-gray-400" />
                        ) : (
                          <Play size={20} className="text-primary" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        Chapter {chapter.order}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {chapter.duration}
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2 leading-tight">
                    {chapter.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {chapter.is_locked ? (
                      <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                        Premium Content
                      </span>
                    ) : (
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                        Free Access
                      </span>
                    )}
                    
                    {!chapter.is_locked && (
                      <Link to="/trial">
                        <Button size="sm" variant="outline">
                          Watch Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400">No trial chapters available</p>
            </div>
          )}

          <div className="mt-8 bg-gradient-to-r from-primary/10 to-red-600/10 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg mb-2">
                  Ready for the Complete Course?
                </h4>
                <p className="text-gray-300 mb-4">
                  Unlock all {trialChapters.filter(c => c.is_locked).length} premium chapters and get lifetime access to the complete curriculum.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="mr-1 text-green-500" />
                    26 Total Lessons
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={16} className="mr-1 text-green-500" />
                    5 Weeks Content
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={16} className="mr-1 text-green-500" />
                    Lifetime Access
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-2">₹9,999</div>
                <Button glowing>
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-dark-light rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Available Courses</h3>
            <p className="text-gray-400 mb-6">
              Choose from our comprehensive video editing courses designed for all skill levels
            </p>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const accessType = getUserAccessType(course.id);
                  const discountedPrice = course.price - (course.price * (course.discount_percentage || 0) / 100);
                  
                  return (
                    <div
                      key={course.id}
                      className="bg-dark rounded-lg overflow-hidden border border-gray-700 hover:border-primary/50 transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                              <BookOpen className="text-primary" size={24} />
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg leading-tight">
                                {course.title}
                              </h4>
                              <div className="flex items-center mt-1 space-x-2">
                                {getAccessBadge(accessType)}
                                <span className="text-xs text-gray-400">
                                  {course.difficulty_level}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                          <div>
                            <div className="text-white font-bold">{course.duration_weeks}</div>
                            <div className="text-xs text-gray-400">Weeks</div>
                          </div>
                          <div>
                            <div className="text-white font-bold">{course.total_lessons}</div>
                            <div className="text-xs text-gray-400">Lessons</div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              <Star className="text-yellow-500 mr-1" size={14} />
                              <span className="text-white font-bold">4.8</span>
                            </div>
                            <div className="text-xs text-gray-400">Rating</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            {course.discount_percentage && course.discount_percentage > 0 ? (
                              <div>
                                <span className="text-2xl font-bold text-white">₹{discountedPrice}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">₹{course.price}</span>
                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded ml-2">
                                  {course.discount_percentage}% OFF
                                </span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-white">₹{course.price}</span>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            {accessType === 'trial' && (
                              <Link to="/trial">
                                <Button size="sm" variant="outline">
                                  Try Free
                                </Button>
                              </Link>
                            )}
                            <Button size="sm" glowing>
                              {accessType === 'full' || accessType === 'premium' ? 'Continue Learning' : 'Enroll Now'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {course.trial_description && (
                        <div className="bg-dark-lighter p-4 border-t border-gray-700">
                          <p className="text-gray-400 text-sm">
                            <strong>Trial:</strong> {course.trial_description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No courses available</p>
              </div>
            )}
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">2,500+</div>
              <div className="text-gray-400 text-sm">Students Enrolled</div>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-green-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">95%</div>
              <div className="text-gray-400 text-sm">Completion Rate</div>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-yellow-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesDashboard;