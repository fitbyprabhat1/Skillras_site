import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Settings, BookOpen, Award, TrendingUp, Users, AlertCircle } from 'lucide-react';
import AffiliateDashboard from './AffiliateDashboard';
import CoursesDashboard from './CoursesDashboard';
import Button from '../Button';

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalReferrals: number;
  totalEarnings: number;
}

const UserDashboard: React.FC = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('courses'); // Default to courses tab
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalReferrals: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && profile) {
      fetchDashboardStats();
    } else if (!authLoading && !user) {
      setError('User not authenticated');
      setLoading(false);
    } else if (!authLoading && user && !profile) {
      setError('User profile not found');
      setLoading(false);
    }
  }, [user, profile, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      
      // Fetch user courses with error handling
      const { data: courses, error: coursesError } = await supabase
        .from('user_course_access')
        .select('*')
        .eq('user_id', profile?.user_id);

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        // Don't throw error, just log it and continue with default values
      }

      // Use profile data for referral stats
      const totalReferrals = profile?.total_referrals || 0;
      const totalEarnings = profile?.total_earnings || 0;

      setStats({
        totalCourses: courses?.length || 0,
        completedCourses: 0, // TODO: Calculate based on progress
        totalReferrals,
        totalEarnings,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading spinner while auth is loading or dashboard is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Page
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no user or profile
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <User className="text-gray-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-300 mb-6">
            We couldn't load your profile information. Please try signing in again.
          </p>
          <Button onClick={handleSignOut} className="w-full">
            Sign Out & Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="bg-dark-light border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile.full_name}!</h1>
              <p className="text-gray-400">Ready to continue your video editing journey?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{profile.full_name}</h3>
                  <p className="text-gray-400 text-sm">{profile.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'courses' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-dark-lighter'
                  }`}
                >
                  <BookOpen size={20} className="mr-3" />
                  My Courses
                </button>
                
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-dark-lighter'
                  }`}
                >
                  <TrendingUp size={20} className="mr-3" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('affiliate')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'affiliate' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-dark-lighter'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  Referral Program
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-dark-lighter'
                  }`}
                >
                  <Settings size={20} className="mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'courses' && <CoursesDashboard />}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-dark-light rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Course Access</p>
                        <p className="text-2xl font-bold">{stats.totalCourses}</p>
                      </div>
                      <BookOpen className="text-primary" size={32} />
                    </div>
                  </div>
                  
                  <div className="bg-dark-light rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Completed</p>
                        <p className="text-2xl font-bold">{stats.completedCourses}</p>
                      </div>
                      <Award className="text-green-500" size={32} />
                    </div>
                  </div>
                  
                  <div className="bg-dark-light rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Referrals</p>
                        <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                      </div>
                      <Users className="text-blue-500" size={32} />
                    </div>
                  </div>
                  
                  <div className="bg-dark-light rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Earnings</p>
                        <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
                      </div>
                      <TrendingUp className="text-yellow-500" size={32} />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-dark-light rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setActiveTab('courses')}
                      variant="outline" 
                      className="justify-start"
                    >
                      <BookOpen size={20} className="mr-2" />
                      Continue Learning
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('affiliate')}
                      variant="outline" 
                      className="justify-start"
                    >
                      <Users size={20} className="mr-2" />
                      Share & Earn
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'affiliate' && (
              <AffiliateDashboard />
            )}

            {activeTab === 'settings' && (
              <div className="bg-dark-light rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.full_name || ''}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Referral Code</label>
                    <input
                      type="text"
                      value={profile.referral_code || ''}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none font-mono"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;