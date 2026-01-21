import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../service/authService";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  KeyRound,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

// import { ResetPasswordSchema } from "../types/auth.schema";
// import z from "zod";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // const result =ResetPasswordSchema.safeParse({email,otp,newPassword});
    // if (!result.success) {
    //   const error = z.treeifyError(result.error).errors[0];
    //   setError(error);
    //   return;
    // }

    setError("");
    try {
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword,
      });
      toast.success(response.message);
      setIsLoading(false);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.message || "Invalid code");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleTryAgain = () => {
    setError("");
  };
  return (
    <>
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="w-full max-w-md card-base ">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-[#f8fafca9] mb-2">
              Check Your Email
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              We sent averification Code to
              <span className="block text-white font-medium mt-1">{email}</span>
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 bg-primary text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110 mb-4"
            >
              Back to Login
              <ArrowRight className="w-5 h-5" />
            </button>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* 1. Verification Code Field */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 2. New Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale bg-primary text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            <p className="text-slate-400 text-sm">
              Didn't receive the email?{" "}
              <button
                onClick={handleTryAgain}
                className="text-primary font-medium hover:underline"
              >
                Click to resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
