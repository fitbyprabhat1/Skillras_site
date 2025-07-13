import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Loader,
  BookOpen,
  Copy,
  Shield,
  CreditCard
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData(prev => ({ ...prev, email, password }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
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
      // For login, first check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email.toLowerCase().trim())
        .eq('password', formData.password)
        .single();

      if (userError || !userData) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check if user has completed payment in paid_users table
      const { data: paidUserData, error: paidUserError } = await supabase
        .from('paid_users')
        .select('*')
        .eq('email', formData.email.toLowerCase().trim())
        .eq('payment_status', 'completed')
        .single();

      if (paidUserError || !paidUserData) {
        setError('Access denied. You must complete your course enrollment and payment before accessing your account. Please complete your payment first.');
        setLoading(false);
        return;
      }

      // User exists and has completed payment, proceed with login
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Login successful! Redirecting...');
        // Navigation will happen automatically via useEffect
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
            <img src="/android-chrome-192x192.png" alt="Logo" style={{ height: 32, width: 32, marginRight: 8, borderRadius: '8px' }} />
            SkillRas
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300">
            Sign in to access your courses and continue learning
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-light rounded-xl p-8 shadow-lg border border-primary/10">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
              <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <span className="text-sm">{error}</span>
                {error.includes('Access denied') && (
                  <div className="mt-3 pt-3 border-t border-red-500/20">
                    <p className="text-gray-300 text-sm mb-2">
                      To access your account, you need to complete your course enrollment first.
                    </p>
                    <Link 
                      to="/enroll" 
                      className="inline-flex items-center text-primary hover:text-primary-light transition-colors text-sm font-medium"
                    >
                      <CreditCard size={14} className="mr-1" />
                      Complete Enrollment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
              <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300 pr-12"
                  placeholder="Enter your password"
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Don't have an account? Enroll in a course first:
              </p>
              <Link 
                to="/enroll" 
                className="inline-flex items-center text-primary hover:text-primary-light transition-colors text-sm font-medium"
              >
                <CreditCard size={14} className="mr-1" />
                Enroll in Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;