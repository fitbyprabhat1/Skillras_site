import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Settings, BookOpen, Award, TrendingUp, Users } from 'lucide-react';
import AffiliateDashboard from './AffiliateDashboard';
import Button from '../Button';

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalReferrals: number;
  totalEarnings: number;
}

const UserDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalReferrals: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDashboardStats();
    }
  }, [profile]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch user courses
      const { data: courses } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', profile?.user_id);

      // Fetch referral stats from profile
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
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
              <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name}!</h1>
              <p className="text-gray-400">Manage your courses and track your progress</p>
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
                  <h3 className="font-bold">{profile?.full_name}</h3>
                  <p className="text-gray-400 text-sm">{profile?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
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
                  onClick={() => setActiveTab('affiliate')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'affiliate' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-dark-lighter'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  Affiliate Program
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-dark-light rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Courses</p>
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
                      Browse Courses
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

            {activeTab === 'courses' && (
              <div className="bg-dark-light rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">My Courses</h3>
                <div className="text-center py-12">
                  <BookOpen className="mx-auto text-gray-500 mb-4" size={48} />
                  <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
                  <Button>Browse Available Courses</Button>
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
                      value={profile?.full_name || ''}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Referral Code</label>
                    <input
                      type="text"
                      value={profile?.referral_code || ''}
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