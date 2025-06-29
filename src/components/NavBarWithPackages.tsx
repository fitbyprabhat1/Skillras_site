import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { Menu, X, BookOpen, Download, ChevronDown, Package, Star, Check } from 'lucide-react';

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
      'Content Creation Mastery',
      'Basic Photography'
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
    name: 'Professional Package',
    description: 'Most popular choice for career advancement',
    price: 14999,
    originalPrice: 29999,
    courses: [
      'Premiere Pro Mastery',
      'Digital Marketing Mastery',
      'Graphic Design Pro',
      'Content Creation Mastery',
      'Professional Photography'
    ],
    features: [
      '5 Complete Courses',
      'Lifetime Access',
      'Priority Support',
      '1-on-1 Mentoring Session',
      'Portfolio Review',
      'Job Assistance'
    ],
    isPopular: true,
    color: 'from-primary to-red-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    description: 'Complete skill transformation for professionals',
    price: 24999,
    originalPrice: 49999,
    courses: [
      'All Current Courses',
      'Future Course Access',
      'Exclusive Masterclasses',
      'Industry Workshops'
    ],
    features: [
      'All Courses (Current + Future)',
      'Lifetime Access',
      'VIP Support',
      '3 Mentoring Sessions',
      'Portfolio Review',
      'Job Assistance',
      'Exclusive Community Access',
      'Monthly Live Sessions'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'custom',
    name: 'Custom Package',
    description: 'Tailored learning path for specific needs',
    price: 0,
    originalPrice: 0,
    courses: [
      'Choose Your Courses',
      'Personalized Learning Path',
      'Custom Timeline'
    ],
    features: [
      'Customized Course Selection',
      'Flexible Timeline',
      'Dedicated Support',
      'Personal Learning Advisor',
      'Custom Pricing'
    ],
    color: 'from-green-500 to-green-600'
  }
];

const NavBarWithPackages: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const location = useLocation();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.packages-dropdown')) {
        setPackagesDropdownOpen(false);
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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white font-bold text-xl md:text-2xl flex items-center">
            <BookOpen className="mr-2 text-primary" size={28} />
            SkillRas
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary-light transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-white hover:text-primary-light transition-colors">
              All Courses
            </Link>
            
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
                    {packages.map((pkg) => (
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
            
            <Link to="/premiere-pro">
              <Button size="sm">Try Free Course</Button>
            </Link>
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
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-primary-light transition-colors py-2"
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-primary-light transition-colors py-2"
              >
                All Courses
              </Link>
              
              {/* Mobile Packages */}
              <div className="py-2">
                <div className="text-white font-medium mb-3 flex items-center">
                  <Package size={16} className="mr-2 text-primary" />
                  Packages
                </div>
                <div className="space-y-3 ml-6">
                  {packages.map((pkg) => (
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
              
              <Link to="/premiere-pro">
                <Button className="w-full">Try Free Course</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarWithPackages;