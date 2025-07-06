import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Loader,
  BookOpen
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (isSignUp) {
      if (!formData.name || !formData.phone) {
        setError('Name and phone are required for registration');
        return false;
      }

      if (formData.phone.length !== 10 || !/^[0-9]+$/.test(formData.phone)) {
        setError('Phone number must be exactly 10 digits');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.phone,
          formData.name
        );

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Login successful! Redirecting...');
          // Navigation will happen automatically via useEffect
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-white text-2xl font-bold mb-6">
            <BookOpen className="mr-2 text-primary" size={32} />
            SkillRas
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-300">
            {isSignUp 
              ? 'Join thousands of students learning new skills' 
              : 'Sign in to access your courses and continue learning'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-light rounded-xl p-8 shadow-lg border border-primary/10">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
              <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
              <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-white mb-2 font-medium flex items-center">
                  <User size={16} className="mr-2 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-white mb-2 font-medium flex items-center">
                <Mail size={16} className="mr-2 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
                placeholder="Enter your email address"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="phone" className="block text-white mb-2 font-medium flex items-center">
                  <Phone size={16} className="mr-2 text-primary" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  required={isSignUp}
                />
                <p className="text-gray-400 text-xs mt-1">
                  {formData.phone.length}/10 digits
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-white mb-2 font-medium flex items-center">
                <Lock size={16} className="mr-2 text-primary" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
                  placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium flex items-center">
                  <Lock size={16} className="mr-2 text-primary" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
                  placeholder="Confirm your password"
                  required={isSignUp}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              glowing
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                className="text-primary hover:text-primary-light transition-colors ml-2 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 bg-dark-light rounded-xl p-6 border border-primary/10">
          <h3 className="text-white font-bold mb-4">Demo Accounts for Testing</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-dark rounded-lg p-3">
              <p className="text-gray-300"><strong>Email:</strong> demo@skillras.com</p>
              <p className="text-gray-300"><strong>Password:</strong> demo123</p>
            </div>
            <div className="bg-dark rounded-lg p-3">
              <p className="text-gray-300"><strong>Email:</strong> student@skillras.com</p>
              <p className="text-gray-300"><strong>Password:</strong> student123</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Use these accounts to test the login functionality, or create your own account.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;