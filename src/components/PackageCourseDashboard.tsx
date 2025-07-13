import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserPackage } from '../hooks/useUserPackage';
import { Video, TrendingUp, Palette, Lock, Crown, Star, CheckCircle, Copy, DollarSign } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  level: string;
  requiredPackage: string;
  isAvailable: boolean;
}

interface EarningsData {
  totalUsers: number;
  allTimeEarnings: number;
}

const PackageCourseDashboard: React.FC = () => {
  const { userPackage, getAvailableCourses, hasAccessToPackage } = useUserPackage();
  const { user } = useAuth();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateCode = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('referrer_email', user.email.toLowerCase().trim())
        .eq('code_type', 'affiliate')
        .eq('is_active', true)
        .single();
      if (data && data.code) setAffiliateCode(data.code);
    };
    fetchAffiliateCode();
  }, [user?.email]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!user?.email || !affiliateCode) return;

      try {
        setEarningsLoading(true);
        
        // Get all users who used this referral code (only completed payments for earnings)
        const { data: referredUsers, error: usersError } = await supabase
          .from('paid_users')
          .select('*')
          .eq('referral_code', affiliateCode)
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false });

        if (usersError) {
          console.error('Failed to fetch referred users:', usersError);
          return;
        }

        // Calculate total earnings
        const allTimeEarnings = referredUsers?.reduce((sum, user) => sum + (user.final_price || 0), 0) || 0;

        setEarningsData({
          totalUsers: referredUsers?.length || 0,
          allTimeEarnings
        });
      } catch (err) {
        console.error('Error fetching earnings data:', err);
      } finally {
        setEarningsLoading(false);
      }
    };

    fetchEarningsData();
  }, [user?.email, affiliateCode]);

  const shareUrl = affiliateCode
    ? `${window.location.origin}/enroll?ref=${affiliateCode}`
    : '';

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allCourses: Course[] = [
    {
      id: 'premiere-pro',
      name: 'Premiere Pro Mastery',
      description: 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects',
      icon: <Video size={24} className="text-primary" />,
      duration: '35 hours',
      level: 'Beginner to Advanced',
      requiredPackage: 'starter',
      isAvailable: hasAccessToPackage('starter')
    },
    {
      id: 'after-effects',
      name: 'After Effects Mastery',
      description: 'Create stunning motion graphics and visual effects with Adobe After Effects',
      icon: <TrendingUp size={24} className="text-primary" />,
      duration: '45 hours',
      level: 'Beginner to Expert',
      requiredPackage: 'professional',
      isAvailable: hasAccessToPackage('professional')
    },
    {
      id: 'excel',
      name: 'MS Excel Mastery',
      description: 'Master Microsoft Excel for data analysis, automation, and business intelligence',
      icon: <Palette size={24} className="text-primary" />,
      duration: '40 hours',
      level: 'Beginner to Advanced',
      requiredPackage: 'enterprise',
      isAvailable: hasAccessToPackage('enterprise')
    }
  ];

  const availableCourses = getAvailableCourses();
  const packageNames = {
    'starter': 'Starter',
    'professional': 'Professional',
    'enterprise': 'Enterprise'
  };

  if (!userPackage) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Affiliate Code Section */}
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="text-primary mr-3" size={32} />
            <h1 className="text-4xl font-bold text-white">
              Welcome, {userPackage.name}!
            </h1>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 inline-block">
            <div className="flex items-center space-x-2">
              <Star className="text-primary" size={20} />
              <span className="text-white font-semibold">
                {packageNames[userPackage.package_selected as keyof typeof packageNames]} Package
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-dark-light border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Your Affiliate Code</h2>
            {affiliateCode ? (
              <div className="text-primary font-mono text-xl mb-2">{affiliateCode}</div>
            ) : (
              <div className="text-gray-400">No affiliate code found for your account.</div>
            )}
            <div className="text-gray-300 text-sm">Share this link to invite friends and earn rewards:</div>
            {affiliateCode && (
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full md:w-96 px-3 py-2 rounded-l bg-dark border border-gray-600 text-white text-sm font-mono"
                  style={{ minWidth: '0' }}
                />
                <Button
                  onClick={handleCopy}
                  className="rounded-l-none rounded-r flex items-center px-3 py-2"
                  variant="primary"
                  type="button"
                >
                  <Copy size={16} className="mr-1" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            )}
            {/* Social Media Share Buttons */}
            {affiliateCode && (
              <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 mt-4 w-full">
                {/* WhatsApp Share */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Learn and earn more than lakhs a month. Join skillras.com today! ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto justify-center"
                  style={{ textDecoration: 'none' }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12 12 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.69.97.99-3.59-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
                  Share on WhatsApp
                </a>
                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent('Learn and earn more than lakhs a month. Join skillras.com today!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto justify-center"
                  style={{ textDecoration: 'none' }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  Share on Facebook
                </a>
                {/* Instagram Share (copy to clipboard) */}
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`Learn and earn more than lakhs a month. Join skillras.com today! ${shareUrl}`);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 1500);
                  }}
                  className="flex items-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white px-3 py-2 rounded w-full md:w-auto justify-center"
                  variant="outline"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm6.5 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                  Share on Instagram
                </Button>
                {/* Optionally add more platforms here */}
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/earnings">
              <Button variant="outline" className="flex items-center">
                <TrendingUp size={16} className="mr-2" />
                View Earnings
              </Button>
            </Link>
          </div>
        </div>

        {/* Total Lifetime Earnings Display */}
        {affiliateCode && (
          <div className="mb-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Total Lifetime Earnings</h3>
                  {earningsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-300 text-sm">Loading earnings...</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-green-400">
                      {earningsData ? formatCurrency(earningsData.allTimeEarnings) : '₹0'}
                    </div>
                  )}
                  <p className="text-gray-300 text-sm">
                    {earningsData ? `${earningsData.totalUsers} user${earningsData.totalUsers !== 1 ? 's' : ''} referred` : 'No users referred yet'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-semibold text-sm">Lifetime Total</div>
                <div className="text-gray-400 text-xs">From completed payments</div>
              </div>
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-dark-light rounded-xl p-6 border transition-all duration-300 ${
                course.isAvailable
                  ? 'border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10'
                  : 'border-gray-600 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {course.icon}
                  <div>
                    <h3 className="text-white font-bold text-lg">{course.name}</h3>
                    <p className="text-gray-400 text-sm">{course.level}</p>
                  </div>
                </div>
                {course.isAvailable ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Lock className="text-gray-500" size={20} />
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4">{course.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{course.duration}</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {packageNames[course.requiredPackage as keyof typeof packageNames]}
                </span>
              </div>

              {course.isAvailable ? (
                <Link to={`/course/${course.id}`}>
                  <Button className="w-full" variant="primary">
                    Start Learning
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">
                      Requires {packageNames[course.requiredPackage as keyof typeof packageNames]} Package
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = '/packages'}
                  >
                    Upgrade to Access
                  </Button>
                </div>
              )}
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
      </div>
    </div>
  );
};

export default PackageCourseDashboard; 