import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { ROLES, type UserRole } from '../../../constants/constants';
import { authService } from '../service/authService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const UserRoleSelector: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(ROLES.USER);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleContinue = async () => {
    if (!user) {
      console.log('no user');
      return;
    }

    const email = user.email;
    setIsLoading(true);

    try {
      const data = await authService.updateRole(email, selectedRole);
      setUser(data.user);
      const { role } = data.user;
      if (!user.hasProfile) {
        navigate(`/${role}/add-Profile`);
      } else if (role) {
        navigate(`/${role}/dashboard`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Invalid code');
      } else {
        toast.error('unexpecter error occured');
      }
      setIsLoading(false);
    }
  };
  const selectedRoleData = selectedRole;

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
      <div className=" w-full max-w-xs mx-auto  shadow-sm shadow-emerald-900 border  border-border rounded-4xl">
        <div className="  border-[#393f4a]   p-5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-[#f8fafca9] mb-1">
              Select Your Role
            </h3>
            <p className="text-slate-400 text-sm">
              Choose the role that best fits your needs
            </p>
          </div>

          {/* Dropdown */}
          <div className="mb-4">
            <label className="text-sm font-medium  text-slate-300 mb-1">
              User Role
            </label>
            <div className="relative">
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                {/* We remove the default shadcn border/ring here because the fieldset handles it */}
                <SelectTrigger className="w-full border-input bg-transparent px-3 h-9 focus:ring-0 focus:outline-none shadow-none font-medium">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>

                {/* This is the dropdown menu part */}
                <SelectContent className="bg-secondary border-border rounded-xl">
                  {Object.values(ROLES)
                    .filter((role) => role !== ROLES.ADMIN)
                    .map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="cursor-pointer focus:bg-[#197e04] focus:text-white"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-secondary/60 border border-[#454c59] text-white appearance-none focus:ring-2 focus:ring-primary outline-none transition-all duration-200 cursor-pointer"
              >
                {Object.values(ROLES)
                  .filter((role) => role !== ROLES.ADMIN)
                  .map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" /> */}
            </div>
          </div>

          {/* Selected Role Info */}
          {selectedRoleData && (
            <div className="mb-2 p-2">
              <div className="flex items-centerj justify-center ">
                <h2 className="text-primary  font-bold text-lg">
                  {selectedRole.toUpperCase()}
                </h2>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale bg-primary text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110"
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
          </Button>

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
