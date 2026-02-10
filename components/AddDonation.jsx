'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, DollarSign, Calendar, FileText, 
  MapPin, CreditCard, Building, CheckCircle, AlertCircle, 
  Loader2, IndianRupee, Save, RotateCcw, Wifi, WifiOff, UserCheck
} from 'lucide-react';

// Input field component - DEFINED OUTSIDE main component to prevent re-creation
const InputField = ({ label, name, type = 'text', icon: Icon, required, placeholder, value, onChange, error, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Select field component - DEFINED OUTSIDE main component to prevent re-creation
const SelectField = ({ label, name, options, icon: Icon, required, value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

// Toggle component for Anonymous
const ToggleField = ({ label, name, checked, onChange, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange({ target: { name, value: !checked } })}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const AddDonation = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('online'); // 'online' | 'offline'

  // Online donation form state (existing)
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    paymentType: 'one_time',
    transactionId: '',
    currency: 'INR',
    amount: '',
    transactionFee: '',
    cause: '',
    country: 'India',
    address: '',
    zip: '',
    pan: '',
    paymentStatus: 'completed',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: ''
  });

  // Offline donation form state (new - simpler)
  const [offlineData, setOfflineData] = useState({
    fullName: '',
    email: '',
    amount: '',
    currency: 'INR',
    spoc: '',
    cause: '',
    anonymous: false,
    reference: ''
  });

  // UI state
  const [causes, setCauses] = useState([]);
  const [spocs, setSpocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [offlineErrors, setOfflineErrors] = useState({});

  // Fetch causes for dropdown
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await fetch('/api/causes');
        const data = await res.json();
        if (data.causes) {
          setCauses(data.causes);
          if (data.causes.length > 0) {
            // Set default cause for online form
            if (!formData.cause) {
              setFormData(prev => ({ ...prev, cause: data.causes[0] }));
            }
            // Set default cause for offline form
            setOfflineData(prev => ({ ...prev, cause: prev.cause || data.causes[0] }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch causes:', error);
      }
    };
    fetchCauses();
  }, []);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Auto-fill first/last name from full name
  const handleFullNameBlur = useCallback(() => {
    if (formData.fullName && (!formData.firstName || !formData.lastName)) {
      const parts = formData.fullName.trim().split(' ');
      if (parts.length >= 2) {
        setFormData(prev => ({
          ...prev,
          firstName: prev.firstName || parts[0],
          lastName: prev.lastName || parts.slice(1).join(' ')
        }));
      } else if (parts.length === 1) {
        setFormData(prev => ({
          ...prev,
          firstName: prev.firstName || parts[0]
        }));
      }
    }
  }, [formData.fullName, formData.firstName, formData.lastName]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }

    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FullName: formData.fullName,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          Mobile: formData.mobile,
          PaymentType: formData.paymentType,
          TransactionId: formData.transactionId,
          Currency: formData.currency,
          Amount: parseFloat(formData.amount),
          TransactionFee: parseFloat(formData.transactionFee) || 0,
          Cause: formData.cause,
          Country: formData.country,
          Address: formData.address,
          ZIP: formData.zip,
          PAN: formData.pan.toUpperCase(),
          PaymentStatus: formData.paymentStatus,
          PaymentDate: formData.paymentDate,
          Reference: formData.reference
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(`Donation added successfully! Receipt ID: ${result.receiptId}`);
        handleReset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Failed to add donation');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = useCallback(() => {
    setFormData({
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      paymentType: 'one_time',
      transactionId: '',
      currency: 'INR',
      amount: '',
      transactionFee: '',
      cause: causes[0] || '',
      country: 'India',
      address: '',
      zip: '',
      pan: '',
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: ''
    });
    setErrors({});
  }, [causes]);

  // ==================== OFFLINE DONATION HANDLERS ====================

  // Handle offline form input changes
  const handleOfflineChange = useCallback((e) => {
    const { name, value } = e.target;
    setOfflineData(prev => ({ ...prev, [name]: value }));
    if (offlineErrors[name]) {
      setOfflineErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [offlineErrors]);

  // Validate offline form
  const validateOfflineForm = useCallback(() => {
    const newErrors = {};
    
    if (!offlineData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!offlineData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(offlineData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!offlineData.amount || parseFloat(offlineData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!offlineData.cause) {
      newErrors.cause = 'Cause is required';
    }

    setOfflineErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [offlineData]);

  // Handle offline form submission
  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOfflineForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/offline-donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FullName: offlineData.fullName,
          Email: offlineData.email,
          Amount: parseInt(offlineData.amount),
          Currency: offlineData.currency,
          Spoc: offlineData.spoc,
          Cause: offlineData.cause,
          Anonymous: offlineData.anonymous ? 1 : 0,
          Reference: offlineData.reference
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(`Offline donation added successfully! ID: ${result.id}`);
        handleOfflineReset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Failed to add donation');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset offline form
  const handleOfflineReset = useCallback(() => {
    setOfflineData({
      fullName: '',
      email: '',
      amount: '',
      currency: 'INR',
      spoc: '',
      cause: causes[0] || '',
      anonymous: false,
      reference: ''
    });
    setOfflineErrors({});
  }, [causes]);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Add Donation</h1>
        <p className="text-gray-600 mt-1">Add online or offline donation records</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('online'); setSubmitStatus(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
            activeTab === 'online'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Wifi className="w-5 h-5" />
          Online Donation
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('offline'); setSubmitStatus(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
            activeTab === 'offline'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <WifiOff className="w-5 h-5" />
          Offline Donation
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          submitStatus === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{submitMessage}</span>
        </div>
      )}

      {/* ==================== OFFLINE DONATION FORM ==================== */}
      {activeTab === 'offline' && (
        <form onSubmit={handleOfflineSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-orange-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-orange-600" />
              Offline Donation Details
            </h2>
            <p className="text-sm text-gray-600">Record offline/cash donations collected outside the payment gateway</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Full Name" 
                name="fullName" 
                icon={User} 
                required 
                placeholder="Donor Name"
                value={offlineData.fullName}
                onChange={handleOfflineChange}
                error={offlineErrors.fullName}
              />
              <InputField 
                label="Email" 
                name="email" 
                type="email" 
                icon={Mail} 
                required 
                placeholder="donor@example.com"
                value={offlineData.email}
                onChange={handleOfflineChange}
                error={offlineErrors.email}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {offlineData.currency === 'INR' ? (
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={offlineData.amount}
                    onChange={handleOfflineChange}
                    placeholder="10000"
                    min="1"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                      offlineErrors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {offlineErrors.amount && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {offlineErrors.amount}
                  </p>
                )}
              </div>
              <SelectField 
                label="Currency" 
                name="currency"
                value={offlineData.currency}
                onChange={handleOfflineChange}
                options={[
                  { value: 'INR', label: '₹ INR - Indian Rupee' },
                  { value: 'USD', label: '$ USD - US Dollar' }
                ]}
              />
              <InputField 
                label="SPOC (Single Point of Contact)" 
                name="spoc" 
                icon={UserCheck}
                placeholder="Contact person name"
                value={offlineData.spoc}
                onChange={handleOfflineChange}
                error={offlineErrors.spoc}
              />
              <SelectField 
                label="Cause/Fund" 
                name="cause"
                required
                value={offlineData.cause}
                onChange={handleOfflineChange}
                options={causes.length > 0 
                  ? causes.map(c => ({ value: c, label: c }))
                  : [{ value: '', label: 'Loading causes...' }]
                }
              />
              <div className="md:col-span-2">
                <InputField 
                  label="Reference / Notes" 
                  name="reference" 
                  placeholder="Cash, Cheque #, Bank Transfer, etc."
                  value={offlineData.reference}
                  onChange={handleOfflineChange}
                  error={offlineErrors.reference}
                />
              </div>
              <div className="md:col-span-2">
                <ToggleField
                  label="Anonymous Donation"
                  name="anonymous"
                  checked={offlineData.anonymous}
                  onChange={handleOfflineChange}
                  description="Donor wishes to remain anonymous"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 border-t">
            <button
              type="button"
              onClick={handleOfflineReset}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2.5 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Offline Donation
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ==================== ONLINE DONATION FORM ==================== */}
      {activeTab === 'online' && (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Donor Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Donor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField 
              label="Full Name" 
              name="fullName" 
              icon={User} 
              required 
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              onBlur={handleFullNameBlur}
            />
            <InputField 
              label="First Name" 
              name="firstName" 
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <InputField 
              label="Last Name" 
              name="lastName" 
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              icon={Mail} 
              required 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField 
              label="Mobile" 
              name="mobile" 
              type="tel" 
              icon={Phone} 
              placeholder="+91 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />
            <InputField 
              label="PAN" 
              name="pan" 
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
              value={formData.pan}
              onChange={handleChange}
              error={errors.pan}
            />
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.currency === 'INR' ? (
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="10000"
                  min="1"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount}
                </p>
              )}
            </div>

            <SelectField 
              label="Currency" 
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={[
                { value: 'INR', label: '₹ INR - Indian Rupee' },
                { value: 'USD', label: '$ USD - US Dollar' }
              ]}
            />

            <InputField 
              label="Transaction Fee" 
              name="transactionFee" 
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              value={formData.transactionFee}
              onChange={handleChange}
              error={errors.transactionFee}
            />

            <SelectField 
              label="Payment Type" 
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              options={[
                { value: 'one_time', label: 'One Time' },
                { value: 'recurring', label: 'Recurring' }
              ]}
            />

            <SelectField 
              label="Payment Status" 
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              options={[
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'failed', label: 'Failed' }
              ]}
            />

            <InputField 
              label="Payment Date" 
              name="paymentDate" 
              type="date" 
              icon={Calendar}
              required
              value={formData.paymentDate}
              onChange={handleChange}
              error={errors.paymentDate}
            />

            <InputField 
              label="Transaction ID" 
              name="transactionId" 
              placeholder="TXN123456"
              value={formData.transactionId}
              onChange={handleChange}
              error={errors.transactionId}
            />

            <SelectField 
              label="Cause/Fund" 
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              options={causes.length > 0 
                ? causes.map(c => ({ value: c, label: c }))
                : [{ value: '', label: 'Loading causes...' }]
              }
            />

            <InputField 
              label="Reference" 
              name="reference" 
              placeholder="Bank Transfer, UPI, Cheque, etc."
              value={formData.reference}
              onChange={handleChange}
              error={errors.reference}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Address Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputField 
                label="Address" 
                name="address" 
                icon={MapPin}
                placeholder="123 Main Street, City"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>
            <InputField 
              label="ZIP/Postal Code" 
              name="zip" 
              placeholder="400001"
              value={formData.zip}
              onChange={handleChange}
              error={errors.zip}
            />
            <SelectField 
              label="Country" 
              name="country"
              icon={Building}
              value={formData.country}
              onChange={handleChange}
              options={[
                { value: 'India', label: 'India' },
                { value: 'USA', label: 'United States' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'Canada', label: 'Canada' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Online Donation
              </>
            )}
          </button>
        </div>
      </form>
      )}
    </div>
  );
};

export default AddDonation;
