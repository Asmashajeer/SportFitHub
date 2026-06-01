// components/TrainerWelcome.tsx
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { TRAINER_STATUS } from "@/constants/constants";
import { useTrainerStore } from "../../store/useTrainerStore";
import NextSessionCard from "./NextSessionCard";
import TrainerNotificationBanner from "./TrainerNotificationBanner";


const TrainerWelcome = () => {
  const { user } = useAuthStore();
  const { profile } = useTrainerStore();  
  const status = profile?.status;
  const firstName = profile?.personalInfo?.fullName?.split(" ")[0]
    || "there";
  const hour = new Date().getHours();
  const greeting =
      hour < 12 ? "Good morning" :
      hour < 17 ? "Good afternoon" :
      "Good evening";
  // Pending approval
  if (status === TRAINER_STATUS.SUBMITTED) {
    return (
      <div className="bg-zinc-900   rounded-xl p-6">
        <div className="flex items-start gap-4">
          
          <div>
            <h2 className="text-xl font-semibold text-amber-700">
              Welcome, {firstName}! Your profile is  under review.
            </h2>
            <p className="text-zinc-300 mt-1 text-sm">
              Our team is reviewing your submitted documents and profile.
              This usually takes 1–2 business days. We'll notify you by
              email once you're approved.
            </p>          
          </div>
        </div>
      </div>
    );
  }

  // Approved — welcome
  if (status === TRAINER_STATUS.APPROVED) {
   
    return (
      <div className=" rounded-xl p-6">
        <div className=" flex flex-start left-0 ">        
            <h2 className="text-2xl font-semibold text-gray-500">
              {greeting}, {firstName}! 
            </h2>
      </div>
        <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your sessions today.
        </p>
        <div className="flex gap-6 text-center">

          <NextSessionCard/>  
        </div>
      </div>   
    );
  }

  //  Rejected
 
        
  
};

export default TrainerWelcome;