import { useEffect } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

 const ConnectingScreen = ({from}: { from: string }) => {
    const navigate=useNavigate();
    useEffect(()=>{
        const timer=setTimeout(()=>{
            toast.custom("   the session Ended");
           navigate(from,{replace:true})
        },5000);
        return()=>clearTimeout(timer);
    },[])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-neutral-950 text-neutral-100">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-100" />
      </div>
      <p className="text-sm text-neutral-400">Joining session…</p>
    </div>
  );
};

export default  ConnectingScreen;