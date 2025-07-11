// ... existing imports remain unchanged
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
  Tag
} from 'lucide-react';

// Form and CouponData interfaces remain unchanged
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

// Static lists
const indianStates = [/* unchanged */];
const qualifications = [/* unchanged */];
const packages = [
  { label: 'Select a package', value: '' },
  { label: 'Basic Package', value: 'basic', link: 'https://yourdomain.com/paymentLink1' },
  { label: 'Standard Package', value: 'standard', link: 'https://yourdomain.com/paymentLink2' },
  { label: 'Premium Package', value: 'premium', link: 'https://yourdomain.com/paymentLink3' }
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

  const [packageType, setPackageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  const getPaymentLink = (): string => {
    const selected = packages.find(pkg => pkg.value === packageType);
    return selected?.link || '';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    if (field === 'phone') processedValue = value.replace(/\D/g, '').slice(0, 10);
    if (field === 'pincode') processedValue = value.replace(/\D/g, '').slice(0, 6);
    if (field === 'age') processedValue = value.replace(/\D/g, '').slice(0, 3);
    if (field === 'couponCode') {
      processedValue = value.toUpperCase();
      if (processedValue !== formData.couponCode) {
        setCodeVerified(false);
        setCouponData(null);
      }
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (error) setError(null);
  };

  const handlePackageChange = (value: string) => {
    setPackageType(value);
    setError(null);
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

      if (error) throw new Error(error.message || 'Code verification failed');
      if (data.valid_until && new Date(data.valid_until) < new Date()) throw new Error('This code has expired.');
      if (data.max_usage && data.current_usage >= data.max_usage) throw new Error('This code has reached its usage limit.');

      setCouponData(data);
      setCodeVerified(true);
    } catch (err: any) {
      setCodeVerified(false);
      setCouponData(null);
      setError(err.message || 'Error verifying code.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const link = getPaymentLink();

    if (!link) {
      setError('Please select a package to proceed');
      return;
    }

    if (!codeVerified) {
      setError('Please verify your coupon code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
        code_used: formData.couponCode.toUpperCase(),
        code_type: couponData?.code_type || null,
        discount_applied: couponData?.discount_percentage || couponData?.discount_amount || 0,
        package_selected: packageType,
        payment_link: link,
        ip_address: null,
        user_agent: navigator.userAgent
      };

      const { error: supabaseError } = await supabase
        .from('payment_form_submissions')
        .insert([submissionData]);

      if (supabaseError) throw new Error('Submission failed. Try again.');

      window.location.href = link;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-dark-light p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-white mb-4">Payment Form</h2>

      {/* Package Dropdown */}
      <div>
        <label htmlFor="package" className="block text-white mb-2 font-medium">
          Select Package <span className="text-red-500">*</span>
        </label>
        <select
          id="package"
          value={packageType}
          onChange={(e) => handlePackageChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {packages.map(pkg => (
            <option key={pkg.value} value={pkg.value}>{pkg.label}</option>
          ))}
        </select>
      </div>

      {/* Coupon Code */}
      <div>
        <label htmlFor="couponCode" className="block text-white mb-2 font-medium">Coupon/Affiliate Code</label>
        <div className="flex gap-2">
          <input
            id="couponCode"
            type="text"
            value={formData.couponCode}
            onChange={(e) => handleInputChange('couponCode', e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white"
            placeholder="Enter code"
          />
          <Button 
            type="button" 
            onClick={verifyCouponCode}
            disabled={isVerifyingCode || !formData.couponCode}
          >
            {isVerifyingCode ? <Loader className="animate-spin" size={20} /> : 'Verify'}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-2" /> {error}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isLoading || !packageType || !codeVerified} glowing className="w-full">
        {isLoading ? (
          <div className="flex items-center">
            <Loader className="animate-spin mr-2" size={20} />
            Processing...
          </div>
        ) : (
          <>
            <CreditCard className="mr-2" size={20} />
            Proceed to Payment
          </>
        )}
      </Button>
    </form>
  );
};

export default PaymentForm;
