

import { CURRENCY } from "@/constants/constants";
import type { Trainer } from "@/features/trainer/store/useTrainerStore";



const PaymentInfo=({trainer}:{trainer:Trainer})=> {

  return (
   <div className="flex flex-col gap-6">
      <div className="text-start">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Session Pricing</h3>
        <div className={`rounded-xl bg-zinc-800/70 p-4 `}>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-400">
              {CURRENCY}{trainer.pricing.sessionCharge.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-slate-400">/ session</span>
          </div>
        </div>
      </div>

  
    </div>

  )
}



export default PaymentInfo;

