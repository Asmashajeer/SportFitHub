import { GoogleLogin } from "@react-oauth/google";

import { Input } from "../../../components/ui/Input";

import { useNavigate, Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { ROLES } from "../../../constants/constants";
import type { UserRole } from "../../../constants/constants";
import { authService } from "../service/authService";
import { useAuthStore } from "../store/useAuthStore";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.USER as UserRole,
  });

  const handleSuccess = async (credentialResponse: any) => {
    try {
      // credentialResponse.credential is the "ID Token" your backend wants
      const idToken = credentialResponse.credential;
      if (!idToken) {
        console.log(" google login failed");
        toast.error("google login failed");
        return;
      }
      console.log(idToken);
      const userData = await authService.googleLogin(idToken);
      console.log(userData);
      setAuth(userData.user, userData.accessToken);
      if (!Object.values(ROLES).includes(userData.role)) {
        return navigate("/update-role");
      }
      if (!userData.hasProfile) {
        if (userData.role === ROLES.TRAINER) {
          return navigate("/trainer/add-Profile");
        } else if (userData.role === ROLES.USER) {
          return navigate("/user/add-Profile");
        }
      } else {
        setHasProfile(userData.hasProfile);
        navigate(`/${userData.role}/dashboard`);
      }
    } catch (error) {
      console.error("Backend verification failed:", error);
    }
  };

  const handleFocus = () => {
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const result = isLogin
      ? LoginSchema.safeParse(formData)
      : RegisterSchema.safeParse(formData);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    const { email, password, role } = result.data;

    try {
      if (isLogin) {
        const data = await authService.login({ email, password, role });
        console.log(data);
        const { hasProfile, ...user } = data.user;
        const user_Role = user.role;
        console.log(user_Role);
        setAuth(data.user, data.accessToken);

        if (user.role === ROLES.ADMIN) {
          setHasProfile(true);
          return navigate("/admin/dashboard");
        }
        if (!data.isVerified) {
          return navigate("/verifyEmail", { state: data.user });
        }
        if (!Object.values(ROLES).includes(user.role)) {
          return navigate("/update-role");
        }
        if (!hasProfile) {
          if (user_Role === ROLES.TRAINER) {
            return navigate("/trainer/add-Profile");
          } else if (user_Role === ROLES.USER) {
            console.log("it is a user");
            return navigate("/user/add-Profile");
          }
        } else {
          setHasProfile(hasProfile);
          navigate(`/${user_Role}/dashboard`);
        }
      } else {
        const response = await authService.register({ email, password, role });
        toast.success(response.message);
        navigate("/verifyEmail", { state: response.data });
      }
    } catch (error: any) {
      console.error("Login Error", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div
          className="text-center mb-10 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl font-black tracking-tighter uppercase transition-transform group-hover:scale-105">
            <span className="text-gradient-primary">SportFit</span>Hub
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-bold tracking-widest uppercase">
            {isLogin ? " Login" : " Registration"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="--color-card border border-border p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-card/90">
          <form onSubmit={handleSubmit} className="space-y-1">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10  text-red-500 text-xs font-bold uppercase tracking-widest text-center ">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full bg-secondary border border-border rounded-xl px-5 py-4 text-foreground appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer font-medium"
                >
                  {Object.values(ROLES)
                    .filter((role) => role !== ROLES.ADMIN)
                    .map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onFocus={handleFocus}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            

            <div className="space-y-2 relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onFocus={handleFocus}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
             
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
            </div>
            {!isLogin && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300 relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onFocus={handleFocus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
               
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline ml-1"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button
              disabled={isSubmitting}
              type="submit"
              variant="primary"
              size="md"
              className="w-full  shadow-lg shadow-primary/10"
            >
              {isSubmitting
                ? isLogin
                  ? "Sign In..."
                  : "Creating Account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
          </div>

          {/* The Google Button Component */}
          <div className="flex justify-center mt-6 ">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_black" 
              size="large" 
              shape="pill" 
              width="390" 
              text="signin_with"
            />
          </div>

          {/* Footer Link */}
          <p className="mt-8 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {isLogin ? "New here?" : "Already a memeber "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-black hover:underline ml-2 cursor-pointer"
            >
              {isLogin ? "Join With Us" : "Login Now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
