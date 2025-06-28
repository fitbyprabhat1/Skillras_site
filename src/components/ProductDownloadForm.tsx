import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.productCode.trim()) {
      errors.productCode = 'Product code is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  const verifyProductCode = async (code: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data;
  };

  const saveUserData = async (userData: Omit<FormData, 'productCode'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      // Handle unique constraint violation for email
      if (error.code === '23505') {
        throw new Error('This email is already registered. Please use a different email.');
      }
      throw error;
    }
    
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verify product code
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
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (product?.download_link) {
      window.open(product.download_link, '_blank');
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
      <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
          <p className="text-gray-300 mb-6">
            Your product is ready for download
          </p>
          
          <div className="bg-dark rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">{product.product_name}</h3>
            <p className="text-sm text-gray-400">Product Code: {product.code}</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleDownload}
              className="w-full"
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
    <div className="max-w-md mx-auto bg-dark-light rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Product Download</h2>
        <p className="text-gray-300">
          Enter your details and product code to access your download
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-white mb-2 font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
              validationErrors.name 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-primary'
            }`}
            placeholder="Enter your full name"
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-white mb-2 font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
              validationErrors.email 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-primary'
            }`}
            placeholder="Enter your email address"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-white mb-2 font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
              validationErrors.phone 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-primary'
            }`}
            placeholder="Enter your phone number"
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="productCode" className="block text-white mb-2 font-medium">
            Product Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productCode"
            value={formData.productCode}
            onChange={(e) => handleInputChange('productCode', e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 rounded-lg bg-dark border text-white focus:outline-none transition-colors ${
              validationErrors.productCode 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-primary'
            }`}
            placeholder="Enter your product code"
            style={{ textTransform: 'uppercase' }}
          />
          {validationErrors.productCode && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.productCode}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            Example codes: PREMIERE2025, EDITING101, ADVANCED2025
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          glowing
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" size={20} />
              Verifying...
            </div>
          ) : (
            <>
              <Download className="mr-2" size={20} />
              Get Download Link
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-600">
        <p className="text-gray-400 text-sm text-center">
          Don't have a product code? Contact support for assistance.
        </p>
      </div>
    </div>
  );
};

export default ProductDownloadForm;