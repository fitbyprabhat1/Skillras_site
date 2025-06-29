import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button';
import { Eye, EyeOff, User, Mail, Lock, Gift, AlertCircle, CheckCircle } from 'lucide-react';

const SignUpForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: searchParams.get('ref') || '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.referralCode && formData.referralCode.length !== 8) {
      errors.referralCode = 'Referral code must be 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.referralCode || undefined
      );

      if (error) {
        throw error;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-green-500/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Welcome to SkillRas!</h2>
          <p className="text-gray-300 mb-6">
            Your account has been created successfully. You'll be redirected to your dashboard shortly.
          </p>
          
          {formData.referralCode && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-primary text-sm">
                🎉 You've joined through a referral! You and your referrer will both benefit from this partnership.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-primary/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
        <p className="text-gray-300">
          Join SkillRas and start your learning journey
        </p>
        
        {formData.referralCode && (
          <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-center text-primary text-sm">
              <Gift size={16} className="mr-2" />
              <span>Joining with referral code: <strong>{formData.referralCode}</strong></span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-white mb-2 font-medium flex items-center">
            <User size={16} className="mr-2 text-primary" />
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
              validationErrors.fullName 
                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            placeholder="Enter your full name"
            maxLength={50}
          />
          {validationErrors.fullName && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-white mb-2 font-medium flex items-center">
            <Mail size={16} className="mr-2 text-primary" />
            Email Address <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
              validationErrors.email 
                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            placeholder="Enter your email address"
            maxLength={100}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-white mb-2 font-medium flex items-center">
            <Lock size={16} className="mr-2 text-primary" />
            Password <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.password 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Create a password"
              maxLength={100}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.password}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            Minimum 6 characters required
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium flex items-center">
            <Lock size={16} className="mr-2 text-primary" />
            Confirm Password <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.confirmPassword 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Confirm your password"
              maxLength={100}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="referralCode" className="block text-white mb-2 font-medium flex items-center">
            <Gift size={16} className="mr-2 text-primary" />
            Referral Code <span className="text-gray-400 text-sm">(Optional)</span>
          </label>
          <input
            type="text"
            id="referralCode"
            value={formData.referralCode}
            onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 font-mono ${
              validationErrors.referralCode 
                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            placeholder="Enter referral code (if any)"
            maxLength={8}
            style={{ textTransform: 'uppercase' }}
          />
          {validationErrors.referralCode && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.referralCode}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            Have a referral code? Enter it to get special benefits!
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          glowing
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Already have an account?
          </p>
          <Link 
            to="/signin" 
            className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;