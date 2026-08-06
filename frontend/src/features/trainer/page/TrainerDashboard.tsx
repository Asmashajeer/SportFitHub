import { TRAINER_STATUS } from '@/constants/constants';
import TrainerNotificationBanner from '../component/dashboard/TrainerNotificationBanner';
import { useTrainerStore } from '../store/useTrainerStore';
import TrainerWelcome from '../component/dashboard/TrainerWelcome';
import { useEffect } from 'react';

const TrainerDashboard = () => {
  const profile = useTrainerStore((state) => state.profile);
  const fetchProfile = useTrainerStore((state) => state.fetchProfile);
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className=" max-w-6xl ">
      <TrainerWelcome />
      {(profile?.status === TRAINER_STATUS.REJECTED || profile?.status === TRAINER_STATUS.SUSPENDED) && <TrainerNotificationBanner />}
    </div>
  );
};
export default TrainerDashboard;
