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
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
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
        className="nav-item opacity-50 cursor-not-allowed grayscale-[0.5]"
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
        className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
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
  const role = user?.role;
  const navLinks = role === ROLES.USER ? userNavLinks : trainerNavLinks;
  const trainerProfile = useTrainerStore((state) => state.profile);
  const fetchTrainer = useTrainerStore((state) => state.fetchProfile);
  const userProfile = useUserStore((state) => state.profile);
  const fetchUser = useUserStore((state) => state.fetchProfile);

  useEffect(() => {
    if (role === ROLES.TRAINER) fetchTrainer();
    else fetchUser();
  }, []);
  const handleLogout = async () => {
    try {
      await authService.logout();
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
              icon={<item.icon className="h-4.5 w-4.5" />}
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
            <SheetHeader className="p-6 border-b">
              <div className="flex flex-col items-center">
                <ProfilePic />
                <SheetTitle className="mt-2 italic font-black text-primary">
                  {user?.name}
                </SheetTitle>
              </div>
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
      <aside className="fixed top-16  w-64 h-[calc(100vh-4rem)] hidden md:flex flex-col  border-r  border-zinc-800 bg-black/80">
        <div className="p-5 flex flex-col items-center">
          <ProfilePic />
          <h1 className="text-xl font-black italic tracking-tighter text-primary">
            {user?.role === ROLES.ADMIN ? (
              'Admin'
            ) : (
              <span
                className={` ${user?.role === ROLES.TRAINER}? "text-amber-900":"text-primary" `}
              >
                {user?.name}
              </span>
            )}
          </h1>
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
