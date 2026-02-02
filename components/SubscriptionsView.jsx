'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, Loader2, Eye, ReceiptIndianRupee } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
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

const SubscriptionsView = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    totalSubscribers: 0,
    monthlyUSD: 0,
    monthlyINR: 0
  });
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.subscriptions) {
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-gray-50 via-[#003c7a]/5 to-[#ffbc00]/5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#000] to-[#000] bg-clip-text text-transparent">
            Subscriptions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">Manage recurring donations and subscriptions</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-[#003c7a] to-[#0070d1] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Total Subscribers</h3>
          <p className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
            {loading ? <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin" /> : stats.totalSubscribers.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#003c7a] to-[#005bb5] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Active Subscriptions</h3>
          <p className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
            {loading ? <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin" /> : stats.activeSubscriptions.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#ffbc00] to-[#ff9500] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Monthly (USD)</h3>
          <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white truncate">
            {loading ? <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin" /> : formatCurrency(stats.monthlyUSD, 'USD')}
          </p>
        </div>

        

        <div className="bg-gradient-to-br from-[#ffbc00] to-[#ff9500] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl">
              <ReceiptIndianRupee className="w-4 h-4 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Monthly (INR)</h3>
          <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white truncate">
            {loading ? <Loader2 className="w-5 h-5 sm:w-8 sm:h-8 animate-spin" /> : formatCurrency(stats.monthlyINR, 'INR')}
          </p>
        </div>
      </div>

      {/* Subscriptions Table or Empty State */}
      {loading ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-16 text-center border border-gray-200">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-[#003c7a] mx-auto" />
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading subscriptions...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-16 text-center border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-[#003c7a] to-[#003c7a] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Subscriptions Yet</h3>
            <p className="text-gray-600 text-sm sm:text-base">Recurring donations will appear here once subscribers sign up.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-gray-200">
            {subscriptions.map((sub, index) => (
              <div key={sub.SubscriptionId || index} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{sub.FullName}</div>
                    <div className="text-xs text-gray-500">{sub.Email}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sub.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    sub.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sub.PaymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    {sub.Cause && (
                      <div className="text-xs text-[#003c7a] font-medium">{sub.Cause}</div>
                    )}
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(sub.Amount, sub.Currency)}<span className="text-xs text-gray-500 font-normal">/mo</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">{formatCurrency(sub.total_donated, sub.Currency)}</div>
                    <div className="text-xs text-gray-400">{sub.payment_count} payments</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Last payment: {formatDate(sub.PaymentDate)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subscription ID</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subscriber</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cause</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payments</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Payment</th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((sub, index) => (
                  <tr key={sub.SubscriptionId || index} className="hover:bg-gradient-to-r hover:from-[#003c7a]/5 hover:to-[#005bb5]/5 transition-all duration-200">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[100px]">{sub.SubscriptionId}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sub.FullName}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{sub.Email}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-[#003c7a] font-medium truncate max-w-[100px]">{sub.Cause || '-'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(sub.Amount, sub.Currency)}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-bold text-emerald-600">
                        {formatCurrency(sub.total_donated, sub.Currency)}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900">{sub.payment_count}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(sub.PaymentDate)}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                        sub.PaymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        sub.PaymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sub.PaymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     
    </div>
  );
});

SubscriptionsView.displayName = 'SubscriptionsView';

export default SubscriptionsView;