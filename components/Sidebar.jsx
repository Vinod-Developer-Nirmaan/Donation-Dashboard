'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, CreditCard, Calendar, Users, Shield, X, HelpCircle, HelpCircleIcon, HelpingHand } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const Sidebar = React.memo(({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavClick = (view) => {
    setCurrentView(view);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen?.(false);
    }
  };

  const handleAdminClick = () => {
    router.push('/admin/users');
    if (window.innerWidth < 1024) {
      setSidebarOpen?.(false);
    }
  };
  
  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'
      } fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#003c7a] to-[#005bb5] text-white font-bold text-xl px-4 py-2 rounded-lg">
                N
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-gray-100">nirmaan.org</span>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={() => setSidebarOpen?.(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'home' ? 'bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/20 dark:text-[#5ba3d9]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavClick('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'payments' ? 'bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/20 dark:text-[#5ba3d9]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Payments</span>
          </button>
          <button
            onClick={() => handleNavClick('campaigns')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'campaigns' ? 'bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/20 dark:text-[#5ba3d9]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <HelpingHand className="w-5 h-5" />
            <span className="font-medium">Campaigns</span>
          </button>
          <button
            onClick={() => handleNavClick('subscriptions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'subscriptions' ? 'bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/20 dark:text-[#5ba3d9]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Subscriptions</span>
          </button>
          
          {/* Admin Section - Only visible to super_admin */}
          {user?.role === 'super_admin' && (
            <>
              <div className="my-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Administration
                </p>
              </div>
              <button
                onClick={handleAdminClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 dark:text-gray-300 hover:bg-[#ffbc00]/10 hover:text-[#cc9600] dark:hover:bg-[#ffbc00]/20"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">User Management</span>
              </button>
            </>
          )}
        </nav>
        
        
      </div>
    </div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
