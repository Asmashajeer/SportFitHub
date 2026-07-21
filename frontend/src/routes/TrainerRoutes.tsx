import { Routes, Route } from 'react-router-dom';

import TrainerDashboard from '@/features/trainer/page/TrainerDashboard';
import ProfileView from '@/features/trainer/component/ProfileView';
import TrainerProfileForm from '../features/trainer/page/TrainerOnboarding';
// import CreateSportSession from "@/features/session/sportSession/component/CreateSportSession";
import Sessions from '@/features/trainer/page/Sessions';
import Bookings from '@/features/trainer/page/Bookings';
import Attendance from '@/features/trainer/page/Attandance';
import { ChatInboxPage } from '@/features/chat/page/ChatInboxPage';
const TrainerRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TrainerDashboard />} />    
      {/* <Route path="/add-Profile"  element={<TrainerProfileForm /> }  />  */}
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/messages" element={<ChatInboxPage />} />
      {/* <Route path='/sessions/create-Sport-session' element={<CreateSportSession />}/> */}
    </Routes>
  );
};

export default TrainerRoutes;
