import React, { useState } from 'react';
import { UserCog,  ChevronDown, ArrowRight } from 'lucide-react';
import { ROLES, type UserRole } from '../../../constants/constants';
import { authService } from '../service/authService';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';



const UserRoleSelector: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(ROLES.USER);
  const [isLoading, setIsLoading] = useState(false);

    const navigate=useNavigate();
    const user=useAuthStore(state=>state.user);
    const setAuth=useAuthStore(state=>state.setAuth);
    



  const handleContinue = async () => {
  
      console.log("selectedrole",selectedRole);
      console.log("user",user);
 
    if(!user) {
      console.log("no user");
      return;
    }
    const email=user.email;

    setIsLoading(true);    
   
     try{
            console.log(email);
            const data= await authService.updateRole(email,selectedRole);
            setAuth(data.user,data.accessToken);
           
            if (!user!.hasProfile &&user!.role===ROLES.USER) {
              navigate('/user/add-Profile');
            } else if(!user!.hasProfile &&user!.role===ROLES.TRAINER) {
               navigate('/trainer/add-Profile');
             
            }
            else{
             navigate(`/${user?.role}/dashboard`);
            }
           
           
           
          } 
          catch(error:any){
                toast.error(error.message || "Invalid code");
                         
            } 
   
    console.log('Selected Role:', selectedRole);

    setIsLoading(false);
   
  };

  const selectedRoleData =  selectedRole;

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-secondary border border-[#454c59] rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <UserCog className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-[#f8fafca9] mb-2">
              Select Your Role
            </h1>
            <p className="text-slate-400 text-sm">
              Choose the role that best fits your needs
            </p>
          </div>

          {/* Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              User Role
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-secondary/60 border border-[#454c59] text-white appearance-none focus:ring-2 focus:ring-primary outline-none transition-all duration-200 cursor-pointer"
              >
                
                {Object.values(ROLES).filter((role)=>role!==ROLES.ADMIN).map((role) => (
                  <option key={role} value={role}>
                   {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Selected Role Info */}
          {selectedRoleData && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                
                <div>
                  <h3 className="text-primary font-bold text-lg">
                    {selectedRole}
                  </h3>
                  
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale bg-primary text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Helper Text */}
          {!selectedRole && (
            <p className="text-center text-slate-500 text-sm mt-4">
              Please select a role to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoleSelector;