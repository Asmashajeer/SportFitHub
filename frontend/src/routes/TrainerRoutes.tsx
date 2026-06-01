import { Routes, Route } from 'react-router-dom';
import TrainerProfileForm from '../features/trainer/page/TrainerOnboarding';
import TrainerDashboard from '@/features/trainer/page/TrainerDashboard';
import ProfileView from '@/features/trainer/component/ProfileView';
// import CreateSportSession from "@/features/session/sportSession/component/CreateSportSession";
import Sessions from '@/features/session/component/Sessions';
import Bookings from '@/features/trainer/page/Bookings';
const TrainerRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TrainerDashboard />} />
      <Route path="/add-Profile" element={<TrainerProfileForm />} />
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/bookings" element={<Bookings />} />

      {/* <Route path='/sessions/create-Sport-session' element={<CreateSportSession />}/> */}
    </Routes>
  );
};

export default TrainerRoutes;
