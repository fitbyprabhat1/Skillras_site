import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import { Gift, Users, Star, CheckCircle, TrendingUp } from 'lucide-react';

interface ReferrerInfo {
  full_name: string;
  referral_code: string;
  total_referrals: number;
}

const ReferralLandingPage: React.FC = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const navigate = useNavigate();
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referralCode) {
      fetchReferrerInfo();
      trackReferralClick();
    }
  }, [referralCode]);

  const fetchReferrerInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, referral_code, total_referrals')
        .eq('referral_code', referralCode?.toUpperCase())
        .single();

      if (error) {
        setError('Invalid referral code');
        return;
      }

      setReferrerInfo(data);
    } catch (err) {
      setError('Failed to load referral information');
    } finally {
      setLoading(false);
    }
  };

  const trackReferralClick = async () => {
    try {
      // Track the referral click (you can implement this in your analytics)
      console.log('Referral click tracked for:', referralCode);
    } catch (error) {
      console.error('Error tracking referral click:', error);
    }
  };

  const handleSignUp = () => {
    navigate(`/signup?ref=${referralCode}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !referrerInfo) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <Gift className="mx-auto text-gray-500 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-white mb-4">Invalid Referral Link</h1>
            <p className="text-gray-400 mb-8">
              This referral link is not valid or has expired. You can still join SkillRas directly!
            </p>
            <Button onClick={() => navigate('/signup')} glowing>
              Join SkillRas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
              <Gift className="text-primary" size={40} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              You've Been Invited to Join <span className="text-primary">SkillRas</span>
            </h1>
            
            <div className="bg-dark-light rounded-lg p-6 mb-8 border border-primary/20">
              <p className="text-xl text-gray-300 mb-4">
                <strong className="text-primary">{referrerInfo.full_name}</strong> has invited you to join SkillRas
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-primary" />
                  {referrerInfo.total_referrals} successful referrals
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-2 text-yellow-500" />
                  Trusted member
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master Adobe Premiere Pro with step-by-step guidance and real-world projects. 
              Join thousands of students who have transformed their video editing skills.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Special Welcome Bonus</h3>
              <p className="text-gray-400 text-sm">
                Get exclusive access to bonus materials when you join through this referral
              </p>
            </div>

            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join a Community</h3>
              <p className="text-gray-400 text-sm">
                Connect with {referrerInfo.full_name} and other successful video editors
              </p>
            </div>

            <div className="bg-dark-light rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Proven Results</h3>
              <p className="text-gray-400 text-sm">
                Learn from a course that has helped thousands launch their editing careers
              </p>
            </div>
          </div>

          {/* Course Highlights */}
          <div className="bg-dark-light rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Master Premiere Pro interface and tools</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Create professional videos for social media</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Advanced color grading and audio editing</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Build a portfolio that gets you hired</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Find clients and price your services</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-300">Launch your freelance editing career</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-red-600 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Video Editing Journey?
              </h2>
              <p className="text-white text-lg mb-6 opacity-90">
                Join {referrerInfo.full_name} and thousands of other successful video editors
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={handleSignUp}
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                >
                  Join SkillRas Now
                </Button>
                <p className="text-white text-sm opacity-75">
                  Referral code: <strong>{referrerInfo.referral_code}</strong> (automatically applied)
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              30-day money-back guarantee • Lifetime access • Start learning immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLandingPage;