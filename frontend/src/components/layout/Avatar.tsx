import { useState } from "react";

import { authService } from "../../features/auth/service/authService";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ROLES } from "@/constants/constants";
import { UserCog } from "lucide-react";
import Dashboard from "@/features/admin/component/dashboard";


function Avatar() {
     const {user,isAuthenticated} = useAuthStore();
     const navigate=useNavigate();
     const clearAuth=useAuthStore((state)=>state.clearAuth);
     const alias=user?.role!==ROLES.ADMIN ?user?.name?.[0].toUpperCase():<UserCog/>;
     const[menu,setMenu]=useState(false);
     
     const handleLogout=async ()=>{      
            try{
                await authService.logout();
                clearAuth();
                setMenu(false);
                navigate('/login');   
            
            }
            catch(error:unknown){
                if (error instanceof Error) {
                    toast.error("Failed to logout " + error.message);
                } else {
                    toast.error("An unexpected error occurred");
                }
                console.error(error)
            }          
                
        }
        const ToDashboard=()=>{
            user && navigate(`${user.role}/dashboard`);
        }
            
     
  return (
    <div className="flex items-center gap-3">
        <div onClick={()=>setMenu(!menu)} className=" flex items-center w-10 h-10 rounded-full bg-primary text-shadow-primary justify-center font-bold">
            {alias}        
        {menu && isAuthenticated &&(
           <div className="absolute top-18 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
            <button onClick={ToDashboard} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-500">Dashboard</button>
            <hr className="my-1 " />
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800">
                Logout
            </button>
           </div>
        )}
    </div>
    </div>
  )
}



export default Avatar

