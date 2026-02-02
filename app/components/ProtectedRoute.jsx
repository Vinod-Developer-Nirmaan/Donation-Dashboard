'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole = null, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [loading, isAuthenticated, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#003c7a]/5 to-[#ffbc00]/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#003c7a] animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check role permission
  const hasRoleAccess = () => {
    if (!requiredRole && allowedRoles.length === 0) return true;
    if (user?.role === 'super_admin') return true;
    if (requiredRole && user?.role === requiredRole) return true;
    if (allowedRoles.length > 0 && allowedRoles.includes(user?.role)) return true;
    return false;
  };

  // Access denied
  if (!hasRoleAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {requiredRole && (
              <span className="block mt-2 text-sm">
                Required role: <span className="font-semibold capitalize">{requiredRole.replace('_', ' ')}</span>
              </span>
            )}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#003c7a] to-[#005bb5] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
