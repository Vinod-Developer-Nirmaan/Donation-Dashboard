'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Download, Upload, Mail, Eye, Trash2, X, 
  User, MapPin, CreditCard, FileText, AlertCircle, 
  CheckCircle, Loader2, ChevronRight, Search 
} from 'lucide-react';
import PaymentFilters from './PaymentFilters';

// Payment Details Sidebar Component
const PaymentDetailsSidebar = ({ payment, onClose, loading }) => {
  if (!payment && !loading) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003c7a] via-[#005bb5] to-[#005bb5] px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              {payment && (
                <p className="text-white/80 text-sm mt-1">Receipt: {payment.ReceiptId}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] sm:h-[calc(100%-88px)] p-4 sm:p-6 space-y-4 sm:space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-[#003c7a] animate-spin" />
              <p className="mt-4 text-gray-600">Loading payment details...</p>
            </div>
          ) : payment ? (
            <>
              {/* Donor Details Section */}
              <div className="bg-gradient-to-br from-[#003c7a]/5 to-[#005bb5]/10 rounded-xl p-4 sm:p-5 border border-[#003c7a]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#003c7a] to-[#005bb5] rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Donor Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <DetailItem label="Full Name" value={payment.FullName} />
                  <DetailItem label="First Name" value={payment.FirstName} />
                  <DetailItem label="Last Name" value={payment.LastName} />
                  <DetailItem label="Email" value={payment.Email} />
                  <DetailItem label="Mobile" value={payment.Mobile} />
                  <DetailItem label="PAN" value={payment.PAN} />
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-5 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <DetailItem label="Country" value={payment.Country} />
                  <DetailItem label="ZIP Code" value={payment.ZIP} />
                  <div className="col-span-2">
                    <DetailItem label="Address" value={payment.Address} />
                  </div>
                </div>
              </div>

              {/* Donation Details Section */}
              <div className="bg-gradient-to-br from-[#ffbc00]/10 to-[#ffbc00]/20 rounded-xl p-4 sm:p-5 border border-[#ffbc00]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#ffbc00] to-[#ff9500] rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Donation Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <DetailItem label="Cause" value={payment.Cause} />
                  <DetailItem label="Currency" value={payment.Currency} />
                  <DetailItem 
                    label="Amount" 
                    value={new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.Currency || 'USD'
                    }).format(payment.Amount)} 
                    highlight
                  />
                  <DetailItem 
                    label="Transaction Fee" 
                    value={new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.Currency || 'USD'
                    }).format(payment.TransactionFee || 0)} 
                  />
                  <DetailItem label="Payment Type" value={payment.PaymentType} />
                  <DetailItem 
                    label="Status" 
                    value={payment.PaymentStatus}
                    status={payment.PaymentStatus}
                  />
                </div>
              </div>

              {/* Transaction Info Section */}
              <div className="bg-gradient-to-br from-[#003c7a]/5 to-[#005bb5]/10 rounded-xl p-4 sm:p-5 border border-[#003c7a]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-[#003c7a] to-[#0070d1] rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Transaction Info</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <DetailItem label="Receipt ID" value={payment.ReceiptId} />
                  <DetailItem label="Transaction ID" value={payment.TransactionId} />
                  <DetailItem 
                    label="Payment Date" 
                    value={payment.PaymentDate ? new Date(payment.PaymentDate).toLocaleString() : '-'} 
                  />
                  <DetailItem label="Reference" value={payment.Reference} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

// Detail Item Component
const DetailItem = ({ label, value, highlight, status }) => {
  const getStatusColor = (s) => {
    switch(s?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      {status ? (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {value || '-'}
        </span>
      ) : (
        <p className={`text-sm ${highlight ? 'text-lg font-bold text-[#003c7a]' : 'text-gray-800'}`}>
          {value || '-'}
        </p>
      )}
    </div>
  );
};

// Bulk Upload Modal Component - Slide-in Panel
const BulkUploadModal = ({ 
  show, 
  onClose, 
  progress, 
  status, 
  results, 
  errors,
  selectedFile,
  setSelectedFile,
  sendEmail,
  setSendEmail,
  saveToDatabase,
  setSaveToDatabase,
  bulkDownload,
  setBulkDownload,
  onUpload,
  onDownloadSample 
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" 
        onClick={status !== 'uploading' ? onClose : undefined} 
      />
      
      {/* Slide-in Panel from Right */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Upload</h2>
            {!status && (
              <p className="text-gray-500 text-sm mt-1">Select excel file to bulk upload payments data.</p>
            )}
          </div>
          {status !== 'uploading' && (
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Processing States */}
          {status === 'uploading' && (
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-gray-700 text-lg">Uploading records...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Upload Successful!</h3>
                <p className="text-gray-600 mt-1">
                  {results?.inserted || 0} records uploaded successfully
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Done
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 py-8">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <span className="font-medium text-lg">Upload Failed</span>
              </div>
              {errors && errors.length > 0 && (
                <div className="max-h-48 overflow-y-auto bg-red-50 rounded-lg p-4">
                  {errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-700 py-1">{error}</p>
                  ))}
                </div>
              )}
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          )}

          {status === 'validating' && (
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <span className="text-gray-700">Validating file...</span>
            </div>
          )}

          {/* Form View - Shows when no status (idle state) */}
          {!status && (
            <div className="space-y-6">
              {/* Download Sample Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-blue-700 font-semibold mb-2">Download Sample File</h3>
                <p className="text-sm text-blue-600 mb-4">
                  Click download button to download a sample excel file and fill all the details, 
                  then upload it to generate receipts.
                </p>
                <button
                  onClick={onDownloadSample}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* File Input - Horizontal Layout */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <label className="text-sm font-medium text-gray-700">
                  Select Excel File:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="bulk-file-input"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="bulk-file-input"
                    className="px-4 py-1.5 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50 transition"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Send Email Toggle - Horizontal Layout */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <label className="text-sm font-medium text-gray-700">
                  Send eMail?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSendEmail(!sendEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      sendEmail ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                        sendEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-500">Receipts are directly sent to donors</span>
                </div>
              </div>

              {/* Save to Database Toggle - Horizontal Layout */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <label className="text-sm font-medium text-gray-700">
                  Save on Database?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSaveToDatabase(!saveToDatabase)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      saveToDatabase ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                        saveToDatabase ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-500">These donations are shown in payments.</span>
                </div>
              </div>

              {/* Bulk Download Toggle - Horizontal Layout */}
              <div className="flex items-center justify-between py-3">
                <label className="text-sm font-medium text-gray-700">
                  Bulk Download?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBulkDownload(!bulkDownload)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      bulkDownload ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                        bulkDownload ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-500">It will download all receipts as zip file.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Only show for form view */}
        {!status && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onUpload}
              disabled={!selectedFile}
              className={`px-6 py-2.5 rounded-lg transition font-medium ${
                selectedFile
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Main PaymentsView Component
const PaymentsView = React.memo(({ payments: initialPayments, loading: initialLoading, fetchPayments: parentFetchPayments, fetchStats, userRole }) => {
  const [filters, setFilters] = useState({
    search: '',
    cause: 'All',
    status: 'All',
    currency: 'All',
    reference: 'All',
    paymentType: 'All',
    startDate: '',
    endDate: ''
  });
  const [displayCount, setDisplayCount] = useState(50);
  
  // Local payments state for filtered results
  const [localPayments, setLocalPayments] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Payment Details State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Bulk Upload State
  const fileInputRef = useRef(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const [bulkDownload, setBulkDownload] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadResults, setUploadResults] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);

  // Fetch payments with server-side filtering
  const fetchFilteredPayments = useCallback(async () => {
    setLocalLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '100000'); // Increased limit for better filtering
      if (filters.startDate) {
        params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.set('endDate', filters.endDate);
      }
      if (filters.cause !== 'All') {
        params.set('cause', filters.cause);
      }
      if (filters.status !== 'All') {
        params.set('status', filters.status);
      }
      if (filters.currency !== 'All') {
        params.set('currency', filters.currency);
      }
      if (filters.reference !== 'All') {
        params.set('reference', filters.reference);
      }
      if (filters.paymentType !== 'All') {
        params.set('paymentType', filters.paymentType);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      const response = await fetch(`/api/payments?${params.toString()}`);
      const result = await response.json();
      
      setLocalPayments(Array.isArray(result.data) ? result.data : []);
      setTotalCount(result.total || 0);
    } catch (error) {
      console.error('Error fetching filtered payments:', error);
      setLocalPayments([]);
    } finally {
      setLocalLoading(false);
    }
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.cause !== 'All' || 
           filters.status !== 'All' || 
           filters.currency !== 'All' || 
           filters.reference !== 'All' || 
           filters.search !== '' ||
           filters.paymentType !== 'All' || 
           filters.startDate !== '' ||
            filters.endDate !== '';
  }, [filters]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedPayments([]);
  }, [filters]);

  // Debounced fetch for search input - only fetch when filters are active
  useEffect(() => {
    if (!hasActiveFilters) {
      // Reset to initial payments when no filters
      setLocalPayments([]);
      setTotalCount(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchFilteredPayments();
    }, filters.search ? 300 : 0); // Debounce search, immediate for other filters

    return () => clearTimeout(timeoutId);
  }, [fetchFilteredPayments, hasActiveFilters, filters.search]);

  // Use local payments if we have filters active, otherwise use initial payments
  const payments = hasActiveFilters ? localPayments : initialPayments;
  const loading = localLoading || initialLoading;

  // Only render displayCount items for performance
  const displayedPayments = useMemo(() => {
    return payments.slice(0, displayCount);
  }, [payments, displayCount]);

  // Check if all displayed payments are selected
  const isAllSelected = useMemo(() => {
    return displayedPayments.length > 0 && 
           displayedPayments.every(p => selectedPayments.includes(p.PaymentId));
  }, [displayedPayments, selectedPayments]);

  // Handle Select All toggle
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      // Deselect all displayed payments
      setSelectedPayments(prev => 
        prev.filter(id => !displayedPayments.find(p => p.PaymentId === id))
      );
    } else {
      // Select all displayed payments
      const displayedIds = displayedPayments.map(p => p.PaymentId);
      setSelectedPayments(prev => [...new Set([...prev, ...displayedIds])]);
    }
  }, [isAllSelected, displayedPayments]);

  // Handle individual row selection
  const handleSelectOne = useCallback((paymentId) => {
    setSelectedPayments(prev => {
      if (prev.includes(paymentId)) {
        return prev.filter(id => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  }, []);

  const formatCurrency = useCallback((amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // View Payment Details Handler
  const handleViewDetails = useCallback(async (paymentId) => {
    setDetailsLoading(true);
    setShowDetails(true);
    
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      if (!response.ok) throw new Error('Failed to fetch payment details');
      const data = await response.json();
      setSelectedPayment(data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      alert('Failed to load payment details');
      setShowDetails(false);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
    setSelectedPayment(null);
  }, []);

  const handleDelete = useCallback(async (paymentId) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await fetch(`/api/payments/${paymentId}`, { method: 'DELETE' });
        fetchFilteredPayments();
        fetchStats();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  }, [fetchFilteredPayments, fetchStats]);

  // State for sending receipt
  const [sendingReceipt, setSendingReceipt] = useState(null);

  // Send Receipt Handler
  const handleSendReceipt = useCallback(async (paymentId, currency, email) => {
    if (!email) {
      alert('Donor email is not available for this payment.');
      return;
    }

    const receiptType = currency === 'USD' ? '501(c)(3)' : '80G';
    if (!confirm(`Send ${receiptType} receipt to ${email}?`)) {
      return;
    }

    setSendingReceipt(paymentId);
    try {
      const response = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${result.receiptType} receipt sent successfully to ${result.email}`);
      } else {
        alert(`❌ Failed to send receipt: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending receipt:', error);
      alert('Failed to send receipt. Please try again.');
    } finally {
      setSendingReceipt(null);
    }
  }, []);

  const handleExport = useCallback(async () => {
    try {
      // Build query params from current filters
      const params = new URLSearchParams();
      if (filters.startDate) {
        params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.set('endDate', filters.endDate);
      }
      if (filters.cause !== 'All') {
        params.set('cause', filters.cause);
      }
      if (filters.status !== 'All') {
        params.set('status', filters.status);
      }
      if (filters.currency !== 'All') {
        params.set('currency', filters.currency);
      }
      if (filters.reference !== 'All') {
        params.set('reference', filters.reference);
      }
      if (filters.paymentType !== 'All') {
        params.set('paymentType', filters.paymentType);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/export?${queryString}` : '/api/export';
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }, [filters]);

  // CSV Parse Function
  const parseCSV = useCallback((text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { headers: [], records: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        records.push(record);
      }
    }

    return { headers, records };
  }, []);

  // Bulk Upload Handler
  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setShowUploadModal(true);
    setUploadStatus('validating');
    setUploadProgress(0);
    setUploadErrors([]);
    setUploadResults(null);

    try {
      const text = await file.text();
      const { headers, records } = parseCSV(text);

      if (records.length === 0) {
        setUploadStatus('error');
        setUploadErrors(['CSV file is empty or has invalid format']);
        return;
      }

      const requiredHeaders = ['FullName', 'Email', 'Amount', 'Currency', 'PaymentDate'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setUploadStatus('error');
        setUploadErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
        return;
      }

      setUploadStatus('uploading');
      setUploadProgress(30);

      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });

      setUploadProgress(80);
      const result = await response.json();
      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        setUploadResults(result);
        fetchFilteredPayments();
        fetchStats();
      } else {
        setUploadStatus('error');
        setUploadErrors(result.errors || ['Upload failed']);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadErrors([error.message || 'Failed to process file']);
    }
  }, [parseCSV, fetchFilteredPayments, fetchStats]);

  const handleCloseUploadModal = useCallback(() => {
    setShowUploadModal(false);
    setUploadStatus('');
    setUploadProgress(0);
    setUploadErrors([]);
    setUploadResults(null);
    setSelectedUploadFile(null);
    setSendEmail(false);
    setSaveToDatabase(true);
    setBulkDownload(false);
  }, []);

  // Handle bulk upload from modal form
  const handleBulkUpload = useCallback(async () => {
    if (!selectedUploadFile) return;

    setUploadStatus('validating');
    setUploadProgress(0);
    setUploadErrors([]);
    setUploadResults(null);

    try {
      const text = await selectedUploadFile.text();
      const { headers, records } = parseCSV(text);

      if (records.length === 0) {
        setUploadStatus('error');
        setUploadErrors(['CSV file is empty or has invalid format']);
        return;
      }

      const requiredHeaders = ['FullName', 'Email', 'Amount', 'Currency', 'PaymentDate'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setUploadStatus('error');
        setUploadErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
        return;
      }

      setUploadStatus('uploading');
      setUploadProgress(30);

      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          records,
          sendEmail,
          saveToDatabase,
          bulkDownload
        })
      });

      setUploadProgress(80);
      const result = await response.json();
      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        setUploadResults(result);
        if (saveToDatabase) {
          fetchFilteredPayments();
          fetchStats();
        }
      } else {
        setUploadStatus('error');
        setUploadErrors(result.errors || ['Upload failed']);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadErrors([error.message || 'Failed to process file']);
    }
  }, [selectedUploadFile, sendEmail, saveToDatabase, bulkDownload, parseCSV, fetchFilteredPayments, fetchStats]);

  // Handle sample file download
  const handleDownloadSample = useCallback(() => {
    // Create sample CSV content with all database columns
    const sampleContent = `FullName,FirstName,LastName,Email,Mobile,PaymentType,TransactionId,Currency,Amount,TransactionFee,Cause,Country,Address,ZIP,PAN,PaymentStatus,PaymentDate,Reference
John Doe,John,Doe,john.doe@example.com,+1234567890,one_time,TXN001,INR,10000.00,250.00,Education,India,123 Main Street Mumbai,400001,ABCDE1234F,completed,2026-01-15,Bank Transfer
Jane Smith,Jane,Smith,jane.smith@example.com,+1234567891,recurring,TXN002,INR,5000.00,125.00,Healthcare,India,456 Park Avenue Delhi,110001,FGHIJ5678K,completed,2026-01-16,Online
Rahul Kumar,Rahul,Kumar,rahul.kumar@example.com,+1234567892,one_time,TXN003,INR,25000.00,625.00,General Fund,India,789 Lake Road Bangalore,560001,KLMNO9012P,completed,2026-01-17,Cheque`;
    
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_upload.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="p-4 sm:p-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Payments</h1>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#003c7a] to-[#005bb5] text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#ff9500] to-[#ff9500] text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <PaymentFilters 
          filters={filters} 
          setFilters={setFilters}
          showSearch={true}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-wrap">
        <span>
          Showing {displayedPayments.length} of {payments.length} payments
          {totalCount > payments.length && ` (${totalCount} total)`}
        </span>
        {selectedPayments.length > 0 && (
          <span className="text-[#003c7a] font-medium">
            • {selectedPayments.length} selected
            <button 
              onClick={() => setSelectedPayments([])}
              className="ml-2 text-red-500 hover:text-red-700 underline"
            >
              Clear
            </button>
          </span>
        )}
      </div>

      {/* Payments - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#003c7a]"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading payments...</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-200">
              {displayedPayments.map((payment) => (
                <div key={payment.PaymentId} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{payment.FullName}</div>
                      <div className="text-xs text-gray-500">{payment.Email}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      payment.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.PaymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      {payment.Cause && (
                        <div className="text-xs text-[#003c7a] font-medium">{payment.Cause}</div>
                      )}
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(payment.Amount, payment.Currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{payment.ReceiptId}</div>
                      <div className="text-xs text-gray-400">{formatDate(payment.PaymentDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleSendReceipt(payment.PaymentId, payment.Currency, payment.Email)}
                      disabled={sendingReceipt === payment.PaymentId}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                      title={`Send ${payment.Currency === 'USD' ? '501(c)(3)' : '80G'} Receipt`}
                    >
                      {sendingReceipt === payment.PaymentId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleViewDetails(payment.PaymentId)}
                      className="p-2 text-[#003c7a] hover:bg-[#003c7a]/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {userRole !== 'viewer' && (
                      <button 
                        onClick={() => handleDelete(payment.PaymentId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 cursor-pointer" 
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Receipt ID</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cause / Amount</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedPayments.map((payment) => (
                    <tr key={payment.PaymentId} className="hover:bg-gradient-to-r hover:from-[#003c7a]/5 hover:to-[#005bb5]/5 transition-all duration-200">
                      <td className="px-4 lg:px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 cursor-pointer" 
                          checked={selectedPayments.includes(payment.PaymentId)}
                          onChange={() => handleSelectOne(payment.PaymentId)}
                        />
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.ReceiptId}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatDate(payment.PaymentDate)}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.FullName}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{payment.Email}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {payment.Cause && (
                          <div className="text-xs text-[#003c7a] font-medium mb-1 truncate max-w-[120px]">{payment.Cause}</div>
                        )}
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.Amount, payment.Currency)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                          payment.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          payment.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.PaymentStatus}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <button 
                            onClick={() => handleSendReceipt(payment.PaymentId, payment.Currency, payment.Email)}
                            disabled={sendingReceipt === payment.PaymentId}
                            className="p-1.5 lg:p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                            title={`Send ${payment.Currency === 'USD' ? '501(c)(3)' : '80G'} Receipt`}
                          >
                            {sendingReceipt === payment.PaymentId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleViewDetails(payment.PaymentId)}
                            className="p-1.5 lg:p-2 text-[#003c7a] hover:bg-[#003c7a]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {userRole !== 'viewer' && (
                            <button 
                              onClick={() => handleDelete(payment.PaymentId)}
                              className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {payments.length === 0 && !loading && (
              <div className="p-8 sm:p-12 text-center text-gray-500">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">No payments found matching your filters.</p>
              </div>
            )}
            
            {displayCount < payments.length && (
              <div className="p-4 sm:p-6 text-center border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setDisplayCount(prev => prev + 50)}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#003c7a] to-[#005bb5] text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Load More
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-xs opacity-80 hidden sm:inline">({payments.length - displayCount} remaining)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Details Sidebar */}
      {showDetails && (
        <PaymentDetailsSidebar 
          payment={selectedPayment}
          onClose={handleCloseDetails}
          loading={detailsLoading}
        />
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        show={showUploadModal}
        onClose={handleCloseUploadModal}
        progress={uploadProgress}
        status={uploadStatus}
        results={uploadResults}
        errors={uploadErrors}
        selectedFile={selectedUploadFile}
        setSelectedFile={setSelectedUploadFile}
        sendEmail={sendEmail}
        setSendEmail={setSendEmail}
        saveToDatabase={saveToDatabase}
        setSaveToDatabase={setSaveToDatabase}
        bulkDownload={bulkDownload}
        setBulkDownload={setBulkDownload}
        onUpload={handleBulkUpload}
        onDownloadSample={handleDownloadSample}
      />
    </div>
  );
});

PaymentsView.displayName = 'PaymentsView';

export default PaymentsView;
