import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserPackage } from '../hooks/useUserPackage';
import { Video, TrendingUp, Palette, Lock, Crown, Star, CheckCircle, Copy } from 'lucide-react';
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

const PackageCourseDashboard: React.FC = () => {
  const { userPackage, getAvailableCourses, hasAccessToPackage } = useUserPackage();
  const { user } = useAuth();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleShare = (platform: string) => {
    if (!shareUrl) return;

    const message = `🎓 Check out this amazing course! I'm learning and earning with SkillRas. Join me and get started: ${shareUrl}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent('🎓 Learn and earn with SkillRas!')}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied! You can now paste it in your Instagram story or bio.');
        break;
      default:
        break;
    }
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

        {/* Affiliate Code Section */}
        <div className="mb-8 bg-dark-light border border-primary/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
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

          {/* Social Media Sharing */}
          {affiliateCode && (
            <div className="border-t border-gray-600 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  <Share2 size={16} className="mr-2 text-primary" />
                  Share on Social Media
                </h3>
                <span className="text-gray-400 text-sm">Earn more by sharing!</span>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleShare('whatsapp')}
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30"
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30"
                >
                  <Facebook size={16} className="mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('instagram')}
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-pink-600/20 border-pink-500/30 text-pink-400 hover:bg-pink-600/30"
                >
                  <Instagram size={16} className="mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          )}
        </div>

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