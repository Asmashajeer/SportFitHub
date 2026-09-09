import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingScreen } from '@/components/reusable/LoadingScreen';
const CompleteProfilePage = lazy(() => import('@/features/user/page/CompleteProfilePage'));
const UserDashboard = lazy(() => import('@/features/user/page/UserDashboard'));
const MySessions = lazy(() => import('@/features/user/page/MySessions'));
const ReschedulePage = lazy(() => import('@/features/user/page/ReschedulePage'));
const MyBookings = lazy(() => import('@/features/user/component/myBookings/MyBookings'));
const MyPayments = lazy(() => import('@/features/user/component/myPayments/MyPayments'));
const MyWallet = lazy(() => import('@/features/user/page/MyWallet'));
const SubmitSessionReview = lazy(() => import('@/features/review/components/user/SubmitSessionReview'));
const UserProfile = lazy(() =>  import('@/features/user/component/UserProfile'));
const ChatInboxPage = lazy(() =>  import('@/features/chat/page/ChatInboxPage'));

function UserRoutes() {
  return (
    <Routes>
      <Suspense fallback={<LoadingScreen />}>
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
        <Route path="/messages" element={<ChatInboxPage />} />
        <Route path='/review/:sessionModel/:sessionId' element={<SubmitSessionReview/>}/>
     </Suspense>
    </Routes>
  );
}

export default UserRoutes;
