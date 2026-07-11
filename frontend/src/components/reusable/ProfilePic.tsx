import { ROLES } from '@/constants/constants';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

function ProfilePic() {
  const user = useAuthStore((state) => state.user);

  const alias = user?.name?.[0].toUpperCase();

  return (
    <div className="flex items-center text-center gap-2  pb-2">
      <div
        className={` flex text-sm items-center w-10 h-10 rounded-full ${user?.activeRole === ROLES.TRAINER ? 'bg-amber-900' : 'bg-primary'} text-shadow-primary justify-center font-bold`}
      >
        {alias}
      </div>
      <div className=' text-start'>
          <p className="py-0 ">{user?.name}</p>
          {user &&
            <span className="text-xs py-0 text-green-500">{user?.activeRole[0].toUpperCase()+user?.activeRole.slice(1)}</span>
          }
      </div>     
    </div>
  );
}
export default ProfilePic;
