import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../features/admin/component/user-management/UserManagement';
import AdminMainLayout from '../components/layout/AdminLayout';

import Categories from '@/features/admin/component/category-management/Categories';

import AdminBookings from '@/features/admin/pages/Bookings.management';
import AdminTrainers from '@/features/admin/pages/Trainers.management';
import AdminPayments from '@/features/admin/pages/payment.management';
import AdminSessions from '@/features/admin/pages/Session.management';
import PlatformSettingsPage from '@/features/admin/pages/AdminSettings';

const AdminRoutes = () => {
  return (
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
  );
};
export default AdminRoutes;
