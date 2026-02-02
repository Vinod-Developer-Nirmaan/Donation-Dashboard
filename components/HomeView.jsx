'use client';

import React from 'react';
import { CreditCard, Calendar, Users } from 'lucide-react';
import PaymentFilters from './PaymentFilters';

// Helper function to format numbers with commas
const formatCurrency = (amount, decimals = 2) => {
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

const HomeView = React.memo(({ stats = {}, filters = {}, setFilters }) => {
  // Default values for stats
  const inr = stats?.inr || { total: 0, fee: 0, received: 0 };
  const usd = stats?.usd || { total: 0, fee: 0, received: 0 };
  const paymentCount = stats?.paymentCount || 0;
  const subscriptionCount = stats?.subscriptionCount || 0;
  const donorCount = stats?.donorCount || 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
        
        {/* Filters */}
        <PaymentFilters 
          filters={filters} 
          setFilters={setFilters}
          showSearch={false}
          compact={true}
        />
      </div>

      {/* INR Payments */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">INR Payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Donations</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">₹ {formatCurrency(inr.total)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Fee</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">₹ {formatCurrency(inr.fee)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Received</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">₹ {formatCurrency(inr.received)}</p>
          </div>
        </div>
      </div>

      {/* USD Payments */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">USD Payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Donations</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">$ {formatCurrency(usd.total)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Fee</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">$ {formatCurrency(usd.fee)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Total Received</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">$ {formatCurrency(usd.received)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#003c7a]/10 dark:bg-[#003c7a]/20 p-2 sm:p-3 rounded-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#003c7a] dark:text-[#5ba3d9]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No. of Payments</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{paymentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#ffbc00]/20 dark:bg-[#ffbc00]/30 p-2 sm:p-3 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#cc9600] dark:text-[#ffbc00]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No. of Subscriptions</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{subscriptionCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#003c7a]/10 dark:bg-[#003c7a]/20 p-2 sm:p-3 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#003c7a] dark:text-[#5ba3d9]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No. of Donors</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{donorCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HomeView.displayName = 'HomeView';

export default HomeView;
