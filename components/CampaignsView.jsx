'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Megaphone, TrendingUp, Users, Upload, DollarSign, IndianRupee,
  Loader2, Eye, Search, ChevronRight, X, User, MapPin, 
  CreditCard, FileText, Calendar, Download
} from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Payment Details Sidebar for Campaigns
const PaymentDetailsSidebar = ({ payment, onClose, loading }) => {
  if (!payment && !loading) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white dark:bg-gray-800 shadow-2xl z-[70] overflow-hidden">
        <div className="bg-gradient-to-r from-[#003c7a] to-[#005bb5] px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              {payment && (
                <p className="text-white/80 text-sm mt-1">Receipt: {payment.ReceiptId}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-80px)] p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-[#003c7a] animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : payment && (
            <>
              <div className="bg-[#003c7a]/5 dark:bg-[#003c7a]/20 rounded-xl p-4 border border-[#003c7a]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#003c7a] rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Donor Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.FullName}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.Email}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Mobile:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.Mobile || '-'}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">PAN:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.PAN || '-'}</span></div>
                </div>
              </div>
              <div className="bg-[#ffbc00]/10 dark:bg-[#ffbc00]/20 rounded-xl p-4 border border-[#ffbc00]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#ffbc00] rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Payment Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Amount:</span> <span className="font-bold text-[#003c7a] dark:text-[#5ba3d9]">{formatCurrency(payment.Amount, payment.Currency)}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Fee:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(payment.TransactionFee || 0, payment.Currency)}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Cause:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.Cause || '-'}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Reference:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{payment.Reference || '-'}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payment.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{payment.PaymentStatus}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Date:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(payment.PaymentDate)}</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'from-[#003c7a] to-[#005bb5]',
    yellow: 'from-[#ffbc00] to-[#ff9500]',
    green: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-indigo-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 sm:p-5 shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

const CampaignsView = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [causes, setCauses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [stats, setStats] = useState({
    inr: { total: 0, fee: 0, received: 0, count: 0 },
    usd: { total: 0, fee: 0, received: 0, count: 0 },
    donorCount: 0,
    totalCount: 0,
    uniqueDonorCount: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    campaign: 'All',
    cause: 'All',
    status: 'All',
    currency: 'All',
    startDate: '',
    endDate: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(25);
  
  // Checkbox selection state
  const [selectedDonations, setSelectedDonations] = useState(new Set());
  
  // Payment Details
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch campaigns (references) - filtered by cause if selected
  const fetchCampaigns = useCallback(async (cause = 'All') => {
    try {
      const params = new URLSearchParams();
      if (cause && cause !== 'All') {
        params.set('cause', cause);
      }
      const response = await fetch(`/api/campaigns?${params.toString()}`);
      const data = await response.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, []);

  // Fetch causes
  const fetchCauses = useCallback(async () => {
    try {
      const response = await fetch('/api/causes');
      const data = await response.json();
      if (data.causes) {
        setCauses(data.causes);
      }
    } catch (error) {
      console.error('Error fetching causes:', error);
    }
  }, []);

  // Fetch donations with filters
  const fetchDonations = useCallback(async () => {
    try {
      setDonationsLoading(true);
      const params = new URLSearchParams();
      params.set('limit', '100000');
      
      if (filters.campaign !== 'All') {
        params.set('reference', filters.campaign);
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
      if (filters.startDate) {
        params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.set('endDate', filters.endDate);
      }

      const response = await fetch(`/api/payments?${params.toString()}`);
      const result = await response.json();
      const donationData = Array.isArray(result.data) ? result.data : [];
      setDonations(donationData);

      // Calculate stats from all completed donations (case-insensitive check)
      const completedDonations = donationData.filter(d => d.PaymentStatus?.toLowerCase() === 'completed');
      const inrDonations = completedDonations.filter(d => d.Currency === 'INR');
      const usdDonations = completedDonations.filter(d => d.Currency === 'USD');
      
      const inrTotal = inrDonations.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
      const inrFee = inrDonations.reduce((sum, d) => sum + (Number(d.TransactionFee) || 0), 0);
      const usdTotal = usdDonations.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
      const usdFee = usdDonations.reduce((sum, d) => sum + (Number(d.TransactionFee) || 0), 0);
      
      setStats({
        inr: {
          total: inrTotal,
          fee: inrFee,
          received: inrTotal - inrFee,
          count: inrDonations.length
        },
        usd: {
          total: usdTotal,
          fee: usdFee,
          received: usdTotal - usdFee,
          count: usdDonations.length
        },
        donorCount: new Set(completedDonations.map(d => d.Email)).size,
        totalCount: completedDonations.length,
        uniqueDonorCount: new Set(donationData.map(d => d.Email)).size
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      setDonations([]);
    } finally {
      setDonationsLoading(false);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  // Refetch campaigns when cause filter changes
  useEffect(() => {
    fetchCampaigns(filters.cause);
    // Reset campaign filter when cause changes to avoid invalid selection
    if (filters.campaign !== 'All') {
      setFilters(prev => ({ ...prev, campaign: 'All' }));
    }
  }, [filters.cause, fetchCampaigns]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // View payment details
  const handleViewDetails = useCallback(async (paymentId) => {
    setDetailsLoading(true);
    setShowDetails(true);
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();
      setSelectedPayment(data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // Filter donations by search - moved up before checkbox handlers that depend on it
  const filteredDonations = useMemo(() => {
    let result = donations;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.FullName?.toLowerCase().includes(query) ||
        d.Email?.toLowerCase().includes(query) ||
        d.ReceiptId?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [donations, searchQuery]);

  // Checkbox handlers
  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedDonations(new Set(filteredDonations.map(d => d.PaymentId)));
    } else {
      setSelectedDonations(new Set());
    }
  }, [filteredDonations]);

  const handleSelectOne = useCallback((paymentId, checked) => {
    setSelectedDonations(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(paymentId);
      } else {
        newSet.delete(paymentId);
      }
      return newSet;
    });
  }, []);

  const isAllSelected = useMemo(() => {
    return filteredDonations.length > 0 && selectedDonations.size === filteredDonations.length;
  }, [filteredDonations, selectedDonations]);

  const isSomeSelected = useMemo(() => {
    return selectedDonations.size > 0 && selectedDonations.size < filteredDonations.length;
  }, [filteredDonations, selectedDonations]);

  // Export functionality
  const handleExport = useCallback(() => {
    const donationsToExport = selectedDonations.size > 0 
      ? filteredDonations.filter(d => selectedDonations.has(d.PaymentId))
      : filteredDonations;

    if (donationsToExport.length === 0) {
      alert('No donations to export');
      return;
    }

    // CSV headers
    const headers = [
      'Receipt ID',
      'Full Name',
      'Email',
      'Amount',
      'Currency',
      'Transaction Fee',
      'Status',
      'Payment Date',
      'Reference',
      'Cause'
    ];

    // Convert donations to CSV rows
    const rows = donationsToExport.map(d => [
      d.ReceiptId || '',
      d.FullName || '',
      d.Email || '',
      d.Amount || 0,
      d.Currency || '',
      d.TransactionFee || 0,
      d.PaymentStatus || '',
      d.PaymentDate ? new Date(d.PaymentDate).toISOString() : '',
      d.Reference || '',
      d.Cause || ''
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell
      ).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    const campaignName = filters.campaign !== 'All' ? `_${filters.campaign.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    a.download = `campaign_donations${campaignName}_${dateStr}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [selectedDonations, filteredDonations, filters.campaign]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedDonations(new Set());
  }, [filters]);

  const displayedDonations = useMemo(() => {
    return filteredDonations.slice(0, displayCount);
  }, [filteredDonations, displayCount]);

  const selectClass = "px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#003c7a]";
  const labelClass = "absolute -top-2 left-2 bg-white dark:bg-gray-900 px-1 text-xs text-gray-500 dark:text-gray-400 z-10";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-gray-50 via-[#003c7a]/5 to-[#ffbc00]/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
          Campaigns
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
          View campaign-specific donations and statistics
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {/* Cause Filter */}
          <div className="relative">
            <label className={labelClass}>Cause</label>
            <select
              value={filters.cause}
              onChange={(e) => setFilters({...filters, cause: e.target.value})}
              className={`w-full ${selectClass}`}
            >
              <option value="All">All Causes</option>
              {causes.map((cause, i) => (
                <option key={i} value={cause}>{cause}</option>
              ))}
            </select>
          </div>

          {/* Campaign/Reference Filter */}
          <div className="relative">
            <label className={labelClass}>Reference</label>
            <select
              value={filters.campaign}
              onChange={(e) => setFilters({...filters, campaign: e.target.value})}
              className={`w-full ${selectClass}`}
            >
              <option value="All">All References</option>
              {campaigns.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label className={labelClass}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className={`w-full ${selectClass}`}
            >
              <option value="All">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Currency Filter */}
          <div className="relative">
            <label className={labelClass}>Currency</label>
            <select
              value={filters.currency}
              onChange={(e) => setFilters({...filters, currency: e.target.value})}
              className={`w-full ${selectClass}`}
            >
              <option value="All">All Currency</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="relative">
            <label className={labelClass}>Start Date</label>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none mt-1" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className={`w-full pr-10 ${selectClass}`}
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <label className={labelClass}>End Date</label>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none mt-1" />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className={`w-full pr-10 ${selectClass}`}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {/* INR Stats */}
        <StatsCard
          title="INR Total"
          value={formatCurrency(stats.inr.total, 'INR')}
          icon={IndianRupee}
          color="blue"
        />
        {/* USD Stats */}
        <StatsCard
          title="USD Total"
          value={formatCurrency(stats.usd.total, 'USD')}
          icon={DollarSign}
          color="yellow"
        />
        <StatsCard
          title="Total Payments"
          value={stats.totalCount}
          icon={CreditCard}
          color="yellow"
        />
        <StatsCard
          title="Unique Donors"
          value={stats.donorCount}
          icon={Users}
          color="blue"
        />
        
        
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        
      </div>

      {/* Donations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {filters.campaign !== 'All' ? `${filters.campaign} Donations` : 'All Campaign Donations'}
              </h3>
              {selectedDonations.size > 0 && (
                <span className="px-2 py-1 bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/30 dark:text-[#5ba3d9] text-xs font-medium rounded-full">
                  {selectedDonations.size} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#003c7a] to-[#005bb5] text-white text-sm rounded-lg hover:shadow-lg transition-all"
                title={selectedDonations.size > 0 ? `Export ${selectedDonations.size} selected` : 'Export all'}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{selectedDonations.size > 0 ? `Export (${selectedDonations.size})` : 'Export'}</span>
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#003c7a]"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing {displayedDonations.length} of {filteredDonations.length} donations
          </p>
        </div>

        {/* Table Content */}
        {donationsLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#003c7a] mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading donations...</p>
          </div>
        ) : displayedDonations.length === 0 ? (
          <div className="p-8 text-center">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No donations found for this campaign.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {displayedDonations.map((donation) => (
                <div key={donation.PaymentId} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDonations.has(donation.PaymentId)}
                        onChange={(e) => handleSelectOne(donation.PaymentId, e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-[#003c7a] focus:ring-[#003c7a]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{donation.FullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{donation.Email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      donation.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {donation.PaymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(donation.Amount, donation.Currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(donation.PaymentDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-[#003c7a] dark:text-[#5ba3d9] font-medium">{donation.Reference}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{donation.ReceiptId}</p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(donation.PaymentId)}
                        className="p-2 text-[#003c7a] hover:bg-[#003c7a]/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-[#003c7a] focus:ring-[#003c7a]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Donor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Receipt</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayedDonations.map((donation) => (
                    <tr key={donation.PaymentId} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedDonations.has(donation.PaymentId) ? 'bg-[#003c7a]/5 dark:bg-[#003c7a]/20' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDonations.has(donation.PaymentId)}
                          onChange={(e) => handleSelectOne(donation.PaymentId, e.target.checked)}
                          className="rounded border-gray-300 text-[#003c7a] focus:ring-[#003c7a]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{donation.FullName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{donation.Email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(donation.Amount, donation.Currency)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Fee: {formatCurrency(donation.TransactionFee || 0, donation.Currency)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#003c7a] dark:text-[#5ba3d9] font-medium">
                          {donation.Reference || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(donation.PaymentDate)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          donation.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {donation.PaymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {donation.ReceiptId}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(donation.PaymentId)}
                          className="p-2 text-[#003c7a] hover:bg-[#003c7a]/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load More */}
            {displayCount < filteredDonations.length && (
              <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setDisplayCount(prev => prev + 25)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#003c7a] text-white rounded-lg hover:bg-[#002d5c] transition-colors"
                >
                  Load More
                  <ChevronRight className="w-4 h-4" />
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
          onClose={() => {
            setShowDetails(false);
            setSelectedPayment(null);
          }}
          loading={detailsLoading}
        />
      )}
    </div>
  );
});

CampaignsView.displayName = 'CampaignsView';

export default CampaignsView;
