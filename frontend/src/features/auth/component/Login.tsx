

import { Input } from "@/components/ui/input";

import { Button } from "../../../components/ui/button"; 
import { useNavigate, Link } from "react-router-dom";

import { ROLES } from "../../../constants/constants";
import type { UserRole } from "../../../constants/constants";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/useAuthStore";
import { LoginSchema } from "../types/auth.schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";


const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  // const authUser = useAuthStore((state) => state.user);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  // const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({   
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.USER as UserRole,
  });


const handleRegister = () => {
    navigate('/register');
  };
  const handleFocus = () => {
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const result =  LoginSchema.safeParse(formData)
     
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    const { email, password, role } = result.data;

    try {
      
        const data = await authService.login({ email, password, role });       
        const user  = data.user;
        const user_Role = user.role;      
        setUser(data.user);
        console.log(data.user);
        console.log(user.isVerified,"  is Verified?");
        if (!user.isVerified) {
          console.log("Navigating to verifyEmail");
          return navigate("/verifyEmail", { state: data.user });
        }        
        else if (user.role === ROLES.ADMIN) {
          setHasProfile(true);
          return navigate("/admin/dashboard", { replace: true });
        }
        else if (!Object.values(ROLES).includes(user.role)) {
          return navigate("/update-role");
        }
        else if (!user.hasProfile && user.isVerified) {
          if (user_Role === ROLES.TRAINER) {
            return navigate("/trainer/add-Profile", { replace: true });
          } else if (user_Role === ROLES.USER) {
            console.log("it is a user");
            return navigate("/user/add-Profile", { replace: true });
          }
        } else if(user.isVerified) {
          setHasProfile(user.hasProfile);
          console.log("toDashboard");
          navigate(`/${user_Role}/dashboard`, { replace: true });
        }
      
    } catch (error) {
        toast.error(error?.toString() || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-hero">
      <div className="w-full max-w-sm">
        <div
          className="text-center mb-10 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl font-black tracking-tighter uppercase transition-transform group-hover:scale-105">
            <span className="text-primary">SportFit</span>Hub
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-bold tracking-widest uppercase">
           Login
          </p>
        </div>

        {/* Auth Card */}
        <div className="--color-card border border-border p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-card/90">
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </fieldset>

            <div className="space-y-2 relative w-full">
              <fieldset className="relative text-left rounded-md py-1  focus-visible:border-ring-0 ">     
                <legend className=" text-[10px] font-medium  tracking-wider text-foreground bg-transparent ">
                  Password
                </legend>
                <Input
                  // label={'Email'}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onFocus={handleFocus}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
              {isSubmitting  ? 'Sign In... ' :  'Sign In' }
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
          </div>

          <GoogleLoginButton/>

          {/* Footer Link */}
          <p className="mt-8 text-center text-xs text-shadow-muted-foreground font-medium uppercase tracking-widest">
            New here
            <Button
              size="sm" variant="outline"
              onClick={ handleRegister}             
            >
              Join With Us
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
