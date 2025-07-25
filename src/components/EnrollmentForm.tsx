import React, { useState, useEffect } from 'react';
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
  UserCheck,
  Package
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
  selectedPackage: string;
  password: string;
  confirmPassword: string;
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
  payment_link?: string;
  payment_link2?: string;
  payment_link3?: string;
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  color: string;
  badge?: string;
  payment_link?: string;
  payment_link2?: string;
  payment_link3?: string;
}

interface EnrollmentFormProps {
  courseId: string;
  courseName: string;
  originalPrice: number;
  preSelectedPackage?: string;
}

const packages: PackageData[] = [
  {
    id: 'starter',
    name: 'Starter (Basic)',
    description: 'Perfect for beginners starting their digital journey',
    price: 7999,
    originalPrice: 9999,
    discount: 50,
    color: 'from-blue-500 to-blue-600',
    badge: 'Best for Beginners',
    payment_link: 'https://rzp.io/rzp/skillras-starter',
    payment_link2: 'https://rzp.io/rzp/skillras-starter',
    payment_link3: 'https://rzp.io/rzp/skillras-starter'
  },
  {
    id: 'professional',
    name: 'Pro (Intermediate)',
    description: 'Most popular choice for career advancement',
    price: 9600,
    originalPrice: 14999,
    discount: 36,
    color: 'from-primary to-red-600',
    badge: 'Most Popular',
    payment_link: 'https://rzp.io/rzp/QHOh9PY',
    payment_link2: 'https://rzp.io/rzp/QHOh9PY',
    payment_link3: 'https://rzp.io/rzp/QHOh9PY'
  },
  {
    id: 'enterprise',
    name: 'Mastery (Advanced)',
    description: 'Complete skill transformation for professionals',
    price: 13200,
    originalPrice: 29999,
    discount: 55,
    color: 'from-purple-500 to-purple-600',
    badge: 'Best Value',
    payment_link: 'https://rzp.io/rzp/EosrbVdo',
    payment_link2: 'https://rzp.io/rzp/EosrbVdo',
    payment_link3: 'https://rzp.io/rzp/EosrbVdo'
  }
];

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

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseId, courseName, originalPrice, preSelectedPackage }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    qualification: '',
    state: '',
    pincode: '',
    referralCode: '',
    selectedPackage: preSelectedPackage || '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const selectedPackageData = packages.find(pkg => pkg.id === formData.selectedPackage);

  useEffect(() => {
    // Auto-fill referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !formData.referralCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode.toUpperCase() }));
      // Trigger code verification if function exists
      if (typeof verifyReferralCode === 'function') {
        verifyReferralCode(refCode.toUpperCase());
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    // Package validation
    if (!formData.selectedPackage) {
      errors.selectedPackage = 'Please select a package';
    }
    
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
    
    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword.trim() !== formData.password.trim()) {
      errors.confirmPassword = 'Passwords do not match';
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
    
    // Referral code validation - Make it optional
    if (formData.referralCode.trim() && !codeVerified) {
      errors.referralCode = 'Please verify your code first or remove it';
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

    // Special handling for password and confirm password
    if (field === 'password' || field === 'confirmPassword') {
      processedValue = value.trim();
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  const verifyReferralCode = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter a referral/coupon code');
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
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
    if (!selectedPackageData) return { discountAmount: 0, finalPrice: originalPrice };
    
    const basePrice = selectedPackageData.price;
    const discountAmount = Math.floor(basePrice * (referralData?.discount_percentage || 0) / 100);
    const finalPrice = basePrice - discountAmount;
    
    return { discountAmount, finalPrice };
  };

  const getPaymentLink = () => {
    if (!selectedPackageData) {
      return null;
    }

    // If referral data is available, use the specific payment links from the referral code
    if (referralData) {
      let paymentLink = '';
      switch (formData.selectedPackage) {
        case 'starter':
          paymentLink = referralData.payment_link || '';
          break;
        case 'professional':
          paymentLink = referralData.payment_link2 || '';
          break;
        case 'enterprise':
          paymentLink = referralData.payment_link3 || '';
          break;
        default:
          paymentLink = referralData.payment_link || '';
      }

      // If no specific payment link for the package, use the default one
      if (!paymentLink) {
        paymentLink = referralData.payment_link || '';
      }

      // If still no payment link, use default package link
      if (!paymentLink) {
        switch (formData.selectedPackage) {
          case 'starter':
            paymentLink = selectedPackageData.payment_link || '';
            break;
          case 'professional':
            paymentLink = selectedPackageData.payment_link2 || '';
            break;
          case 'enterprise':
            paymentLink = selectedPackageData.payment_link3 || '';
            break;
          default:
            paymentLink = selectedPackageData.payment_link || '';
        }
      }

      return paymentLink;
    }

    // If no referral data, use default package payment links
    switch (formData.selectedPackage) {
      case 'starter':
        return selectedPackageData.payment_link || '';
      case 'professional':
        return selectedPackageData.payment_link2 || '';
      case 'enterprise':
        return selectedPackageData.payment_link3 || '';
      default:
        return selectedPackageData.payment_link || '';
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
      const { discountAmount, finalPrice } = calculatePricing();
      const generatedPaymentLink = getPaymentLink();
      
      if (!generatedPaymentLink) {
        throw new Error('Unable to generate payment link. Please try again.');
      }
      
      // First, create user account in users table
      const userAccountData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone,
        password: formData.password.trim()
      };

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([userAccountData])
        .select();

      if (userError) {
        console.error('User creation error:', userError);
        throw new Error('Failed to create user account. Please try again.');
      }

      // Then, create enrollment record in paid_users table
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
        original_price: selectedPackageData?.price || originalPrice,
        referral_code: formData.referralCode.trim() ? formData.referralCode.toUpperCase() : null,
        referrer_name: referralData?.referrer_name || null,
        discount_percentage: referralData?.discount_percentage || 0,
        discount_amount: discountAmount,
        final_price: finalPrice,
        payment_link: generatedPaymentLink,
        payment_status: 'pending',
        ip_address: null,
        user_agent: navigator.userAgent,
        package_selected: formData.selectedPackage
      };

      const { data: enrollmentResult, error: enrollmentError } = await supabase
        .from('paid_users')
        .insert([enrollmentData])
        .select();

      if (enrollmentError) {
        console.error('Enrollment error:', enrollmentError);
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
      referralCode: '',
      selectedPackage: preSelectedPackage || '',
      password: '',
      confirmPassword: ''
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
          
          <h2 className="text-3xl font-bold text-white mb-3">Account Created & Enrollment Successful!</h2>
          <p className="text-gray-300 mb-8">
            Your account has been created and enrollment has been processed successfully
          </p>
          
          {/* Package Details */}
          {selectedPackageData && (
            <div className="bg-dark rounded-lg p-6 mb-6 border border-primary/20">
              <h3 className="text-white font-bold text-lg mb-2">{selectedPackageData.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Package Price:</span>
                  <span className="text-gray-300">₹{selectedPackageData.price.toLocaleString()}</span>
                </div>
                {referralData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-green-400">Discount ({referralData.discount_percentage}%):</span>
                      <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                      <span className="text-white">Final Price:</span>
                      <span className="text-primary">₹{finalPrice.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
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
    <div className="max-w-2xl mx-auto bg-dark-light rounded-xl p-4 md:p-8 shadow-lg border border-primary/10">
      <div className="text-center mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
          <CreditCard className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Create Account & Enroll</h2>
        <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
          Create your account and enroll in <span className="text-primary font-semibold">{courseName}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 md:p-4 rounded-lg mb-4 md:mb-6 flex items-start animate-slideDown">
          <AlertCircle className="mr-2 md:mr-3 flex-shrink-0 mt-0.5" size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Package Selection */}
        <div className="bg-dark rounded-lg p-4 md:p-6 border border-primary/20">
          <h3 className="text-white font-bold mb-3 md:mb-4 flex items-center text-sm md:text-base">
            <Package className="mr-2 text-primary" size={18} />
            Select Package
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  formData.selectedPackage === pkg.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-600 hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('selectedPackage', pkg.id)}
              >
                {pkg.badge && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-primary text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}
                <div className="text-center">
                  <h4 className="text-white font-bold text-xs md:text-sm mb-1">{pkg.name}</h4>
                  <p className="text-gray-400 text-xs mb-2">{pkg.description}</p>
                  <div className="text-primary font-bold text-sm md:text-base">₹{pkg.price.toLocaleString()}</div>
                  {pkg.originalPrice > pkg.price && (
                    <div className="text-gray-400 text-xs line-through">
                      ₹{pkg.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {validationErrors.selectedPackage && (
            <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {validationErrors.selectedPackage}
            </p>
          )}
        </div>

        {/* Referral/Coupon Code Section */}
        <div className="bg-dark rounded-lg p-4 md:p-6 border border-primary/20">
          <h3 className="text-white font-bold mb-3 md:mb-4 flex items-center text-sm md:text-base">
            <Hash className="mr-2 text-primary" size={18} />
            Referral/Coupon Code (Optional)
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 font-mono text-sm md:text-base ${
                  validationErrors.referralCode 
                    ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                    : codeVerified
                    ? 'border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
                    : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="Enter your code (optional)"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <Button
              type="button"
              onClick={() => verifyReferralCode(formData.referralCode.toUpperCase())}
              disabled={isVerifyingCode || !formData.referralCode.trim()}
              variant={codeVerified ? 'secondary' : 'primary'}
              className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
            >
              {isVerifyingCode ? (
                <Loader className="animate-spin" size={18} />
              ) : codeVerified ? (
                <CheckCircle size={18} />
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
              </div>
              
              {/* Price Calculation */}
              {selectedPackageData && (
                <div className="mt-3 pt-3 border-t border-green-500/20">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Package Price:</span>
                      <span className="text-gray-300">₹{selectedPackageData.price.toLocaleString()}</span>
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
              )}
            </div>
          )}
          
          {!formData.referralCode.trim() && selectedPackageData && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-medium">✓ No Code Applied</span>
                <span className="text-blue-400 font-bold">
                  Full Price
                </span>
              </div>
              <p className="text-gray-300 text-sm">Proceeding with standard package pricing</p>
              
              {/* Price Calculation for No Code */}
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Package Price:</span>
                    <span className="text-gray-300">₹{selectedPackageData.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-blue-500/20 pt-1">
                    <span className="text-white">Final Price:</span>
                    <span className="text-primary">₹{selectedPackageData.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="name" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <User size={16} className="mr-2 text-primary" />
              Full Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.name 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your full name"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <Mail size={16} className="mr-2 text-primary" />
              Email Address <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.email 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your email address"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <Phone size={16} className="mr-2 text-primary" />
              Phone Number <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.phone 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.phone}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.phone.length}/10 digits
            </p>
          </div>

          <div>
            <label htmlFor="age" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <Calendar size={16} className="mr-2 text-primary" />
              Age
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.age 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your age"
              min="13"
              max="100"
            />
            {validationErrors.age && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.age}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="qualification" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <GraduationCap size={16} className="mr-2 text-primary" />
              Qualification
            </label>
            <select
              id="qualification"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-all duration-300 text-sm md:text-base"
            >
              <option value="">Select qualification</option>
              {qualifications.map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="state" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <MapPin size={16} className="mr-2 text-primary" />
              State <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
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
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.state}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pincode" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <MapPin size={16} className="mr-2 text-primary" />
              Pincode <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.pincode 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            {validationErrors.pincode && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.pincode}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.pincode.length}/6 digits
            </p>
          </div>

          {/* Password and Confirm Password Fields */}
          <div>
            <label htmlFor="password" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <Hash size={16} className="mr-2 text-primary" />
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.password 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Enter your password"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium flex items-center text-sm md:text-base">
              <Hash size={16} className="mr-2 text-primary" />
              Confirm Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 text-sm md:text-base ${
                validationErrors.confirmPassword 
                  ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
              placeholder="Confirm your password"
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-3 md:py-4 text-sm md:text-base" 
          size="lg"
          glowing
          disabled={isLoading || (formData.referralCode.trim() && !codeVerified) || !formData.selectedPackage}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" size={18} />
              <span className="text-sm md:text-base">Creating Account & Processing Enrollment...</span>
            </div>
          ) : (
            <>
              <CreditCard className="mr-2" size={18} />
              <span className="text-sm md:text-base">Create Account & Enroll</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
            Need help with your referral code?
          </p>
          <a 
            href="mailto:admin@skillras.com" 
            className="text-primary hover:text-primary-light transition-colors text-xs md:text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;