import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Ticket,
  CalendarDays,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';

import { ROLES } from '../../../constants/constants';
import { authService } from '../../auth/service/authService';
import toast from 'react-hot-toast';
import { UseAdminStore } from '../store/useAdminStore';
import ProfilePic from '../../../components/reusable/ProfilePic';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  isActive,
  path,
  onClick,
}) => {
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

interface SidebarProps {
  activePage: string;
}

const AdminSidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearStore = UseAdminStore((state) => state.clearAdminData);
  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      clearStore();
      navigate('/login');
      toast.success('Logging out.....');
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };
 
return (
  <div className="flex flex-col  gap-2">

    {/* Logo */}
    <span className="text-xl font-extrabold tracking-tighter uppercase">
      <span className="text-primary">SportFit</span>
      <span className="text-foreground">Hub</span>
    </span>

    {/* Profile */}
    <div className="flex flex-col items-center py-4 border-b border-zinc-800">
      <ProfilePic />
      <h1 className="text-sm font-bold mt-2 text-primary">
        {user?.role === ROLES.ADMIN && 'Admin'}
      </h1>
    </div>

    
    <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
      <div>    

        <SidebarItem path="/admin/dashboard"          icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard"  isActive={activePage === 'Dashboard'} />
        <SidebarItem path="/admin/category-management"icon={<Layers className="h-5 w-5" />}          label="Categories"  isActive={activePage === 'Categories'} />
        <SidebarItem path="/admin/user-management"    icon={<Users className="h-5 w-5" />}           label="Users"       isActive={activePage === 'Users'} />
        <SidebarItem path="/admin/trainer-management" icon={<ShieldCheck className="h-5 w-5" />}     label="Trainers"    isActive={activePage === 'Trainers'} />
        <SidebarItem path="/admin/session-management" icon={<Ticket className="h-5 w-5" />}          label="Sessions"    isActive={activePage === 'Sessions'} />
        <SidebarItem path="/admin/bookings-management"    icon={<CalendarDays className="h-5 w-5" />}    label="Bookings"       isActive={activePage === 'Bookings'} />
        <SidebarItem path="/admin/payment-management"    icon={<CalendarDays className="h-5 w-5" />}    label="Payments"       isActive={activePage === 'Payments'} />
        
        <SidebarItem path="/admin/camp-management"    icon={<CalendarDays className="h-5 w-5" />}    label="Camps"       isActive={activePage === 'Camps'} />
        <SidebarItem path="/admin/coupons"            icon={<Ticket className="h-5 w-5" />}          label="Coupons"     isActive={activePage === 'Coupons'} />
        <SidebarItem path="/admin/settings"           icon={<Settings className="h-5 w-5" />}        label="Settings"    isActive={activePage === 'Settings'} />
      </div>  
    </nav>

    <div className="border-t border-zinc-800 pt-1">
      <button onClick={handleLogout} className="nav-item nav-item-inactive w-full">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>

  </div>
);
};
export default AdminSidebar;
