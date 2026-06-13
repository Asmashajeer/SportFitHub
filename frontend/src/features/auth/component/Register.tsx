import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../../constants/constants';
import type { UserRole } from '../../../constants/constants';
import { authService } from '../service/authService';
import { useAuthStore } from '../store/useAuthStore';
import { RegisterSchema } from '../types/auth.schema';
import { ArrowBigLeft, EyeIcon, EyeOffIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';

const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { isAuthenticated, user } = useAuthStore();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.USER as UserRole,
    timezone:'UTC',
  });

  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
    const dashboardPath = Object.values(ROLES).includes(user.role)
          ? `/${user.role}/dashboard`
          : '/update-role';
        navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user]);

  const handleFocus = () => {
    if (error) setError('');
  };

  const handleLogin = () => {
    navigate('/login');
  };
   const validateField=(name:string,value:string)=>{
      const result=RegisterSchema.safeParse({...formData,[name]:value})
      if(!result.success){
        const fieldError=result.error.issues.find(issue=>issue.path[0]===name);
        setFieldErrors(prev=>({
          ...prev,
          [name]:fieldError?.message || ''}));
  
      }
      else {
        setFieldErrors(prev=>({
          ...prev,
          [name]: ''}));
      }
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    formData.timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    const { name, email, password, role,timezone } = result.data;

    try {
      const data = await authService.register({ name, email, password, role ,timezone});
      const userData = data.user;
      setUser({ ...userData, hasProfile: false });
      toast.success(data.message);
      navigate('/verifyEmail', { state: data.user });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-hero">
      <div className="w-full max-w-sm">
         <div className=" flex justify-start">
          <Button variant="ghost" className='justify-start left-0'  onClick={() => navigate('/')}> <ArrowBigLeft/>Home</Button>
       </div>
          <div   
          className="flex justify-center mb-6 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img 
              src="/sportfithub_logo.png" 
              alt="SportFitHub" 
              className="h-10 w-auto   object-contain transition-transform group-hover:scale-105"
          />         
        </div>

        {/* Auth Card */}
        <div className="--color-card border pt-4 border-border p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-card/90">
          <p className="text-muted-foreground mt-2 text-sm font-bold tracking-widest uppercase">
              Registration
            </p>
          <form onSubmit={handleSubmit} className="space-y-1">
            {error && (
              <div className="mb-4 p-3 rounded-xl  text-red-500 text-xs font-bold  tracking-widest text-center ">
                {error}
              </div>
            )}
            <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
              {/* The legend sits on the border line */}
              <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                Name
              </legend>
              <Input
                type="text"
                placeholder="Name"
                value={formData.name}
                onFocus={handleFocus}
                onChange={(e) =>{
                  setFormData({ ...formData, name: e.target.value })
                  validateField('name',e.target.value );
                }}
              />
               {fieldErrors.name && (
              <p className="text-red-500 text-[10px] mt-1 tracking-wider">
                {fieldErrors.name}
              </p>
            )}
            </fieldset>
            <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
              {/* The legend sits on the border line */}
              <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                Email
              </legend>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onFocus={handleFocus}
                onChange={(e) =>{
                  setFormData({ ...formData, email: e.target.value })
                  validateField('email',e.target.value );
                }}
              />
               {fieldErrors.email && (
              <p className="text-red-500 text-[10px] mt-1 tracking-wider">
                {fieldErrors.email}
              </p>
            )}
            </fieldset>
            <div className="space-y-2 relative w-full">
              <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
                {/* The legend sits on the border line */}
                <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                  Password
                </legend>
                <Input
                  // label={'Email'}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onFocus={handleFocus}
                  onChange={(e) =>{
                    setFormData({ ...formData, password: e.target.value })
                    validateField('password',e.target.value );
                  }}
                />
                {/* show password button */}
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 p-0 flex items-center justify-center min-w-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4 text-green-700" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4  text-green-700" />
                  )}
                </Button>
                 {fieldErrors.password && (
                    <p className="text-red-500 text-[10px] mt-1 tracking-wider">
                      {fieldErrors.password}
                    </p>
                  )}
              </fieldset>
            </div>

            <div className="animate-in slide-in-from-top-2 fade-in duration-300 relative w-full">
              <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
                <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                  Confirm Password
                </legend>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onFocus={handleFocus}
                  onChange={(e) =>{
                    setFormData({  ...formData,  confirmPassword: e.target.value})
                    validateField('confirmPassword',e.target.value );
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 p-0 flex items-center justify-center min-w-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="h-4 w-4 text-green-700" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4  text-green-700" />
                  )}
                </Button>
                {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-[10px] mt-1 tracking-wider">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
              </fieldset>
            </div>
            {/*user role  */}
            <div className="relative">
              <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
                <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                  Role
                </legend>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as UserRole,
                    })
                  }
                >
                  <SelectTrigger className="w-full border-input bg-transparent px-3 h-9 focus:ring-0 focus:outline-none shadow-none font-medium">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>

                  {/* user roles */}
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
              </fieldset>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              variant="default"
              size="lg"
              className="w-full  shadow-lg shadow-primary/10"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
          </div>

          <GoogleLoginButton />

          {/* Footer Link */}
          <p className="mt-8 text-center text-xs text-shadow-muted-foreground font-medium uppercase tracking-widest">
            Already a memeber
            <Button onClick={handleLogin}>Login Now"</Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
