// src/components/layout/Sidebar.tsx
import { LogOut} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

import { ROLES } from '../../constants/constants';
import { authService } from '../../features/auth/service/authService';
import toast from 'react-hot-toast';
import { UseAdminStore } from '../../features/admin/store/useAdminStore';
import { userNavLinks } from '../../constants/constants';
import { trainerNavLinks } from '../../constants/constants';
import Avatar from './Avatar';
import ProfilePic from '../.ui.compo/ProfilePic';
// import UserRoleSelector from '@/features/auth/component/UserRoleSelector';

interface SidebarItemProps{

  label:string,
  icon:React.ReactNode,
  path:string,
  isActive:boolean,
  onClick?:()=>void,
}
const SidebarItem:React.FC<SidebarItemProps>=( {
  
  label,
  icon,
  isActive,
  path,
  onClick})=>{
    
    //  <nav className="flex-1 space-y-1">
      if(path){
        return(
           <Link 
              key={path}
              to={path}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              {icon}
              {/* <icon size={20} strokeWidth={isActive ? 2.5 : 2} /> */}
              <span>{label}</span>
            </Link>
        )
      }

      return( <div onClick={onClick}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              {/* <icon size={20} strokeWidth={isActive ? 2.5 : 2} /> */}
              {icon}
              <span>{label}</span>
            </div>
          );
        
      // </nav>
    
}

interface SidebarProps {
  activePage: string;
}


const Sidebar:React.FC<SidebarProps> = ({activePage}) => {
  // const { pathname } = useLocation();
  const navigate=useNavigate();
  const user=useAuthStore(state=>state.user);
  const clearAuth=useAuthStore(state=>state.clearAuth);
  const clearStore=UseAdminStore(state=>state.clearAdminData);
  const role=user?.role ;
  const navLinks=role===ROLES.USER?userNavLinks:trainerNavLinks;

  const handleLogout=async ()=>{      
            try{
                await authService.logout();
                clearAuth();   
                clearStore();           
                navigate('/login');   
               toast.success("Logging out.....") ;
            }
            catch(error:unknown){
              if(error instanceof Error)
                   toast.error(error.message) ;
              else
                toast.error("unexpected error occured while logout");
            }
            
                
        }
  return (
    <aside className="sidebar-container sticky top-16 h-[calc(100vh-4rem)] hidden md:block">
      
      <div className="p-8 flex flex-col items-center">

        <ProfilePic/>
        <h1 className="text-xl font-black italic tracking-tighter text-primary">
          {user?.role===ROLES.ADMIN ?'Admin':<span className={` ${user?.role===ROLES.TRAINER}? "text-amber-900":"text-primary" `}>{user?.name}</span>}
        </h1>
      </div>
      
      {/* Navigation Links */}
      <nav>
        <div>
          {navLinks.map((item)=>(
              <SidebarItem 
                    key={item.label}
                    path={item.path}
                    icon={<item.icon className="h-5 w-5" />}
                    label={item.label}
                    isActive={activePage === item.label}
              />
          ))}
            

        </div>
      </nav>
      

      {/* Logout Bottom Section */}
      <div className="p-4 border-t border-border/50">
        <button onClick={handleLogout} className="nav-item nav-item-inactive w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;