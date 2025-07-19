import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPackage } from '../hooks/useUserPackage';
import Button from './Button';
import { supabase } from '../lib/supabase';
import { Menu, X, GraduationCap, Download, ChevronDown, Package, Star, Check, User, LogOut, Crown, Video, TrendingUp, Palette } from 'lucide-react';
import packageCourses from '../data/packageCourses';
import courses from '../data/courses';

interface PackageData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  courses: string[];
  features: string[];
  isPopular?: boolean;
  color: string;
}

const packages: PackageData[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    description: 'Perfect for beginners starting their digital journey',
    price: 7999,
    originalPrice: 15999,
    courses: [
      'Premiere Pro Mastery',
    ],
    features: [
      '3 Complete Courses',
      'Lifetime Access',
      'Basic Support',
      'Certificate of Completion'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'professional',
    name: 'Pro (Intermediate)',
    description: 'Most popular choice for career advancement',
    price: 9600,
    originalPrice: 14999,
    courses: [
      'Premiere Pro Mastery',
      'After effects Mastery ',
    ],
    features: [
      '2 Complete Courses',
      'Lifetime Access',
      '50% Affilate Comission',
      'Email Support',
      'Whatsapp Support',
      'Certificate of Completion',
      'Downloadable Resources'
    ],
    isPopular: true,
    color: 'from-primary to-red-600'
  },
  {
    id: 'enterprise',
    name: 'Mastery (Advanced)',
    description: 'Complete skill transformation for professionals',
    price: 13200,
    originalPrice: 29999,
    courses: [
      'All Current Courses',
    ],
    features: [
     '2 Complete Courses',
      'Lifetime Access',
      '50% Affilate Comission',
      'Email Support',
      'Whatsapp Support',
      'Certificate of Completion',
      'Downloadable Resources'
    ],
    color: 'from-purple-500 to-purple-600'
  },
];

// Helper to get package order
const packageOrder = ['starter', 'professional', 'enterprise'];

const NavBarWithPackages: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userPhotoLink, setUserPhotoLink] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { userPackage, getAvailableCourses } = useUserPackage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user's profile photo
  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('paid_users')
          .select('photo_link')
          .eq('email', user.email.toLowerCase().trim())
          .single();

        if (data && data.photo_link) {
          setUserPhotoLink(data.photo_link);
        }
      } catch (err) {
        console.log('No profile photo found for navbar');
      }
    };

    fetchUserPhoto();
  }, [user?.email]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.packages-dropdown')) {
        setPackagesDropdownOpen(false);
      }
      if (!target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // In the Packages dropdown, filter packages to only show those above the user's current package
  const userPackageIndex = userPackage ? packageOrder.indexOf(userPackage.package_selected) : -1;
  const upgradePackages = userPackageIndex >= 0 ? packages.filter(pkg => packageOrder.indexOf(pkg.id) > userPackageIndex) : packages;

  // In the mobile menu, filter packages the same way
  const upgradePackagesMobile = userPackageIndex >= 0 ? packages.filter(pkg => packageOrder.indexOf(pkg.id) > userPackageIndex) : packages;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? 'bg-dark/60 backdrop-blur border-b border-white/10 shadow-lg' : 'bg-transparent backdrop-blur'}
      `}
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white font-bold text-xl md:text-2xl flex items-center">
            <img src="/android-chrome-192x192.png" alt="Logo" style={{ height: 32, width: 32, marginRight: 8, borderRadius: '8px' }} />
            SkillRas
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-white hover:text-primary-light transition-colors">
              Courses
            </Link>
            <Link to="/blog" className="px-4 py-2 text-base font-medium hover:text-blue-600">Blog</Link>
            {!user && (
              <Link to="/" className="text-white hover:text-primary-light transition-colors">
                Home
              </Link>
            )}
            
            {/* Packages Dropdown */}
            <div className="relative packages-dropdown">
              <button
                onClick={() => setPackagesDropdownOpen(!packagesDropdownOpen)}
                className="text-white hover:text-primary-light transition-colors flex items-center"
              >
                Packages
                <ChevronDown size={16} className={`ml-1 transition-transform ${packagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {packagesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-dark-light border border-gray-600 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                  <div className="p-4 border-b border-gray-600">
                    <h3 className="text-white font-bold text-lg mb-1">Choose Your Package</h3>
                    <p className="text-gray-300 text-sm">Save more with bundled courses</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {upgradePackages.map((pkg) => (
                      <Link
                        key={pkg.id}
                        to="/packages"
                        className="block p-4 border-b border-gray-700 last:border-b-0 hover:bg-dark-lighter transition-colors"
                        onClick={() => setPackagesDropdownOpen(false)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="text-white font-medium">{pkg.name}</h4>
                              {pkg.isPopular && (
                                <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 text-xs mb-2">{pkg.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-primary font-bold">
                            {pkg.price === 0 ? 'Custom Pricing' : `₹${pkg.price.toLocaleString()}`}
                          </div>
                          {pkg.originalPrice > 0 && (
                            <div className="text-gray-400 text-xs line-through">
                              ₹{pkg.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">Includes:</div>
                          <ul className="space-y-1">
                            {pkg.courses.slice(0, 2).map((course, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-center">
                                <Check size={12} className="text-primary mr-1 flex-shrink-0" />
                                {course}
                              </li>
                            ))}
                            {pkg.courses.length > 2 && (
                              <li className="text-xs text-gray-400">
                                +{pkg.courses.length - 2} more courses
                              </li>
                            )}
                          </ul>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-dark border-t border-gray-600">
                    <Link to="/packages" onClick={() => setPackagesDropdownOpen(false)}>
                      <Button className="w-full text-sm" variant="outline">
                        Compare All Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/download" className="text-white hover:text-primary-light transition-colors flex items-center">
              <Download size={16} className="mr-1" />
              Downloads
            </Link>
            
            {/* User Authentication Section */}
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-primary-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-primary/30">
                    {userPhotoLink ? (
                      <img 
                        src={userPhotoLink} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-primary flex items-center justify-center ${userPhotoLink ? 'hidden' : ''}`}>
                      <User size={16} className="text-white" />
                    </div>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-dark-light border border-gray-600 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                    <div className="p-4 border-b border-gray-600">
                      <p className="text-white font-medium truncate">{user.email}</p>
                      <p className="text-gray-400 text-sm">Logged in</p>
                    </div>
                    
                    <div className="p-2">
                      {userPackage ? (
                        <>
                          <Link
                            to="/my-courses"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-left px-3 py-2 text-white hover:bg-dark-lighter rounded-lg transition-colors"
                          >
                            <GraduationCap size={16} className="mr-2 inline" />
                            My Courses
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-left px-3 py-2 text-white hover:bg-dark-lighter rounded-lg transition-colors"
                          >
                            <Crown size={16} className="mr-2 inline" />
                            My Dashboard
                          </Link>
                          <div className="border-t border-gray-600 my-2"></div>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/trial"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-left px-3 py-2 text-white hover:bg-dark-lighter rounded-lg transition-colors"
                          >
                            Trial Course
                          </Link>
                          <Link
                            to="/gymCoursepage"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-left px-3 py-2 text-white hover:bg-dark-lighter rounded-lg transition-colors"
                          >
                            Gym Course
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-600 my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full text-left px-3 py-2 text-red-400 hover:bg-dark-lighter rounded-lg transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button size="sm" variant="outline">Login</Button>
                </Link>
                <Link to="/enroll">
                  <Button size="sm">Enroll Now</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-light mt-4 rounded-lg py-4 px-2 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-primary-light transition-colors py-2"
              >
                Courses
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-primary-light transition-colors py-2"
              >
                Blog
              </Link>
              {!user && (
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-primary-light transition-colors py-2"
                >
                  Home
                </Link>
              )}
              
              {/* Mobile Packages */}
              <div className="py-2">
                <div className="text-white font-medium mb-3 flex items-center">
                  <Package size={16} className="mr-2 text-primary" />
                  Packages
                </div>
                <div className="space-y-3 ml-6">
                  {upgradePackagesMobile.map((pkg) => (
                    <Link
                      key={pkg.id}
                      to="/packages"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block bg-dark rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{pkg.name}</span>
                        {pkg.isPopular && (
                          <Star size={12} className="text-primary fill-current" />
                        )}
                      </div>
                      <div className="text-primary text-sm font-bold">
                        {pkg.price === 0 ? 'Custom' : `₹${pkg.price.toLocaleString()}`}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/download" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-primary-light transition-colors py-2 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Downloads
              </Link>
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-primary/30">
                      {userPhotoLink ? (
                        <img 
                          src={userPhotoLink} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-primary flex items-center justify-center ${userPhotoLink ? 'hidden' : ''}`}>
                        <User size={20} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {userPackage ? (
                      <>
                        <Link 
                          to="/my-courses"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-white hover:text-primary-light transition-colors py-2 flex items-center"
                        >
                          <GraduationCap size={16} className="mr-2" />
                          My Courses
                        </Link>
                        <Link 
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-white hover:text-primary-light transition-colors py-2 flex items-center"
                        >
                          <Crown size={16} className="mr-2" />
                          My Dashboard
                        </Link>
                        <div className="border-t border-gray-600 my-2"></div>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/trial"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-white hover:text-primary-light transition-colors py-2"
                        >
                          Trial Course
                        </Link>
                        <Link 
                          to="/gymCoursepage"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-white hover:text-primary-light transition-colors py-2"
                        >
                          Gym Course
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block text-red-400 hover:text-red-300 transition-colors py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-600 pt-4 space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">Login</Button>
                  </Link>
                  <Link to="/enroll" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Enroll Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarWithPackages;