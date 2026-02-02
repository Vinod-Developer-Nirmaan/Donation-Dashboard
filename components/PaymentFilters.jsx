'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const PaymentFilters = ({ 
  filters, 
  setFilters, 
  showSearch = true,
  compact = false 
}) => {
  const [causes, setCauses] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  // Fetch causes from database
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await fetch('/api/causes');
        const data = await response.json();
        if (data.causes) {
          setCauses(data.causes);
        }
      } catch (error) {
        console.error('Error fetching causes:', error);
      }
    };
    fetchCauses();
  }, []);

  // Fetch payment types from database
  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const response = await fetch('/api/payment-types');
        const data = await response.json();
        if (data.paymentTypes) {
          setPaymentTypes(data.paymentTypes);
        }
      } catch (error) {
        console.error('Error fetching payment types:', error);
      }
    };
    fetchPaymentTypes();
  }, []);

  const selectClass = "px-2 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#003c7a] dark:focus:ring-[#ffbc00] focus:border-transparent";
  const labelClass = "absolute -top-2 left-2 bg-white dark:bg-gray-800 px-1 text-xs text-gray-500 dark:text-gray-400";

  return (
    <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'} gap-2 sm:gap-4`}>
      {/* Search */}
      {showSearch && (
        <div className="relative col-span-2 sm:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search || ''}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#003c7a] dark:focus:ring-[#ffbc00] focus:border-transparent"
          />
        </div>
      )}

      {/* Start Date */}
      <div className="relative">
        <label className={labelClass}>Start Date</label>
        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          className={`w-full ${selectClass}`}
        />
      </div>

      {/* End Date */}
      <div className="relative">
        <label className={labelClass}>End Date</label>
        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          className={`w-full ${selectClass}`}
        />
      </div>

      {/* Status */}
      <select 
        value={filters.status || 'All'}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
        className={selectClass}
      >
        <option value="All">Status - All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      {/* Cause */}
      <select 
        value={filters.cause || 'All'}
        onChange={(e) => setFilters({...filters, cause: e.target.value})}
        className={selectClass}
      >
        <option value="All">Cause - All</option>
        {causes.map((cause, index) => (
          <option key={`cause-${index}`} value={cause}>{cause}</option>
        ))}
      </select>

      {/* Currency */}
      <select 
        value={filters.currency || 'All'}
        onChange={(e) => setFilters({...filters, currency: e.target.value})}
        className={selectClass}
      >
        <option value="All">Currency - All</option>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
      </select>

      {/* Reference */}
      <select 
        value={filters.reference || 'All'}
        onChange={(e) => setFilters({...filters, reference: e.target.value})}
        className={selectClass}
      >
        <option value="All">Reference - All</option>
        <option value="email">Email</option>
        <option value="google">Google</option>
        <option value="meta">Meta</option>
        <option value="metaads">Meta Ads</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="youtube">YouTube</option>
      </select>

      {/* Payment Type */}
      <select 
        value={filters.paymentType || 'All'}
        onChange={(e) => setFilters({...filters, paymentType: e.target.value})}
        className={selectClass}
      >
        <option value="All">Payment Type - All</option>
        {paymentTypes.map((type, index) => (
          <option key={`type-${index}`} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export default PaymentFilters;
