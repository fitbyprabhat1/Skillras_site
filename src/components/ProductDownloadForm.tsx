import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { Download, CheckCircle, AlertCircle, Loader, Phone, Mail, User, Hash } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  productCode: string;
}

interface Product {
  id: string;
  code: string;
  download_link: string;
  product_name: string;
  description?: string;
}

const ProductDownloadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    productCode: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
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
    
    // Phone validation - exactly 10 digits
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      errors.phone = 'Please enter a valid Indian mobile number';
    }
    
    // Product code validation
    if (!formData.productCode.trim()) {
      errors.productCode = 'Product code is required';
    } else if (formData.productCode.trim().length < 3) {
      errors.productCode = 'Product code must be at least 3 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;
    
    // Special handling for phone number - only allow digits and limit to 10
    if (field === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    // Special handling for product code - convert to uppercase
    if (field === 'productCode') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  const verifyProductCode = async (code: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Product verification error:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error verifying product code:', err);
      return null;
    }
  };

  const saveUserData = async (userData: Omit<FormData, 'productCode'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name.trim(),
          email: userData.email.toLowerCase().trim(),
          phone: userData.phone
        }])
        .select()
        .single();
      
      if (error) {
        console.error('User data save error:', error);
        // Handle unique constraint violation for email
        if (error.code === '23505') {
          throw new Error('This email is already registered. Please use a different email.');
        }
        throw new Error('Failed to save user data. Please try again.');
      }
      
      return data;
    } catch (err) {
      console.error('Error saving user data:', err);
      throw err;
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
      // Verify product code first
      const productData = await verifyProductCode(formData.productCode);
      
      if (!productData) {
        throw new Error('Invalid product code. Please check your code and try again.');
      }
      
      // Save user data
      await saveUserData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setProduct(productData);
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (product?.download_link) {
      window.open(product.download_link, '_blank', 'noopener,noreferrer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      productCode: ''
    });
    setSuccess(false);
    setProduct(null);
    setError(null);
    setValidationErrors({});
  };

  if (success && product) {
    return (
      <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-green-500/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">Success!</h2>
          <p className="text-gray-300 mb-8">
            Your product is ready for download
          </p>
          
          <div className="bg-dark rounded-lg p-6 mb-8 border border-primary/20">
            <h3 className="text-white font-bold text-lg mb-2">{product.product_name}</h3>
            {product.description && (
              <p className="text-gray-300 text-sm mb-3">{product.description}</p>
            )}
            <div className="flex items-center justify-center text-primary">
              <Hash size={16} className="mr-1" />
              <span className="font-mono text-sm">{product.code}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleDownload}
              className="w-full"
              size="lg"
              glowing
            >
              <Download className="mr-2" size={20} />
              Download Now
            </Button>
            
            <Button 
              onClick={resetForm}
              variant="outline"
              className="w-full"
            >
              Download Another Product
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg border border-primary/10">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Download className="text-primary" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Product Download</h2>
        <p className="text-gray-300">
          Enter your details and product code to access your download
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start animate-slideDown">
          <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            maxLength={50}
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
            {formData.phone.length}/10 digits • Indian mobile numbers only
          </p>
        </div>

        <div>
          <label htmlFor="productCode" className="block text-white mb-2 font-medium flex items-center">
            <Hash size={16} className="mr-2 text-primary" />
            Product Code <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="productCode"
            value={formData.productCode}
            onChange={(e) => handleInputChange('productCode', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-all duration-300 font-mono ${
              validationErrors.productCode 
                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            placeholder="Enter your product code"
            style={{ textTransform: 'uppercase' }}
            maxLength={20}
          />
          {validationErrors.productCode && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.productCode}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            Example: PREMIERE2025, EDITING101, ADVANCED2025
          </p>
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
              Verifying Code...
            </div>
          ) : (
            <>
              <Download className="mr-2" size={20} />
              Get Download Link
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Don't have a product code?
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

export default ProductDownloadForm;