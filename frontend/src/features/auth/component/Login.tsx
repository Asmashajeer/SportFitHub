import { Button } from '@/components/ui/Button';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { ROLES } from '../../../constants/constants';
import type { UserRole } from '../../../constants/constants';
import { authService } from '../service/authService';
import { useAuthStore } from '../store/useAuthStore';
import { LoginSchema } from '../types/auth.schema';
import { ArrowBigLeft, EyeIcon, EyeOffIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';


import { useBookingStore } from '@/features/booking/store/useBookingStore';
import { Input } from '@/components/ui/Input';


const Login = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    roles: [ROLES.USER as UserRole],
    activeRole: ROLES.USER as UserRole,
    timezone:"UTC"
  });
  const payload = useBookingStore((state) => state.payload);
  const from = location.state?.from || '';
  
  useEffect(() => {
    if (isAuthenticated && user?.isVerified ) {
      if (from && payload && user.activeRole===ROLES.USER) {
        navigate('/checkout');
        return;
      }
      const dashboardPath = Object.values(ROLES).includes(user.activeRole)
        ? `/${user.activeRole}/dashboard`
        : '/update-role';
       
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate , location, payload]);

  const handleRegister = () => {
    navigate('/register');
  };
  const handleFocus = () => {
    if (error) setError('');
  };


  const validateField=(name:string,value:string)=>{
    const result=LoginSchema.safeParse({...formData,[name]:value})
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
    
    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }
   
    const { email, password,roles,activeRole,timezone } = result.data;
    
    try {
      const data = await authService.login({ email, password,roles,activeRole,timezone });
      if(!data) {
        toast.error("Invalid email or password")
        return;
      }

      const user = data.user;
      const user_Role = user.activeRole;
      setUser(data.user);     

      if (!user.isVerified) {
        console.log('Navigating to verifyEmail');
        return navigate('/verifyEmail', { state: data.user });
      }
       else if (user.activeRole === ROLES.ADMIN) {
        setHasProfile(true);
        return navigate('/admin/dashboard', { replace: true });
      }
       else if (!Object.values(ROLES).includes(user.activeRole)) {
        return navigate('/update-role');
      }
       else if (!user.hasProfile && user.isVerified) {
          if (user_Role === ROLES.TRAINER) {
            console.log('user_Role:',user_Role);
            return navigate('/trainer/add-Profile', { replace: true });
          } else if (user_Role === ROLES.USER) {         
            return navigate('/user/add-Profile', { replace: true });
          }
      }
       else if (user.activeRole === ROLES.USER && user.isVerified) {
        setHasProfile(user.hasProfile);

        if (payload) {
          return navigate('/checkout');
        }
        
        navigate(`/${user_Role}/dashboard`, { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
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
            Login
          </p>
          <form onSubmit={handleSubmit} className="space-y-1">
            {error && (
              <div className="mb-4 p-3 rounded-xl  text-red-500 text-xs font-bold  tracking-widest text-center ">
                {error}
              </div>
            )}

            <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">
              <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                Email
              </legend>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onFocus={handleFocus}
                onChange={(e) =>{
                  setFormData({ ...formData, email: e.target.value });
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
                <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                  Password
                </legend>
                <Input
                  
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onFocus={handleFocus}
                  onChange={(e) =>{
                    setFormData({ ...formData, password: e.target.value })
                    validateField('password', e.target.value);
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline ml-1"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              variant="default"
              size="lg"
              className="w-full  shadow-lg shadow-primary/10"
            >
              {isSubmitting ? 'Sign In... ' : 'Sign In'}
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
            New here
            <Button size="sm" variant="outline" onClick={handleRegister}>
              Join With Us
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
