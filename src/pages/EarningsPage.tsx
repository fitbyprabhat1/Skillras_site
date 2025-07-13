import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import NavBarWithPackages from '../components/NavBarWithPackages';
import { TrendingUp, Users, DollarSign, Calendar, Package, MapPin, Mail, Phone, User, Edit, Camera } from 'lucide-react';
import Button from '../components/Button';
import { useCountUp } from '../hooks/useCountUp';

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  course_name: string;
  package_selected: string;
  final_price: number;
  created_at: string;
  payment_status: string;
}

interface EarningsData {
  totalUsers: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  allTimeEarnings: number;
  potentialEarnings: number;
  referredUsers: ReferredUser[];
}

const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoLink, setPhotoLink] = useState<string>('');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Counting animations for earnings
  const weeklyCount = useCountUp({ 
    end: earningsData?.weeklyEarnings || 0, 
    duration: 2000,
    delay: loading ? 0 : 500 
  });
  const monthlyCount = useCountUp({ 
    end: earningsData?.monthlyEarnings || 0, 
    duration: 2000,
    delay: loading ? 0 : 1000 
  });
  const allTimeCount = useCountUp({ 
    end: earningsData?.allTimeEarnings || 0, 
    duration: 2000,
    delay: loading ? 0 : 1500 
  });
  const potentialCount = useCountUp({ 
    end: earningsData?.potentialEarnings || 0, 
    duration: 2000,
    delay: loading ? 0 : 2000 
  });

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        setError(null);

        // Get the user's referral code
        const { data: referralCodeData, error: referralError } = await supabase
          .from('referral_codes')
          .select('code')
          .eq('referrer_email', user.email.toLowerCase().trim())
          .eq('code_type', 'affiliate')
          .eq('is_active', true)
          .single();

        if (referralError || !referralCodeData?.code) {
          setError('No affiliate code found for your account.');
          setLoading(false);
          return;
        }

        const referralCode = referralCodeData.code;

        // Get all users who used this referral code (including pending payments)
        const { data: referredUsers, error: usersError } = await supabase
          .from('paid_users')
          .select('*')
          .eq('referral_code', referralCode)
          .order('created_at', { ascending: false });

        if (usersError) {
          throw new Error('Failed to fetch referred users');
        }

        // Calculate earnings (only from completed payments)
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Filter only completed payments for earnings calculation
        const completedUsers = referredUsers?.filter(user => user.payment_status === 'completed') || [];
        
        const allTimeEarnings = completedUsers.reduce((sum, user) => sum + (user.final_price || 0), 0);
        
        const weeklyUsers = completedUsers.filter(user => 
          new Date(user.created_at) >= oneWeekAgo
        );
        const weeklyEarnings = weeklyUsers.reduce((sum, user) => sum + (user.final_price || 0), 0);

        const monthlyUsers = completedUsers.filter(user => 
          new Date(user.created_at) >= oneMonthAgo
        );
        const monthlyEarnings = monthlyUsers.reduce((sum, user) => sum + (user.final_price || 0), 0);

        // Calculate potential earnings (only pending users)
        const pendingUsers = referredUsers?.filter(user => user.payment_status !== 'completed') || [];
        const pendingEarnings = pendingUsers.reduce((sum, user) => sum + (user.final_price || 0), 0);

        setEarningsData({
          totalUsers: referredUsers?.length || 0, // Total users including pending
          monthlyEarnings,
          weeklyEarnings,
          allTimeEarnings,
          potentialEarnings: pendingEarnings,
          referredUsers: referredUsers || [] // All users including pending
        });

      } catch (err: any) {
        setError(err.message || 'Failed to fetch earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [user?.email]);

  // Fetch user's profile photo
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('paid_users')
          .select('photo_link, name, package_selected')
          .eq('email', user.email.toLowerCase().trim())
          .single();

        if (data && data.photo_link) {
          setPhotoLink(data.photo_link);
        }
      } catch (err) {
        console.log('No profile photo found');
      }
    };

    fetchUserProfile();
  }, [user?.email]);

  const handlePhotoUpdate = async () => {
    if (!user?.email) return;

    try {
      setPhotoError(null);
      
      // Validate URL format
      if (photoLink && !photoLink.match(/^https?:\/\//)) {
        setPhotoError('Please enter a valid URL starting with http:// or https://');
        return;
      }

      const { error } = await supabase
        .from('paid_users')
        .update({ photo_link: photoLink || null })
        .eq('email', user.email.toLowerCase().trim());

      if (error) {
        throw error;
      }

      setIsEditingPhoto(false);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to update photo');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBarWithPackages />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark">
        <NavBarWithPackages />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-red-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Earnings</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <TrendingUp className="text-primary mr-2 md:mr-3" size={24} />
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                Your Earnings Dashboard
              </h1>
            </div>
            <p className="text-gray-300 text-sm md:text-lg">
              Track your affiliate earnings and referred users
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-dark-light border border-primary/20 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-6 mb-4 md:mb-0 w-full md:w-auto">
                {/* Profile Photo */}
                <div className="relative">
                  {photoLink ? (
                    <img 
                      src={photoLink} 
                      alt="Profile" 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary/30"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 ${photoLink ? 'hidden' : ''}`}>
                    <User className="text-primary" size={24} />
                  </div>
                  
                  {/* Edit Photo Button */}
                  <button
                    onClick={() => setIsEditingPhoto(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
                    title="Edit photo"
                  >
                    <Camera size={12} className="text-white" />
                  </button>
                </div>

                {/* User Info */}
                <div className="text-left flex-1">
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-1">
                    {user?.user_metadata?.name || user?.email}
                  </h2>
                  <p className="text-gray-300 mb-1 text-xs md:text-base">{user?.email}</p>
                  <div className="flex items-center space-x-2">
                    <Package className="text-primary" size={14} />
                    <span className="text-primary font-medium capitalize text-sm">
                      {earningsData?.referredUsers.find(u => u.email === user?.email)?.package_selected || 'User'}
                    </span>
                  </div>
                  {/* Commission and upgrade message */}
                  {(() => {
                    const pkg = earningsData?.referredUsers.find(u => u.email === user?.email)?.package_selected;
                    let commission = 0;
                    if (pkg === 'starter') commission = 30;
                    else if (pkg === 'professional') commission = 50;
                    else if (pkg === 'enterprise') commission = 70;
                    return (
                      <>
                        {commission > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            You have the <span className="capitalize text-primary font-semibold">{pkg}</span> package and earn <span className="text-green-400 font-semibold">{commission}%</span> commission.
                          </div>
                        )}
                        {pkg !== 'enterprise' && pkg && (
                          <div className="text-xs text-yellow-400 mt-1">
                            To earn up to <span className="font-semibold">70%</span>, please <a href="/packages" className="underline hover:text-yellow-300">upgrade your package</a>.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Photo Link Input */}
              {isEditingPhoto && (
                <div className="w-full md:w-auto">
                  <div className="flex flex-col space-y-2">
                    <input
                      type="url"
                      value={photoLink}
                      onChange={(e) => setPhotoLink(e.target.value)}
                      placeholder="Enter photo URL"
                      className="px-3 md:px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300 text-sm"
                    />
                    {photoError && (
                      <p className="text-red-400 text-xs">{photoError}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        onClick={handlePhotoUpdate}
                        size="sm"
                        className="flex items-center text-xs"
                      >
                        <Edit size={12} className="mr-1" />
                        Save Photo
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingPhoto(false);
                          setPhotoError(null);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-dark-light border border-green-500/20 rounded-lg p-3 md:p-6">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-500" size={16} />
                </div>
                <span className="text-gray-400 text-xs">This Week</span>
              </div>
              <div className="text-base md:text-2xl font-bold text-green-400 mb-1 md:mb-2">
                {formatCurrency(weeklyCount)}
              </div>
              <p className="text-gray-400 text-xs">
                {earningsData?.referredUsers.filter(user => 
                  new Date(user.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length || 0} new users this week
              </p>
            </div>

            <div className="bg-dark-light border border-green-500/20 rounded-lg p-3 md:p-6">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-500" size={16} />
                </div>
                <span className="text-gray-400 text-xs">This Month</span>
              </div>
              <div className="text-base md:text-2xl font-bold text-green-400 mb-1 md:mb-2">
                {formatCurrency(monthlyCount)}
              </div>
              <p className="text-gray-400 text-xs">
                {earningsData?.referredUsers.filter(user => 
                  new Date(user.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length || 0} new users this month
              </p>
            </div>

            <div className="bg-dark-light border border-green-500/20 rounded-lg p-3 md:p-6">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-500" size={16} />
                </div>
                <span className="text-gray-400 text-xs">All Time</span>
              </div>
              <div className="text-base md:text-2xl font-bold text-green-400 mb-1 md:mb-2">
                {formatCurrency(allTimeCount)}
              </div>
              <p className="text-gray-400 text-xs">
                {earningsData?.totalUsers || 0} total users referred
              </p>
            </div>

            <div className="bg-dark-light border border-yellow-500/20 rounded-lg p-3 md:p-6">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-yellow-500" size={16} />
                </div>
                <span className="text-gray-400 text-xs">Potential</span>
              </div>
              <div className="text-base md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2">
                {formatCurrency(potentialCount)}
              </div>
              <p className="text-gray-400 text-xs">
                {earningsData?.referredUsers.filter(user => user.payment_status !== 'completed').length || 0} pending users
              </p>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-dark-light border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="mr-3 text-primary" size={24} />
                Referred Users ({earningsData?.totalUsers || 0})
              </h2>
            </div>

            {earningsData?.referredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="text-gray-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Users Yet</h3>
                <p className="text-gray-500">
                  Share your affiliate link to start earning commissions
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Package</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsData?.referredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-dark-lighter transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm flex items-center mt-1">
                              <Mail size={12} className="mr-1" />
                              <a 
                                href={`mailto:${user.email}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Send email"
                              >
                                {user.email}
                              </a>
                            </div>
                            <div className="text-gray-400 text-sm flex items-center mt-1">
                              <Phone size={12} className="mr-1" />
                              <a 
                                href={`tel:${user.phone}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Call phone number"
                              >
                                {user.phone}
                              </a>
                            </div>
                            <div className="text-gray-400 text-sm flex items-center mt-1">
                              <MapPin size={12} className="mr-1" />
                              {user.state}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Package size={16} className="text-primary mr-2" />
                            <span className="text-white capitalize">{user.package_selected}</span>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">{user.course_name || 'Course not specified'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-green-400 font-semibold">
                            {formatCurrency(user.final_price)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.payment_status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : user.payment_status === 'processing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : user.payment_status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {user.payment_status === 'completed' ? 'Paid' : 
                             user.payment_status === 'processing' ? 'Processing' :
                             user.payment_status === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage; 