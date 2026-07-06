import { LogOut, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { adminNavLinks } from '../../../constants/constants';
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

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, isActive, path, onClick }) => {
  if (path) {
    return (
      <Link
        to={path}
        onClick={onClick}
        className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} p-2`}
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
  onClose?: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ activePage, onClose }) => {
  const navLinks = adminNavLinks;
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
    <div className="flex flex-col h-full gap-2">
      {/* Logo */}
      <span className="text-xl font-extrabold tracking-tighter uppercase">
        <span className="text-primary">SportFit</span>
        <span className="text-foreground">Hub</span>
      </span>

      {/* Profile */}
      <div className="flex flex-col items-center py-4 border-b border-zinc-800">
        <ProfilePic />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navLinks.map((item) => (
          <SidebarItem
            key={item.label}
            path={item.path}
            icon={<item.icon className="h-4 w-4" />}
            label={item.label}
            isActive={pathname === item.path}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Logout */}
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