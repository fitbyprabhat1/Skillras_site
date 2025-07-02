import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  IndianRupee,
  Shield,
  FileText
} from 'lucide-react';

interface PaymentFormProps {
  courseId: string;
  courseName: string;
  originalPrice: number;
  packageType?: string;
  onPaymentSuccess?: () => void;
}

interface KYCData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  pan_number: string;
  aadhar_number: string;
  occupation: string;
  annual_income_range: string;
}

interface CouponResult {
  success: boolean;
  discount_percentage?: number;
  discount_amount?: number;
  final_price?: number;
  original_price?: number;
  message?: string;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const PaymentForm: React.FC<PaymentFormProps> = ({
  courseId,
  courseName,
  originalPrice,
  packageType = 'single_course',
  onPaymentSuccess
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [kycData, setKycData] = useState<KYCData>({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    pan_number: '',
    aadhar_number: '',
    occupation: '',
    annual_income_range: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [finalPrice, setFinalPrice] = useState(originalPrice);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [validationErrors, setValidationErrors] = useState<Partial<KYCData>>({});

  const validateKYCForm = (): boolean => {
    const errors: Partial<KYCData> = {};

    // Required field validation
    if (!kycData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!kycData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycData.email)) errors.email = 'Invalid email format';
    
    if (!kycData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[6-9][0-9]{9}$/.test(kycData.phone)) errors.phone = 'Invalid Indian mobile number';
    
    if (!kycData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!kycData.gender) errors.gender = 'Gender is required';
    if (!kycData.address_line_1.trim()) errors.address_line_1 = 'Address is required';
    if (!kycData.city.trim()) errors.city = 'City is required';
    if (!kycData.state) errors.state = 'State is required';
    
    if (!kycData.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(kycData.pincode)) errors.pincode = 'Invalid pincode format';
    
    if (!kycData.occupation.trim()) errors.occupation = 'Occupation is required';
    if (!kycData.annual_income_range) errors.annual_income_range = 'Annual income range is required';

    // Optional but validated fields
    if (kycData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(kycData.pan_number)) {
      errors.pan_number = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    
    if (kycData.aadhar_number && !/^[0-9]{12}$/.test(kycData.aadhar_number)) {
      errors.aadhar_number = 'Invalid Aadhar format (12 digits)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateKYCForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Save KYC data
      const { error: kycError } = await supabase
        .from('user_kyc')
        .upsert({
          user_id: user.id,
          ...kycData
        });

      if (kycError) throw kycError;

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to save KYC information');
    } finally {
      setLoading(false);
    }
  };

  const applyCouponCode = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Call the apply_coupon_code function
      const { data, error } = await supabase.rpc('apply_coupon_code', {
        p_code: couponCode.toUpperCase(),
        p_user_id: user.id,
        p_original_price: originalPrice
      });

      if (error) throw error;

      setCouponResult(data);
      
      if (data.success) {
        setFinalPrice(data.final_price);
        setDiscountAmount(data.discount_amount);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to apply coupon code');
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Create enrollment record
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          course_name: courseName,
          package_type: packageType,
          original_price: originalPrice,
          coupon_code: couponResult?.success ? couponCode.toUpperCase() : null,
          discount_percentage: couponResult?.discount_percentage || 0,
          final_price: finalPrice,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (enrollmentError) throw enrollmentError;

      // Get payment link based on discount percentage
      const { data: paymentUrl, error: linkError } = await supabase.rpc('get_payment_link', {
        p_discount_percentage: couponResult?.discount_percentage || 0
      });

      if (linkError) throw linkError;

      // Update enrollment with payment link
      await supabase
        .from('course_enrollments')
        .update({ payment_link_used: paymentUrl })
        .eq('id', enrollment.id);

      // Create transaction record
      await supabase
        .from('payment_transactions')
        .insert({
          enrollment_id: enrollment.id,
          amount: finalPrice,
          status: 'initiated'
        });

      // Redirect to payment gateway
      window.open(paymentUrl, '_blank');
      
      setSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-dark-light rounded-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Payment Initiated!</h2>
        <p className="text-gray-300 mb-6">
          Your payment window has been opened. Please complete the payment to access your course.
        </p>
        <div className="bg-dark rounded-lg p-6 mb-6">
          <h3 className="text-white font-bold mb-2">{courseName}</h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Final Amount:</span>
            <span className="text-primary font-bold text-lg">₹{finalPrice.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-400">You Saved:</span>
              <span className="text-green-400 font-bold">₹{discountAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-dark-light rounded-xl p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-600 text-gray-400'
          }`}>
            <FileText size={20} />
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-600'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-600 text-gray-400'
          }`}>
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Your KYC</h2>
            <p className="text-gray-300">
              Please provide your details as per Indian compliance requirements
            </p>
          </div>

          <form onSubmit={handleKYCSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={kycData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.full_name ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={kycData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="Enter your email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={kycData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={kycData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.date_of_birth ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                  />
                  {validationErrors.date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.date_of_birth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Gender *</label>
                  <select
                    value={kycData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.gender ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {validationErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                  )}
                </div>
              </div>

              {/* Address & Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <MapPin className="mr-2 text-primary" size={20} />
                  Address & Additional Details
                </h3>

                <div>
                  <label className="block text-white mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={kycData.address_line_1}
                    onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.address_line_1 ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="House/Flat No., Street"
                  />
                  {validationErrors.address_line_1 && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.address_line_1}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={kycData.address_line_2}
                    onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="Area, Landmark (Optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">City *</label>
                    <input
                      type="text"
                      value={kycData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                        validationErrors.city ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                      }`}
                      placeholder="City"
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={kycData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                        validationErrors.pincode ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                      }`}
                      placeholder="6-digit pincode"
                    />
                    {validationErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">State *</label>
                  <select
                    value={kycData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.state ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {validationErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">PAN Number</label>
                  <input
                    type="text"
                    value={kycData.pan_number}
                    onChange={(e) => handleInputChange('pan_number', e.target.value.toUpperCase().slice(0, 10))}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.pan_number ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="ABCDE1234F (Optional)"
                  />
                  {validationErrors.pan_number && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.pan_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    value={kycData.aadhar_number}
                    onChange={(e) => handleInputChange('aadhar_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.aadhar_number ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="12-digit Aadhar (Optional)"
                  />
                  {validationErrors.aadhar_number && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.aadhar_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Occupation *</label>
                  <input
                    type="text"
                    value={kycData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.occupation ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                    placeholder="Your occupation"
                  />
                  {validationErrors.occupation && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.occupation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Annual Income Range *</label>
                  <select
                    value={kycData.annual_income_range}
                    onChange={(e) => handleInputChange('annual_income_range', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
                      validationErrors.annual_income_range ? 'border-red-500' : 'border-gray-600 focus:border-primary'
                    }`}
                  >
                    <option value="">Select Income Range</option>
                    <option value="below_2_lakh">Below ₹2 Lakh</option>
                    <option value="2_5_lakh">₹2 - ₹5 Lakh</option>
                    <option value="5_10_lakh">₹5 - ₹10 Lakh</option>
                    <option value="10_25_lakh">₹10 - ₹25 Lakh</option>
                    <option value="above_25_lakh">Above ₹25 Lakh</option>
                  </select>
                  {validationErrors.annual_income_range && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.annual_income_range}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-600">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2" size={20} />
                    Saving KYC Information...
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2" size={20} />
                    Continue to Payment
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Your Payment</h2>
            <p className="text-gray-300">
              Apply coupon code and proceed to secure payment
            </p>
          </div>

          {/* Course Summary */}
          <div className="bg-dark rounded-lg p-6 mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Course:</span>
                <span className="text-white font-medium">{courseName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Original Price:</span>
                <span className="text-white">₹{originalPrice.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Discount ({couponResult?.discount_percentage}%):</span>
                    <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Final Price:</span>
                      <span className="text-primary font-bold text-xl">₹{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
              {discountAmount === 0 && (
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total Price:</span>
                    <span className="text-primary font-bold text-xl">₹{finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Coupon Code Section */}
          {!couponResult?.success && (
            <div className="bg-dark rounded-lg p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <Tag className="mr-2 text-primary" size={20} />
                Have a Coupon Code?
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-lg bg-dark-light border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter coupon code (e.g., PRABHAT100)"
                />
                <Button 
                  onClick={applyCouponCode}
                  disabled={loading || !couponCode.trim()}
                  variant="outline"
                >
                  {loading ? <Loader className="animate-spin" size={16} /> : 'Apply'}
                </Button>
              </div>
            </div>
          )}

          {/* Applied Coupon */}
          {couponResult?.success && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <div>
                    <h4 className="text-white font-bold">Coupon Applied Successfully!</h4>
                    <p className="text-green-400 text-sm">
                      Code: {couponCode} • {couponResult.discount_percentage}% discount
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCouponResult(null);
                    setCouponCode('');
                    setFinalPrice(originalPrice);
                    setDiscountAmount(0);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <div className="space-y-4">
            <Button 
              onClick={proceedToPayment}
              className="w-full" 
              size="lg"
              glowing
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  Processing...
                </div>
              ) : (
                <>
                  <IndianRupee className="mr-2" size={20} />
                  Pay ₹{finalPrice.toLocaleString()} Securely
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              <p>🔒 Secure payment powered by Razorpay</p>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;