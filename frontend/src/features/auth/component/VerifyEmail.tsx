import { useState, useRef, useEffect } from 'react';
// import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
    import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../service/authService';
import { useAuthStore } from '../store/useAuthStore';
import { OTP_EXPIRATION_MINUTES, OTP_TYPE, ROLES } from '../../../constants/constants';



const VerifyEmail = () => {
    
    const OTP_EXPIRATION_MS = OTP_EXPIRATION_MINUTES * 60 * 1000;
    const location=useLocation();
    const {email}=location.state;
    const navigate=useNavigate();
    const {user}=useAuthStore();
    const {setUser}=useAuthStore();
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(OTP_EXPIRATION_MINUTES*60);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [canResend, setCanResend] = useState(false);
   
    
    
    
    const startTimer=()=>{
        const expiry=Date.now()+OTP_EXPIRATION_MS;
        localStorage.setItem("otpExpiry",expiry.toString());
        setTimeLeft(OTP_EXPIRATION_MINUTES*60);        
    }
    useEffect(()=>{
        const savedExpiry=localStorage.getItem("otpExpiry");
        const now=Date.now();
        if(savedExpiry){
            if ((parseInt(savedExpiry))>now){
                setTimeLeft (Math.floor(parseInt(savedExpiry)-now)/1000);   
            }
            localStorage.removeItem("otpExpiry");
            setCanResend(true);
        }
        else{
            startTimer();
        }
    },[]);

   
    useEffect(() => {
        
        if (timeLeft > 0) {
          const   interval = setInterval(() => {
             setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } 
        else {
            setCanResend(true);
            localStorage.removeItem("otpExpiry");
        }
        
    }, [timeLeft]);


        // Helper to format 60 into 0:60 or 1:00
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
        setOtp(value);

        // Auto-submit when 6 digits are reached
        if (otp.length === 6) {
           handleVerify(otp);
        }
    };

    const handleVerify = async (otpValue: string) => {
        setIsLoading(true);
        try {
            if (!user) {
                return navigate ('/login');       
            }
            
            const userData=await authService.verify({ email, otp: otpValue });
            console.log(userData);
            toast.success("Verification successful!");
            setUser(userData.user);
            const userRole=userData.user.role;
            userRole===ROLES.USER && navigate('/user/add-UserProfile');       
            userRole===ROLES.TRAINER && navigate('/trainer/add-TrainerProfile')   ;      
        } 
        catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid code");
            setOtp(""); // Clear on error
            inputRef.current?.focus();
        } 
        finally {
            setIsLoading(false);
        }
    };

    // resend otp
    const handleResend = async() => {
        if (!canResend) return;
        const otpContext=OTP_TYPE.VERIFICATION;
        const result=await authService.resendOtp({email,otpContext})
        setOtp('');
        startTimer();
        setCanResend(false);
        toast.custom(result.message);
        inputRef.current?.focus();        
        
    };
  return (
    <div className='flex items-center justify-center p-4 ' >
            <div className="space-y-8  card-base p-8">
            <div className="text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                Verify <span className="text-primary">OTP</span>
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                Enter the 6-digit code sent to <br/>
                <span className="text-white font-medium">{email}</span>
                </p>
            </div>

            <div className="relative flex justify-center">
                {/* 1. THE ACTUAL HIDDEN INPUT (Logic) */}
                <input
                ref={inputRef}
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={6}
                autoFocus
                className="absolute inset-0 opacity-0 z-10 cursor-default"
                />

                {/* 2. THE VISUAL BOXES (Design) */}
                <div className="flex gap-3">
                {[...Array(6)].map((_, i) => (
                    <div
                    key={i}
                    className={`w-12 h-14 flex items-center justify-center text-xl font-bold rounded-xl border transition-all duration-200
                        ${otp.length === i ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border bg-secondary/40'}
                        ${otp[i] ? 'text-white' : 'text-slate-600'}`}
                    >
                    {otp[i] || "0"}
                    </div>
                ))}
                </div>
            </div>

            <div className="space-y-4">
                <button 
                onClick={() => handleVerify(otp)}
                disabled={isLoading || otp.length < 6} 
                className="btn-primary"
                >
                {isLoading ? 'Verifying...' : 'Confirm Verification'}
                </button>

                <div className="text-center">
                {canResend?(
                    <button 
                        type="button"
                        onClick={handleResend}
                        className="text-xs uppercase tracking-widest font-black text-primary hover:brightness-125 transition-all"
                    >
                        Resend New Code
                    </button>):
                    <p className="text-slate-400 text-sm">
                        Resend OTP in{' '}
                        <span className="text-primary font-bold">{formatTime(timeLeft)}</span>
                        </p>
                    }
                </div>
            </div>
            </div>
    </div>
  );
};

export default VerifyEmail;

