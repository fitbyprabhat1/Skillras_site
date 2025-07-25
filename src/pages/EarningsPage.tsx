import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import NavBarWithPackages from '../components/NavBarWithPackages';
import { TrendingUp, Users, DollarSign, Calendar, Package, MapPin, Mail, Phone, User, Edit, Camera, Filter, ChevronLeft, ChevronRight, SortAsc, SortDesc } from 'lucide-react';
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

  // Filtering and pagination state
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const itemsPerPage = 6;

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
        .limit(1); // Get only the first row

      if (error) {
        console.log('Error fetching profile:', error);
        return;
      }

      if (data && data.length > 0 && data[0].photo_link) {
        setPhotoLink(data[0].photo_link);
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

  // Filter and sort users
  const getFilteredAndSortedUsers = () => {
    if (!earningsData?.referredUsers) return [];

    let filteredUsers = [...earningsData.referredUsers];

    // Apply date filter
    if (fromDate || toDate) {
      filteredUsers = filteredUsers.filter(user => {
        const userDate = new Date(user.created_at);
        let afterFrom = true;
        let beforeTo = true;
        if (fromDate) afterFrom = userDate >= new Date(fromDate);
        if (toDate) beforeTo = userDate <= new Date(toDate + 'T23:59:59');
        return afterFrom && beforeTo;
      });
    } else if (dateFilter !== 'all') {
      const now = new Date();
      let filterDate: Date;
      
      switch (dateFilter) {
        case 'today':
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          filterDate = new Date(0);
      }
      
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.created_at) >= filterDate
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.payment_status === statusFilter
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'amount':
          comparison = (a.final_price || 0) - (b.final_price || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredUsers;
  };

  const filteredUsers = getFilteredAndSortedUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSort = (field: 'date' | 'amount' | 'name') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDateFilter('all');
    setFromDate('');
    setToDate('');
    setStatusFilter('all');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
    setShowDateFilter(false);
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
          <div className="bg-dark-light border border-primary/20 rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                <Users className="mr-3 text-primary" size={20} />
                Referred Users ({filteredUsers.length})
              </h2>
              
              {/* Filter Toggle Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="flex items-center text-xs"
                >
                  <Filter size={14} className="mr-1" />
                  Filters
                </Button>
                <Button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  variant="outline"
                  size="sm"
                  className="flex items-center text-xs"
                >
                  <Calendar size={14} className="mr-1" />
                  Filter by Date
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <div className="bg-dark-lighter rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 bg-dark border border-gray-600 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="processing">Processing</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSort('date')}
                        variant={sortBy === 'date' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs flex items-center"
                      >
                        {sortBy === 'date' ? (sortOrder === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                        Date
                      </Button>
                      <Button
                        onClick={() => handleSort('amount')}
                        variant={sortBy === 'amount' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs flex items-center"
                      >
                        {sortBy === 'amount' ? (sortOrder === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                        Amount
                      </Button>
                      <Button
                        onClick={() => handleSort('name')}
                        variant={sortBy === 'name' ? 'primary' : 'outline'}
                        size="sm"
                        className="text-xs flex items-center"
                      >
                        {sortBy === 'name' ? (sortOrder === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />) : null}
                        Name
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Filter Section */}
            {showDateFilter && (
              <div className="bg-dark-lighter rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Custom Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={e => {
                          setFromDate(e.target.value);
                          setDateFilter('all');
                          setCurrentPage(1);
                        }}
                        className="flex-1 px-3 py-2 bg-dark border border-gray-600 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                        max={toDate || undefined}
                        placeholder="From"
                      />
                      <span className="text-gray-400 self-center">to</span>
                      <input
                        type="date"
                        value={toDate}
                        onChange={e => {
                          setToDate(e.target.value);
                          setDateFilter('all');
                          setCurrentPage(1);
                        }}
                        className="flex-1 px-3 py-2 bg-dark border border-gray-600 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
                        min={fromDate || undefined}
                        placeholder="To"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowDateFilter(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="text-gray-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Users Found</h3>
                <p className="text-gray-500">
                  {earningsData?.referredUsers.length === 0 
                    ? 'Share your affiliate link to start earning commissions'
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {paginatedUsers.map((user) => (
                    <div key={user.id} className="bg-dark-lighter border border-gray-700 rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col space-y-3">
                        {/* User Info */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">{user.name}</h3>
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-400 text-sm">
                                <Mail size={12} className="mr-2" />
                                <a 
                                  href={`mailto:${user.email}`}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  {user.email}
                                </a>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm">
                                <Phone size={12} className="mr-2" />
                                <a 
                                  href={`tel:${user.phone}`}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  {user.phone}
                                </a>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm">
                                <MapPin size={12} className="mr-2" />
                                {user.state}
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
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
                        </div>

                        {/* Package and Amount */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                          <div className="flex items-center">
                            <Package size={16} className="text-primary mr-2" />
                            <span className="text-white capitalize text-sm">{user.package_selected}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-semibold text-lg">
                              {formatCurrency(user.final_price)}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {formatDate(user.created_at)}
                            </div>
                          </div>
                        </div>

                        {/* Course Info */}
                        {user.course_name && (
                          <div className="text-gray-400 text-sm pt-2 border-t border-gray-700">
                            Course: {user.course_name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="flex items-center text-xs"
                      >
                        <ChevronLeft size={14} className="mr-1" />
                        Previous
                      </Button>
                      <span className="text-gray-400 text-sm px-3">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="flex items-center text-xs"
                      >
                        Next
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage; 