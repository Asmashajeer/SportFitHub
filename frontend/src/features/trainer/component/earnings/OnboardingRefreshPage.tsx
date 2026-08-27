// OnboardingRefresh.tsx
import { useEffect } from 'react';

import { StripeConnectService } from '../../service/earningsService/stripeConnect.service';
import { useTrainerStore } from '../../store/useTrainerStore';

 const OnboardingRefresh=() =>{
    const{profile}=useTrainerStore();
  useEffect(() => {
    if(!profile) return;
    const regenerateAndRedirect = async () => {
      const { url } = await StripeConnectService.regenerateLink(profile.id); 
      window.location.href = url; 
    };
    regenerateAndRedirect();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#16140F] text-[#F5F1E8] flex items-center justify-center">
      <p className="text-sm text-[#9A9284]">Reconnecting you to Stripe…</p>
    </div>
  );
}

export default  OnboardingRefresh;


