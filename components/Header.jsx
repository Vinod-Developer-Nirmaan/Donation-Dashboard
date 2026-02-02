'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Moon, Sun, User, LogOut, Shield, Users, ChevronDown, Crown, Eye, Settings } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { ROLE_CONFIG } from '@/lib/permissions';

const Header = React.memo(({ sidebarOpen, setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  // Get role icon and color
  const getRoleDisplay = () => {
    if (!user?.role) return { icon: User, color: 'gray', label: 'User' };
    
    const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.viewer;
    const icons = {
      super_admin: Crown,
      admin: Shield,
      viewer: Eye
    };
    
    return {
      icon: icons[user.role] || User,
      color: config.color,
      label: config.label
    };
  };

  const roleDisplay = getRoleDisplay();

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-gradient-to-r hover:from-[#003c7a]/10 hover:to-[#005bb5]/10 dark:hover:from-[#003c7a]/20 dark:hover:to-[#005bb5]/20 rounded-xl transition-all duration-200 group"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#003c7a] dark:group-hover:text-[#ffbc00] transition-colors" />
            </button>
            
            
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 relative group"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-[#ffbc00] group-hover:text-[#ff9500] transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:text-[#003c7a] transition-colors" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

            {/* User Profile with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <div className="relative">
                  <div className={`w-10 h-10 bg-gradient-to-r ${
                    user?.role === 'super_admin' ? 'from-[#ffbc00] to-[#ff9500]' :
                    user?.role === 'admin' ? 'from-[#003c7a] to-[#005bb5]' :
                    'from-gray-500 to-gray-600'
                  } rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.fullName || 'User'}</p>
                  <div className="flex items-center gap-1">
                    <roleDisplay.icon className={`w-3 h-3 text-${roleDisplay.color}-600`} />
                    <p className={`text-xs text-${roleDisplay.color}-600 font-medium`}>{roleDisplay.label}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 hidden lg:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${
                        user?.role === 'super_admin' ? 'from-[#ffbc00] to-[#ff9500]' :
                        user?.role === 'admin' ? 'from-[#003c7a] to-[#005bb5]' :
                        'from-gray-500 to-gray-600'
                      } rounded-full flex items-center justify-center text-white text-lg font-bold`}>
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'super_admin' ? 'bg-[#ffbc00]/20 text-[#996b00] dark:text-[#ffbc00]' :
                      user?.role === 'admin' ? 'bg-[#003c7a]/10 text-[#003c7a] dark:bg-[#003c7a]/20 dark:text-[#5ba3d9]' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      <roleDisplay.icon className="w-3 h-3" />
                      {roleDisplay.label}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {user?.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push('/admin/users');
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium">User Management</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
