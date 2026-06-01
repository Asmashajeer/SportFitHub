import { ROLES } from '@/constants/constants';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

function ProfilePic() {
  const user = useAuthStore((state) => state.user);

  const alias = user?.name?.[0].toUpperCase();

  return (
    <div className="flex items-center justify-around pb-2">
      <div
        className={` flex text-2xl items-center w-10 h-10 rounded-full ${user?.role === ROLES.TRAINER ? 'bg-amber-900' : 'bg-primary'} text-shadow-primary justify-center font-bold`}
      >
        {alias}
      </div>
    </div>
  );
}
export default ProfilePic;
