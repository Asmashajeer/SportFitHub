import { Routes, Route } from 'react-router-dom';

import CompleteProfilePage from '@/features/user/page/CompleteProfilePage';
import UserDashboard from '@/features/user/page/UserDashboard';
import { UserProfile } from '@/features/user/component/UserProfile';
import MySessions from '@/features/user/page/MySessions';
import ReschedulePage from '@/features/user/page/ReschedulePage';
import MyBookings from '@/features/user/component/myBookings/MyBookings';
import MyPayments from '@/features/user/component/myPayments/MyPayments';
import MyWallet from '@/features/user/page/MyWallet';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/add-profile" element={<CompleteProfilePage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/my-sessions" element={<MySessions />} />
      <Route
        path="/sessions/reschedule/:sessionBookingId"
        element={<ReschedulePage />}
      />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/my-payments" element={<MyPayments />} />
      <Route path="/my-wallet" element={<MyWallet />} />
    </Routes>
  );
}

export default UserRoutes;
