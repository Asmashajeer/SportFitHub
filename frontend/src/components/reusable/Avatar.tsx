import { useEffect, useState } from 'react';

import { authService } from '../../features/auth/service/authService';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROLES } from '@/constants/constants';
import { Bell, UserCog } from 'lucide-react';

import { userService } from '@/features/user/service/userService';

import { trainerService } from '@/features/trainer/service/trainerService';
import { Button } from '../ui/Button';
import { chatService } from '@/features/chat/service/chatService';
import { useChatStore } from '@/features/chat/store/useChatStore';
import { Badge } from '../ui/badge';

function Avatar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const {unreadMessageCountInbox,setUnreadMessageCountInbox}=useChatStore();
  const alias =
    user?.activeRole !== ROLES.ADMIN ? user?.name?.[0].toUpperCase() : <UserCog />;
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const loadProfilePic = async () => {
      try {
        if (user?.id && !user.profilePic) {
          if (user?.activeRole === ROLES.USER && user.hasProfile) {
            const data = await userService.getProfilePic(user?.id);                        
            setUser({ ...user, profilePic: data?.profilePic });
          } else if (user?.activeRole === ROLES.TRAINER && user.hasProfile) {
            const data = await trainerService.getProfilePic();
            
            setUser({ ...user, profilePic: data?.profilePic });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loadMessageCount=async()=>{
        const unreadCount= await chatService.getUnreadMessageCount();
        setUnreadMessageCountInbox(unreadCount)
    }

    loadProfilePic();
    loadMessageCount();
  }, [user?.hasProfile, user?.profilePic,unreadMessageCountInbox]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      setMenu(false);
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to logout ' + error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error(error);
    }
  };


  const ToDashboard = () => user && navigate(`/${user.activeRole}/dashboard`);

  return (
    <div className="flex items-center gap-3  ">
      <Button
        variant="ghost"
        className="relative p-1 flex  justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors group hover:cursor-pointer"
        onClick={()=>navigate(`/${user?.activeRole}/messages`)}
      >
        <Bell 
          className={`w-5 h-5 ${user?.activeRole === ROLES.TRAINER ? 'text-trainer-primary  group-hover:text-trainer-primary' : 'text-primary  group-hover:text-primary'} transition-colors`}        
        />
        <Badge className="absolute text-[8px] text-white px-1 right-0 top-0">{unreadMessageCountInbox}</Badge>
        
      </Button>

      <div
        onClick={() => setMenu(!menu)}
        className=" flex items-center w-10 h-10 rounded-full bg-primary text-shadow-primary justify-center font-bold"
      >
        {user?.profilePic ? (
          <img
            src={`${user.profilePic}?v=${new Date()}`}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div
            className={`flex items-center justify-center w-full h-full rounded-full ${user?.activeRole === ROLES.TRAINER ? 'bg-trainer-primary' : 'bg-primary'}  text-white text-xs`}
          >
            {alias}
          </div>
        )}
        {menu && isAuthenticated && (
          <div className="absolute top-18 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-99 animate-in fade-in zoom-in duration-200 origin-top-right">
            <button
              onClick={ToDashboard}
              className="w-full text-left   px-4 py-2 text-sm hover:bg-gray-500"
            >
              Dashboard
            </button>
            <hr className="my-1 " />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
