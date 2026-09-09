import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import AdminMainLayout from '../components/layout/AdminLayout';
import { LoadingScreen } from '@/components/reusable/LoadingScreen';

const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const UserManagement = lazy(() => import('../features/admin/component/user-management/UserManagement'));
const AdminTrainers = lazy(() => import('@/features/admin/pages/Trainers.management'));
const Categories = lazy(() => import('@/features/admin/component/category-management/Categories'));
const AdminSessions = lazy(() => import('@/features/admin/pages/Session.management'));
const AdminBookings = lazy(() => import('@/features/admin/pages/Bookings.management'));
const AdminPayments = lazy(() => import('@/features/admin/pages/payment.management'));
const PlatformSettingsPage = lazy(() => import('@/features/admin/pages/AdminSettings'));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Routes>
        <Route element={<AdminMainLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/trainer-management" element={<AdminTrainers />} />
          <Route path="/category-management" element={<Categories />} />
          <Route path="/session-management" element={<AdminSessions />} />
          <Route path="/bookings-management" element={<AdminBookings />} />
          <Route path="/payment-management" element={<AdminPayments />} />
            <Route path="/settings" element={<PlatformSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
export default AdminRoutes;
