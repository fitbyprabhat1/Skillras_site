import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { 
  CreditCard, 
  Tag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
  IndianRupee
} from 'lucide-react';

interface PaymentFormProps {
  courseId: string;
  courseName: string;
  originalPrice: number;
  packageType?: 'single_course' | 'package';
  onPaymentSuccess?: () => void;
}

interface KYCData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  panNumber: string;
  aadharNumber: string;
  occupation: string;
  annualIncomeRange: string;
}

interface CouponResult {
  success: boolean;
  message?: string;
  discount_percentage?: number;
  discount_amount?: number;
  final_price?: number;
  original_price?: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  courseId,
  courseName,
  originalPrice,
  packageType = 'single_course',
  onPaymentSuccess
}) => {
  const [step, setStep] = useState(1); // 1: KYC, 2: Coupon, 3: Payment
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // KYC Form Data
  const [kycData, setKycData] = useState<KYCData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    panNumber: '',
    aadharNumber: '',
    occupation: '',
    annualIncomeRange: ''
  });

  // Coupon and Payment Data
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [finalPrice, setFinalPrice] = useState(originalPrice);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Andaman and Nicobar Islands'
  ];

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to continue');
      }

      // Submit KYC data
      const { error: kycError } = await supabase
        .from('user_kyc')
        .upsert({
          user_id: user.id,
          full_name: kycData.fullName,
          email: kycData.email,
          phone: kycData.phone,
          date_of_birth: kycData.dateOfBirth,
          gender: kycData.gender,
          address_line_1: kycData.addressLine1,
          address_line_2: kycData.addressLine2,
          city: kycData.city,
          state: kycData.state,
          pincode: kycData.pincode,
          pan_number: kycData.panNumber || null,
          aadhar_number: kycData.aadharNumber || null,
          occupation: kycData.occupation,
          annual_income_range: kycData.annualIncomeRange,
          kyc_status: 'verified'
        });

      if (kycError) throw kycError;

      setSuccess('KYC information saved successfully!');
      setTimeout(() => {
        setStep(2);
        setSuccess(null);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to save KYC information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCouponApply = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
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

      const result = data as CouponResult;
      setCouponResult(result);

      if (result.success) {
        setFinalPrice(result.final_price || originalPrice);
        setDiscountPercentage(result.discount_percentage || 0);
        setSuccess(`Coupon applied! You saved ₹${result.discount_amount}`);
      } else {
        setError(result.message || 'Invalid coupon code');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to apply coupon code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
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
          package_type: packageType,
          original_price: originalPrice,
          coupon_code: couponCode || null,
          discount_percentage: discountPercentage,
          final_price: finalPrice,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (enrollmentError) throw enrollmentError;

      // Get payment link based on discount percentage
      const { data: paymentUrl, error: linkError } = await supabase.rpc('get_payment_link', {
        p_discount_percentage: discountPercentage
      });

      if (linkError) throw linkError;

      // Update enrollment with payment link
      await supabase
        .from('course_enrollments')
        .update({ payment_link_used: paymentUrl })
        .eq('id', enrollment.id);

      // Create payment transaction record
      await supabase
        .from('payment_transactions')
        .insert({
          enrollment_id: enrollment.id,
          amount: finalPrice,
          status: 'initiated'
        });

      // Redirect to payment gateway
      window.open(paymentUrl, '_blank');
      
      setSuccess('Redirecting to payment gateway...');
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  // Step 1: KYC Form
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto bg-dark-light rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-primary" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Complete Your KYC</h2>
          <p className="text-gray-300">
            Please provide your details as per Indian KYC norms to proceed with enrollment
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6 flex items-start">
            <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleKYCSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2 font-medium flex items-center">
                <User size={16} className="mr-2 text-primary" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                value={kycData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium flex items-center">
                <Mail size={16} className="mr-2 text-primary" />
                Email Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                required
                value={kycData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium flex items-center">
                <Phone size={16} className="mr-2 text-primary" />
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[6-9][0-9]{9}"
                value={kycData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium flex items-center">
                <Calendar size={16} className="mr-2 text-primary" />
                Date of Birth
              </label>
              <input
                type="date"
                value={kycData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Gender
              </label>
              <select
                value={kycData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Occupation
              </label>
              <input
                type="text"
                value={kycData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Your occupation"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <MapPin size={20} className="mr-2 text-primary" />
              Address Information
            </h3>

            <div>
              <label className="block text-white mb-2 font-medium">
                Address Line 1 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                value={kycData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="House/Flat No., Street Name"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Address Line 2
              </label>
              <input
                type="text"
                value={kycData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Area, Landmark (Optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  City <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kycData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  State <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  required
                  value={kycData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Pincode <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={kycData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
          </div>

          {/* Identity Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Identity Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  PAN Number
                </label>
                <input
                  type="text"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  value={kycData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                  placeholder="ABCDE1234F"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  pattern="[0-9]{12}"
                  value={kycData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                  placeholder="12-digit Aadhar number"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                Annual Income Range
              </label>
              <select
                value={kycData.annualIncomeRange}
                onChange={(e) => handleInputChange('annualIncomeRange', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Income Range</option>
                <option value="below_2_lakh">Below ₹2 Lakh</option>
                <option value="2_5_lakh">₹2 - ₹5 Lakh</option>
                <option value="5_10_lakh">₹5 - ₹10 Lakh</option>
                <option value="10_25_lakh">₹10 - ₹25 Lakh</option>
                <option value="above_25_lakh">Above ₹25 Lakh</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            glowing
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin mr-2" size={20} />
                Saving KYC Information...
              </div>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Step 2: Coupon Code and Payment
  return (
    <div className="max-w-lg mx-auto bg-dark-light rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="text-primary" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Complete Payment</h2>
        <p className="text-gray-300">
          Apply coupon code and proceed to payment
        </p>
      </div>

      {/* Course Details */}
      <div className="bg-dark rounded-lg p-6 mb-6">
        <h3 className="text-white font-bold text-lg mb-2">{courseName}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Original Price:</span>
            <span className={couponResult?.success ? 'line-through' : ''}>₹{originalPrice.toLocaleString()}</span>
          </div>
          {couponResult?.success && (
            <>
              <div className="flex justify-between text-green-400">
                <span>Discount ({discountPercentage}%):</span>
                <span>-₹{couponResult.discount_amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-primary font-bold text-xl">
                <span>Final Price:</span>
                <span>₹{finalPrice.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6 flex items-start">
          <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Coupon Code Section */}
      <div className="mb-6">
        <label className="block text-white mb-2 font-medium flex items-center">
          <Tag size={16} className="mr-2 text-primary" />
          Coupon Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
            placeholder="Enter coupon code"
            disabled={couponResult?.success}
          />
          <Button 
            onClick={handleCouponApply}
            disabled={isLoading || couponResult?.success}
            variant="outline"
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : 'Apply'}
          </Button>
        </div>
        {couponResult?.success && (
          <p className="text-green-400 text-sm mt-2">
            ✓ Coupon applied successfully! You saved ₹{couponResult.discount_amount}
          </p>
        )}
      </div>

      {/* Payment Button */}
      <Button 
        onClick={handlePayment}
        className="w-full" 
        size="lg"
        glowing
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin mr-2" size={20} />
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <IndianRupee className="mr-2" size={20} />
            Pay ₹{finalPrice.toLocaleString()}
          </div>
        )}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🔒 Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;