import { LoadingScreen } from '@/components/reusable/LoadingScreen';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';


const TrainerDashboard = lazy(() => import('@/features/trainer/page/TrainerDashboard'));
const ProfileView = lazy(() => import('@/features/trainer/component/ProfileView'));
const Sessions = lazy(() => import('@/features/trainer/page/Sessions'));
const Bookings = lazy(() => import('@/features/trainer/page/Bookings'));
const Attendance = lazy(() => import('@/features/trainer/page/Attandance'));
const TrainerReviewsPage = lazy(() => import('@/features/review/page/TrainerReviewsPage'));
const TrainerEarningsPage = lazy(() => import('@/features/trainer/page/Earning'));
const OnboardingRefresh = lazy(() => import('@/features/trainer/component/earnings/OnboardingRefreshPage'));
const ChatInboxPage = lazy(() =>  import('@/features/chat/page/ChatInboxPage'));



const TrainerRoutes = () => {
  return (
    <Routes>
      <Suspense fallback={<LoadingScreen />}>
        <Route path="/dashboard" element={<TrainerDashboard />} />    
        {/* <Route path="/add-Profile"  element={<TrainerProfileForm /> }  />  */}
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/messages" element={<ChatInboxPage />} />
        <Route path="/review-rating" element={<TrainerReviewsPage />} />
        <Route path="/earnings" element={<TrainerEarningsPage />} />
        <Route path="/onboarding/refresh" element={<OnboardingRefresh />} />
      
        {/* <Route path='/sessions/create-Sport-session' element={<CreateSportSession />}/> */}
      </Suspense>  
    </Routes>
  );
};

export default TrainerRoutes;
