import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../Button';
import { 
  Copy, 
  Share2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Gift,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Target
} from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  pendingEarnings: number;
  totalClicks: number;
  thisMonthReferrals: number;
}

interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  usage_count: number;
  max_usage: number | null;
  active: boolean;
  expires_at: string | null;
}

interface ReferralActivity {
  id: string;
  referred_user_name: string;
  referred_user_email: string;
  signup_date: string;
  purchase_amount: number | null;
  commission_earned: number;
  status: 'pending' | 'confirmed' | 'paid';
}

const AffiliateDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    conversionRate: 0,
    pendingEarnings: 0,
    totalClicks: 0,
    thisMonthReferrals: 0,
  });
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [referralActivity, setReferralActivity] = useState<ReferralActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'codes' | 'activity'>('overview');

  useEffect(() => {
    if (profile) {
      fetchAffiliateData();
    }
  }, [profile]);

  const fetchAffiliateData = async () => {
    try {
      // Fetch referral stats
      const { data: purchases } = await supabase
        .from('course_purchases')
        .select('*')
        .eq('referrer_id', profile?.user_id);

      // Fetch discount codes
      const { data: codes } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('user_id', profile?.user_id);

      // Fetch referral activity
      const { data: activity } = await supabase
        .from('user_profiles')
        .select('full_name, email, created_at')
        .eq('referred_by', profile?.user_id)
        .order('created_at', { ascending: false });

      // Calculate stats
      const totalReferrals = purchases?.length || 0;
      const totalEarnings = profile?.total_earnings || 0;
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth());
      const thisMonthReferrals = activity?.filter(a => 
        new Date(a.created_at) >= thisMonth
      ).length || 0;

      setStats({
        totalReferrals,
        totalEarnings,
        conversionRate: totalReferrals > 0 ? (totalReferrals / 100) * 100 : 0,
        pendingEarnings: 0,
        totalClicks: totalReferrals * 3, // Estimated
        thisMonthReferrals,
      });

      setDiscountCodes(codes || []);
      
      // Transform activity data
      const transformedActivity: ReferralActivity[] = activity?.map(a => ({
        id: a.email,
        referred_user_name: a.full_name,
        referred_user_email: a.email,
        signup_date: a.created_at,
        purchase_amount: null,
        commission_earned: 0,
        status: 'pending' as const
      })) || [];

      setReferralActivity(transformedActivity);
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${profile?.referral_code}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const createDiscountCode = async () => {
    if (!profile) return;

    try {
      const newCode = `SAVE${profile.referral_code}`;
      
      const { data, error } = await supabase
        .from('discount_codes')
        .insert([
          {
            code: newCode,
            user_id: profile.user_id,
            discount_percent: 10,
            max_usage: 100,
            active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setDiscountCodes(prev => [...prev, data]);
    } catch (error) {
      console.error('Error creating discount code:', error);
    }
  };

  const shareReferralLink = async () => {
    const referralLink = generateReferralLink();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join SkillRas and Learn Video Editing',
          text: 'Check out this amazing video editing course!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-light rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-dark-light rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <TrendingUp size={20} className="mr-2" />
            Overview
          </div>
        </button>
        <button
          onClick={() => setActiveTab('codes')}
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            activeTab === 'codes'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <Gift size={20} className="mr-2" />
            Discount Codes
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            activeTab === 'activity'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <Users size={20} className="mr-2" />
            Activity
          </div>
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-light rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                  <p className="text-green-500 text-xs mt-1">+{stats.thisMonthReferrals} this month</p>
                </div>
                <Users className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
                  <p className="text-gray-500 text-xs mt-1">10% commission rate</p>
                </div>
                <DollarSign className="text-green-500" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Link Clicks</p>
                  <p className="text-2xl font-bold">{stats.totalClicks}</p>
                  <p className="text-gray-500 text-xs mt-1">Estimated clicks</p>
                </div>
                <Eye className="text-yellow-500" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-light rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                  <p className="text-gray-500 text-xs mt-1">Clicks to signups</p>
                </div>
                <Target className="text-orange-500" size={32} />
              </div>
            </div>
          </div>

          {/* Referral Tools */}
          <div className="bg-dark-light rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Share2 className="mr-2 text-primary" />
              Referral Tools
            </h3>
            
            <div className="space-y-6">
              {/* Referral Link */}
              <div>
                <label className="block text-white mb-2 font-medium">Your Referral Link</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generateReferralLink()}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generateReferralLink(), 'link')}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copySuccess === 'link' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                  <Button
                    onClick={shareReferralLink}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Share this link to earn 10% commission on every successful referral
                </p>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-white mb-2 font-medium">Your Referral Code</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={profile?.referral_code || ''}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none font-mono text-lg font-bold"
                  />
                  <Button
                    onClick={() => copyToClipboard(profile?.referral_code || '', 'code')}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copySuccess === 'code' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Others can enter this code during signup to be linked as your referral
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-dark-light rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">How Affiliate Program Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="text-primary" size={24} />
                </div>
                <h4 className="font-bold mb-2">1. Share Your Link</h4>
                <p className="text-gray-400 text-sm">
                  Share your unique referral link or code with friends and followers
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-primary" size={24} />
                </div>
                <h4 className="font-bold mb-2">2. They Sign Up</h4>
                <p className="text-gray-400 text-sm">
                  When someone uses your link to sign up and purchase a course
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="text-primary" size={24} />
                </div>
                <h4 className="font-bold mb-2">3. Earn Commission</h4>
                <p className="text-gray-400 text-sm">
                  You earn 10% commission on every successful referral purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discount Codes Tab */}
      {activeTab === 'codes' && (
        <div className="bg-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Gift className="mr-2 text-primary" />
              Discount Codes
            </h3>
            {discountCodes.length === 0 && (
              <Button onClick={createDiscountCode} size="sm">
                Create Code
              </Button>
            )}
          </div>

          {discountCodes.length > 0 ? (
            <div className="space-y-4">
              {discountCodes.map((code) => (
                <div key={code.id} className="bg-dark rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/20 rounded-lg p-3">
                        <Gift className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg font-mono">{code.code}</h4>
                        <p className="text-gray-400 text-sm">
                          {code.discount_percent}% discount • Used {code.usage_count} times
                          {code.max_usage && ` of ${code.max_usage}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => copyToClipboard(code.code, `discount-${code.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        {copySuccess === `discount-${code.id}` ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                      <div className={`px-2 py-1 rounded text-xs ${
                        code.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {code.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400 mb-4">No discount codes created yet</p>
              <p className="text-gray-500 text-sm">
                Create discount codes to give your referrals special offers
              </p>
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-dark-light rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Users className="mr-2 text-primary" />
            Referral Activity
          </h3>

          {referralActivity.length > 0 ? (
            <div className="space-y-4">
              {referralActivity.map((activity) => (
                <div key={activity.id} className="bg-dark rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="text-primary" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{activity.referred_user_name}</h4>
                        <p className="text-gray-400 text-sm">{activity.referred_user_email}</p>
                        <p className="text-gray-500 text-xs">
                          Joined {new Date(activity.signup_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs ${
                        activity.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : activity.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </div>
                      {activity.commission_earned > 0 && (
                        <p className="text-green-500 text-sm font-medium mt-1">
                          +₹{activity.commission_earned}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400 mb-4">No referral activity yet</p>
              <p className="text-gray-500 text-sm">
                Start sharing your referral link to see activity here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;