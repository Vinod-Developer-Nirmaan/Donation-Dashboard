'use client';

import DonationDashboard from '@/components/DonationDashboard';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <DonationDashboard />
    </ProtectedRoute>
  );
}