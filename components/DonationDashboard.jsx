'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../app/context/AuthContext';

// Lazy load view components for better performance
const HomeView = lazy(() => import('./HomeView'));
const PaymentsView = lazy(() => import('./PaymentsView'));
const SubscriptionsView = lazy(() => import('./SubscriptionsView'));
const CampaignsView = lazy(() => import('./CampaignsView'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003c7a] dark:border-[#ffbc00]"></div>
  </div>
);

const DonationDashboard = () => {
  const [currentView, setCurrentView] = useState('home');
  const [payments, setPayments] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  // Start with sidebar closed on mobile (will be handled by CSS)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    inr: { total: 0, fee: 0, received: 0 },
    usd: { total: 0, fee: 0, received: 0 },
    paymentCount: 0,
    subscriptionCount: 0,
    donorCount: 0
  });
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

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments?limit=100000');
      const result = await response.json();
      // Handle new response format with data property
      setPayments(Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      if (filterParams.cause && filterParams.cause !== 'All') {
        params.set('cause', filterParams.cause);
      }
      if (filterParams.status && filterParams.status !== 'All') {
        params.set('status', filterParams.status);
      }
      if (filterParams.currency && filterParams.currency !== 'All') {
        params.set('currency', filterParams.currency);
      }
      if (filterParams.paymentType && filterParams.paymentType !== 'All') {
        params.set('paymentType', filterParams.paymentType);
      }
      if (filterParams.reference && filterParams.reference !== 'All') {
        params.set('reference', filterParams.reference);
      }
      if (filterParams.startDate) {
        params.set('startDate', filterParams.startDate);
      }
      if (filterParams.endDate) {
        params.set('endDate', filterParams.endDate);
      }
      if (filterParams.search) {
        params.set('search', filterParams.search);
      }
      const response = await fetch(`/api/stats?${params.toString()}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Fetch payments from API
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [fetchPayments, fetchStats]);

  // Refetch stats when any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStats(filters);
    }, filters.search ? 300 : 0); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters, fetchStats]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 overflow-auto">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        <Suspense fallback={<LoadingSpinner />}>
          {currentView === 'home' && (
            <HomeView 
              stats={stats} 
              filters={filters} 
              setFilters={setFilters}
            />
          )}
          {currentView === 'payments' && (
            <PaymentsView 
              payments={payments} 
              loading={loading}
              fetchPayments={fetchPayments}
              fetchStats={fetchStats}
              userRole={user?.role}
            />
          )}
          {currentView === 'subscriptions' && <SubscriptionsView />}
          {currentView === 'campaigns' && <CampaignsView />}
        </Suspense>
      </div>
    </div>
  );
};

export default DonationDashboard;
