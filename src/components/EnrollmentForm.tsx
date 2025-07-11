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
  Tag,
  ExternalLink,
  UserCheck
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  qualification: string;
  state: string;
  pincode: string;
  referralCode: string;
}

interface ReferralData {
  id: string;
  code: string;
  code_type: string;
  referrer_name?: string;
  referrer_email?: string;
  discount_percentage: number;
  description?: string;
  max_usage?: number;
  current_usage: number;
  payment_link?: string; // Added payment_link field
}

interface EnrollmentFormProps {
  courseId: string;
  courseName: string;
  originalPrice: number;
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

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseId, courseName, originalPrice }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    qualification: '',
    state: '',
    pincode: '',
    referralCode: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

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
    
    // Referral code validation
    if (!formData.referralCode.trim()) {
      errors.referralCode = "Referral/Coupon code is required( Enter (New) if Don't have any";
    } else if (!codeVerified) {
      errors.referralCode = 'Please verify your code first';
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
    
    // Special handling for referral code
    if (field === 'referralCode') {
      processedValue = value.toUpperCase();
      if (processedValue !== formData.referralCode) {
        setCodeVerified(false);
        setReferralData(null);
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

  const verifyReferralCode = async () => {
    if (!formData.referralCode.trim()) {
      setError('Please enter a referral/coupon code');
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', formData.referralCode.toUpperCase())
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

      setReferralData(data);
      setCodeVerified(true);
      setError(null);

    } catch (err: any) {
      console.error('Code verification error:', err);
      setError(err.message || 'Failed to verify code. Please try again.');
      setCodeVerified(false);
      setReferralData(null);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const calculatePricing = () => {
    if (!referralData) return { discountAmount: 0, finalPrice: originalPrice };
    
    const discountAmount = Math.floor(originalPrice * referralData.discount_percentage / 100);
    const finalPrice = originalPrice - discountAmount;
    
    return { discountAmount, finalPrice };
  };

  const getPaymentLink = () => {
    // Use the payment link from the referral code if available, otherwise generate default
    if (referralData?.payment_link) {
      return referralData.payment_link;
    }
    
    // Fallback to default payment link generation
    const { finalPrice } = calculatePricing();
    const baseUrl = 'https://rzp.io/rzp/skillras';
    return `${baseUrl}-${finalPrice}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { discountAmount, finalPrice } = calculatePricing();
      const generatedPaymentLink = getPaymentLink(); // Use the new function
      
      const enrollmentData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        qualification: formData.qualification || null,
        state: formData.state,
        pincode: formData.pincode,
        course_id: courseId,
        course_name: courseName,
        original_price: originalPrice,
        referral_code: formData.referralCode.toUpperCase(),
        referrer_name: referralData?.referrer_name || null,
        discount_percentage: referralData?.discount_percentage || 0,
        discount_amount: discountAmount,
        final_price: finalPrice,
        payment_link: generatedPaymentLink,
        ip_address: null, // You can implement IP detection if needed
        user_agent: navigator.userAgent
      };

      const { data, error: supabaseError } = await supabase
        .from('paid_users')
        .insert([enrollmentData])
        .select();

      if (supabaseError) {
        console.error('Enrollment error:', supabaseError);
        throw new Error('Failed to process enrollment. Please try again.');
      }

      setPaymentLink(generatedPaymentLink);
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentRedirect = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank', 'noopener,noreferrer');
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
      referralCode: ''
    });
    setSuccess(false);
    setReferralData(null);
    setCodeVerified(false);
    setError(null);
    setValidationErrors({});
    setPaymentLink(null);
  };

  if (success) {
    const { discountAmount, finalPrice } = calculatePricing();
    
    return (
      <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-green-500/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Enrollment Successful!</h2>
          <p className="text-gray-300 mb-8">
            Your enrollment has been processed successfully
          </p>
          
          {/* Course Details */}
          <div className="bg-dark rounded-lg p-6 mb-6 border border-primary/20">
            <h3 className="text-white font-bold text-lg mb-2">{courseName}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Original Price:</span>
                <span className="text-gray-300">₹{originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Discount ({referralData?.discount_percentage}%):</span>
                <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                <span className="text-white">Final Price:</span>
                <span className="text-primary">₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Referrer Information */}
          {referralData && (
            <div className="bg-dark rounded-lg p-6 mb-8 border border-primary/20">
              <h3 className="text-white font-bold text-lg mb-2">Code Applied</h3>
              <div className="flex items-center justify-center text-primary mb-2">
                <Tag size={16} className="mr-1" />
                <span className="font-mono text-sm">{referralData.code}</span>
              </div>
              {referralData.referrer_name && (
                <div className="flex items-center justify-center text-gray-300 mb-2">
                  <UserCheck size={16} className="mr-1" />
                  <span className="text-sm">Referred by: {referralData.referrer_name}</span>
                </div>
              )}
              <div className="text-green-400 font-bold">
                {referralData.discount_percentage}% Discount Applied
              </div>
              {referralData.description && (
                <p className="text-gray-300 text-sm mt-2">{referralData.description}</p>
              )}
              {referralData.payment_link && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <p className="text-xs text-gray-400">Custom payment link assigned</p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              onClick={handlePaymentRedirect}
              className="w-full"
              size="lg"
              glowing
            >
              <ExternalLink className="mr-2" size={20} />
              Proceed to Payment
            </Button>
            
            <Button 
              onClick={resetForm}
              variant="outline"
              className="w-full"
            >
              Enroll Another Course
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
        <h2 className="text-3xl font-bold text-white mb-3">Course Enrollment</h2>
        <p className="text-gray-300 mb-4">
          Enroll in <span className="text-primary font-semibold">{courseName}</span>
        </p>
        <div className="bg-dark rounded-lg p-4 border border-primary/20">
          <div className="text-2xl font-bold text-primary">₹{originalPrice.toLocaleString()}</div>
          <div className="text-gray-300 text-sm">Course Price</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Referral/Coupon Code Section */}
        <div className="bg-dark rounded-lg p-6 border border-primary/20">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Hash className="mr-2 text-primary" size={20} />
            Referral/Coupon Code
          </h3>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 font-mono ${
                  validationErrors.referralCode 
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
              onClick={verifyReferralCode}
              disabled={isVerifyingCode || !formData.referralCode.trim()}
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
          
          {validationErrors.referralCode && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.referralCode}
            </p>
          )}
          
          {referralData && codeVerified && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium">✓ Code Verified</span>
                <span className="text-green-400 font-bold">
                  {referralData.discount_percentage}% OFF
                </span>
              </div>
              {referralData.referrer_name && (
                <div className="flex items-center text-gray-300 mb-2">
                  <UserCheck size={14} className="mr-1" />
                  <span className="text-sm">Referred by: {referralData.referrer_name}</span>
                </div>
              )}
              <p className="text-gray-300 text-sm">{referralData.description}</p>
              <div className="text-xs text-gray-400 mt-1">
                Type: {referralData.code_type.charAt(0).toUpperCase() + referralData.code_type.slice(1)}
                {referralData.max_usage && ` • ${referralData.current_usage}/${referralData.max_usage} used`}
                {referralData.payment_link && ` • Custom payment link`}
              </div>
              
              {/* Price Calculation */}
              <div className="mt-3 pt-3 border-t border-green-500/20">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Original Price:</span>
                    <span className="text-gray-300">₹{originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Discount:</span>
                    <span className="text-green-400">-₹{calculatePricing().discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-green-500/20 pt-1">
                    <span className="text-white">Final Price:</span>
                    <span className="text-primary">₹{calculatePricing().finalPrice.toLocaleString()}</span>
                  </div>
                </div>
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
              Processing Enrollment...
            </div>
          ) : (
            <>
              <CreditCard className="mr-2" size={20} />
              Enroll Now
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Need help with your referral code?
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

export default EnrollmentForm;