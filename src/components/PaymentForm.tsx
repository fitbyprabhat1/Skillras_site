import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Phone, 
  Mail, 
  User, 
  Hash,
  MapPin,
  GraduationCap,
  Calendar,
  Percent,
  Tag
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  qualification: string;
  state: string;
  pincode: string;
  couponCode: string;
}

interface CouponData {
  id: string;
  code: string;
  code_type: string;
  discount_percentage?: number;
  discount_amount?: number;
  description?: string;
  max_usage?: number;
  current_usage: number;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Lakshadweep', 'Andaman and Nicobar Islands'
];

const qualifications = [
  '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'PhD', 'Other'
];

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    qualification: '',
    state: '',
    pincode: '',
    couponCode: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      errors.phone = 'Please enter a valid Indian mobile number';
    }
    
    // Age validation
    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 100)) {
      errors.age = 'Age must be between 13 and 100';
    }
    
    // State validation
    if (!formData.state) {
      errors.state = 'State is required';
    }
    
    // Pincode validation
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    
    // Coupon code validation
    if (!formData.couponCode.trim()) {
      errors.couponCode = 'Coupon/Affiliate code is required';
    } else if (!codeVerified) {
      errors.couponCode = 'Please verify your code first';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;
    
    // Special handling for phone number
    if (field === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    // Special handling for pincode
    if (field === 'pincode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
    }
    
    // Special handling for age
    if (field === 'age') {
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    // Special handling for coupon code
    if (field === 'couponCode') {
      processedValue = value.toUpperCase();
      if (processedValue !== formData.couponCode) {
        setCodeVerified(false);
        setCouponData(null);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  const verifyCouponCode = async () => {
    if (!formData.couponCode.trim()) {
      setError('Please enter a coupon/affiliate code');
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('coupon_affiliate_codes')
        .select('*')
        .eq('code', formData.couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Invalid code. Please check your code and try again.');
        }
        throw new Error('Error verifying code. Please try again.');
      }

      // Check if code is still valid
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        throw new Error('This code has expired.');
      }

      // Check usage limits
      if (data.max_usage && data.current_usage >= data.max_usage) {
        throw new Error('This code has reached its usage limit.');
      }

      setCouponData(data);
      setCodeVerified(true);
      setError(null);

    } catch (err: any) {
      console.error('Code verification error:', err);
      setError(err.message || 'Failed to verify code. Please try again.');
      setCodeVerified(false);
      setCouponData(null);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        qualification: formData.qualification || null,
        state: formData.state,
        pincode: formData.pincode,
        code_used: formData.couponCode.toUpperCase(),
        code_type: couponData?.code_type || null,
        discount_applied: couponData?.discount_percentage || couponData?.discount_amount || 0,
        ip_address: null, // You can implement IP detection if needed
        user_agent: navigator.userAgent
      };

      const { data, error: supabaseError } = await supabase
        .from('payment_form_submissions')
        .insert([submissionData])
        .select();

      if (supabaseError) {
        console.error('Submission error:', supabaseError);
        throw new Error('Failed to submit form. Please try again.');
      }

      setSuccess(true);
      
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      qualification: '',
      state: '',
      pincode: '',
      couponCode: ''
    });
    setSuccess(false);
    setCouponData(null);
    setCodeVerified(false);
    setError(null);
    setValidationErrors({});
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-green-500/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Success!</h2>
          <p className="text-gray-300 mb-8">
            Your information has been submitted successfully
          </p>
          
          {couponData && (
            <div className="bg-dark rounded-lg p-6 mb-8 border border-primary/20">
              <h3 className="text-white font-bold text-lg mb-2">Code Applied</h3>
              <div className="flex items-center justify-center text-primary mb-2">
                <Tag size={16} className="mr-1" />
                <span className="font-mono text-sm">{couponData.code}</span>
              </div>
              <div className="text-green-400 font-bold">
                {couponData.discount_percentage && `${couponData.discount_percentage}% Discount`}
                {couponData.discount_amount && `₹${couponData.discount_amount} Off`}
              </div>
              <p className="text-gray-300 text-sm mt-2">{couponData.description}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              onClick={resetForm}
              className="w-full"
              size="lg"
            >
              Submit Another Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-primary/10">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="text-primary" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Payment Verification</h2>
        <p className="text-gray-300">
          Enter your details and coupon/affiliate code to proceed
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Coupon/Affiliate Code Section */}
        <div className="bg-dark rounded-lg p-6 border border-primary/20">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Hash className="mr-2 text-primary" size={20} />
            Coupon/Affiliate Code
          </h3>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={formData.couponCode}
                onChange={(e) => handleInputChange('couponCode', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 font-mono ${
                  validationErrors.couponCode 
                    ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                    : codeVerified
                    ? 'border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
                    : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="Enter your code"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <Button
              type="button"
              onClick={verifyCouponCode}
              disabled={isVerifyingCode || !formData.couponCode.trim()}
              variant={codeVerified ? 'secondary' : 'primary'}
              className="px-6"
            >
              {isVerifyingCode ? (
                <Loader className="animate-spin" size={20} />
              ) : codeVerified ? (
                <CheckCircle size={20} />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
          
          {validationErrors.couponCode && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.couponCode}
            </p>
          )}
          
          {couponData && codeVerified && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium">✓ Code Verified</span>
                <span className="text-green-400 font-bold">
                  {couponData.discount_percentage && `${couponData.discount_percentage}% OFF`}
                  {couponData.discount_amount && `₹${couponData.discount_amount} OFF`}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{couponData.description}</p>
              <div className="text-xs text-gray-400 mt-1">
                Type: {couponData.code_type.charAt(0).toUpperCase() + couponData.code_type.slice(1)}
                {couponData.max_usage && ` • ${couponData.current_usage}/${couponData.max_usage} used`}
              </div>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-white mb-2 font-medium flex items-center">
              <User size={16} className="mr-2 text-primary" />
              Full Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.name 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your full name"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.name}
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
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-white mb-2 font-medium flex items-center">
              <Phone size={16} className="mr-2 text-primary" />
              Phone Number <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.phone 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.phone}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.phone.length}/10 digits
            </p>
          </div>

          <div>
            <label htmlFor="age" className="block text-white mb-2 font-medium flex items-center">
              <Calendar size={16} className="mr-2 text-primary" />
              Age
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.age 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your age"
              min="13"
              max="100"
            />
            {validationErrors.age && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.age}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="qualification" className="block text-white mb-2 font-medium flex items-center">
              <GraduationCap size={16} className="mr-2 text-primary" />
              Qualification
            </label>
            <select
              id="qualification"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300"
            >
              <option value="">Select qualification</option>
              {qualifications.map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="state" className="block text-white mb-2 font-medium flex items-center">
              <MapPin size={16} className="mr-2 text-primary" />
              State <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.state 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
            >
              <option value="">Select your state</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {validationErrors.state && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.state}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pincode" className="block text-white mb-2 font-medium flex items-center">
              <MapPin size={16} className="mr-2 text-primary" />
              Pincode <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 ${
                validationErrors.pincode 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            {validationErrors.pincode && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.pincode}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.pincode.length}/6 digits
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          glowing
          disabled={isLoading || !codeVerified}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" size={20} />
              Submitting...
            </div>
          ) : (
            <>
              <CreditCard className="mr-2" size={20} />
              Submit Information
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Need help with your code?
          </p>
          <a 
            href="mailto:admin@skillras.com" 
            className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;