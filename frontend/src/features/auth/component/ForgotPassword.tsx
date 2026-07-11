import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../service/authService';
import toast from 'react-hot-toast';
import { EmailSchema } from '../types/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = EmailSchema.safeParse(email);
    if (!result.success) {
      const errorMessage = result?.error?.issues[0].message || 'check mail';
      setError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      await authService.forgotPassword(email);
      toast.success('Please check your mail for verification code.');
      navigate('/reset-Password', { state: { email: email } });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleFocus = () => {
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
      <div className="w-full max-w-sm ">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        {/* Main Card */}
        <div className="--color-card border border-[#454c59] rounded-3xl shadow-4xl p-8">
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-[#f8fafca9] mb-2">
                Forgot Password?
              </h3>
              <p className="text-slate-400 text-sm">
                No worries, we'll send you reset instructions
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onFocus={handleFocus}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary outline-none transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-2  font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale bg-primary text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    send Verification Code
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-sm mt-3">
          Remember your password?{' '}
          <button
            onClick={handleBackToLogin}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
