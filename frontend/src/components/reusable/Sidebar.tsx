import { LogOut, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

import { ROLES, TRAINER_STATUS } from '../../constants/constants';
import { authService } from '../../features/auth/service/authService';
import toast from 'react-hot-toast';
import { UseAdminStore } from '../../features/admin/store/useAdminStore';
import { userNavLinks } from '../../constants/constants';
import { trainerNavLinks } from '../../constants/constants';

import ProfilePic from '../reusable/ProfilePic';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/Button';
import { useTrainerStore } from '@/features/trainer/store/useTrainerStore';
import { useEffect } from 'react';
import { useUserStore } from '@/features/user/store/useUserStore';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  isActive,
  path,
  disabled,
  onClick,
}) => {
  if (disabled) {
    return (
      <div
        className="nav-item opacity-50 cursor-not-allowed text-sm  grayscale-[0.5]"
        title="Verification Required"
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  }
  if (path) {
    return (
      <Link
        key={path}
        to={path}
        className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} p-3`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearStore = UseAdminStore((state) => state.clearAdminData);
  const role = user?.activeRole;
  const navLinks = role === ROLES.USER ? userNavLinks : trainerNavLinks;
  const trainerProfile = useTrainerStore((state) => state.profile);
  const fetchTrainer = useTrainerStore((state) => state.fetchProfile);

  const fetchUser = useUserStore((state) => state.fetchProfile);

  useEffect(() => {
    if (role === ROLES.TRAINER) fetchTrainer();
    else fetchUser();
  }, []);
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      if (user?.id) {
        localStorage.removeItem(`trainer_onboarding_cache_${user.id}`);
      }
      clearAuth();
      clearStore();
      navigate('/login');
      toast.success('Logging out.....');
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('unexpected error occured while logout');
    }
  };
  const NavLinksList = () => (
    <nav>
      <div>
        {navLinks.map((item) => {
          const isPublicPath =
            item.path.includes('dashboard') || item.path.includes('profile'); // unverified trainer path
          const isTrainer = role === ROLES.TRAINER;
          const isUnverified =
            trainerProfile?.status !== TRAINER_STATUS.APPROVED;

          const isDisabled = isTrainer && isUnverified && !isPublicPath;
          return (
            <SidebarItem
              key={item.label}
              path={item.path}
              icon={<item.icon className="h-4 w-4" />}
              label={item.label}
              isActive={pathname === item.path}
              disabled={isDisabled}
            />
          );
        })}
      </div>
    </nav>
  );
  return (
    <>
      {/* MOBILE HAMBURGER MENU  */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetHeader className="text-start border-b">              
                <ProfilePic />  
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-2">
              <NavLinksList />
            </div>

            <div className="p-2 border-t border-border/50">
              <button
                onClick={handleLogout}
                className="nav-item nav-item-inactive w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR  */}
      {/* <aside className="sticky sidebar-container top-16 h-[calc(100vh-4rem)] hidden md:block overflow-y-auto"> */}
      <aside className="relative top-16  w-64 h-[calc(100vh-4rem)] hidden md:flex flex-col  border-r ">
        <div className=" flex  items-center  text-center border-b-2">
          <ProfilePic />    
        </div>
        <NavLinksList />

        {/* Logout Bottom Section */}
        <div className="p-3 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="nav-item nav-item-inactive w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
