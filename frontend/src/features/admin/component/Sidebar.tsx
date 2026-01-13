// src/components/layout/Sidebar.tsx
import { LayoutDashboard, Settings, LogOut,  Users, Ticket, CalendarDays, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';

import { ROLES } from '../../../constants/constants';
import { authService } from '../../auth/service/authService'; 
import toast from 'react-hot-toast';
import { UseAdminStore } from '../store/useAdminStore';


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
    
      if(path){
        return(
           <Link 
              key={path}
              to={path}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              {icon}            
              <span>{label}</span>
            </Link>
        )
      }

      return( <div onClick={onClick}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              
              {icon}
              <span>{label}</span>
            </div>
          );
        
      
    
}

interface SidebarProps {
  activePage: string;
}


const Sidebar:React.FC<SidebarProps> = ({activePage}) => {

  const navigate=useNavigate();
  const user=useAuthStore(state=>state.user);
  const clearAuth=useAuthStore(state=>state.clearAuth);
  const clearStore=UseAdminStore(state=>state.clearAdminData);
  const handleLogout=async ()=>{      
            try{
                await authService.logout();
                clearAuth();   
                clearStore();           
                navigate('/login');   
               toast.success("Logging out.....") ;
            }
            catch(error:any){
                   toast.error(error.message) ;
            }
            
                
        }
  return (
    <aside className="sidebar-container">
       <span className="text-xl md:text-2xl font-extrabold tracking-tighter font-sans uppercase">
            <span className="text-primary">SportFit</span>
            <span className="text-foreground">Hub</span>
          </span>
      <div className="p-8">
        <h1 className="text-2xl font-black italic tracking-tighter text-primary">
          {user?.role===ROLES.ADMIN ?'Admin':<span className="">user</span>}
        </h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <div>
            <SidebarItem 
              path="/admin/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              isActive={activePage === "Dashboard"}/>
            <SidebarItem 
                path="/admin/user-management"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                isActive={activePage === "Users"}
                onClick={()=>navigate('/admin/user-management')}
            />
            <SidebarItem 
                path="/admin/session-management"
                icon={<Ticket className="h-5 w-5" />}
                label="Sessions"
                isActive={activePage === "Sessions"}
                onClick={()=>navigate('/admin/session-management')}
            />
            <SidebarItem 
                path="/admin/camp-management"
                icon={<CalendarDays className="h-5 w-5" />}
                label="Camps"
                isActive={activePage === "Camps"}
                onClick={()=>navigate('/admin/camp-management')}
            />
              <SidebarItem 
                path="/admin/approvals"
                icon={<ShieldCheck className="h-5 w-5" />}
                label="Approvals"
                isActive={activePage === "Approvals"}
                onClick={()=>navigate('/admin/approvals')}
            />
              <SidebarItem 
                path="/admin/coupons"
                icon={<Ticket className="h-5 w-5" />}
                label="Coupons"
                isActive={activePage === "Coupons"}
                onClick={()=>navigate('/admin/coupons')}
            />
            <SidebarItem 
                path="/admin/settings"
                icon={<Settings className="h-5 w-5" />}
                label="settings"
                isActive={activePage === "Settings"}
                onClick={()=>navigate('/admin/settings')}
            />
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