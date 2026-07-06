

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

      <div className="text-start">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Name</h3>
         <div className={`rounded-xl border bg-zinc-800/70 p-4 `}>
          {trainer.paymentInfo.bankAccount && (trainer.paymentInfo.bankAccount.accountName ) ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Gender</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
               {trainer.paymentInfo.bankAccount?.accountName}
              </span>
            </div> 
              <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bank Name</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.paymentInfo.bankAccount?.bankName}
              </span>
            </div>
              <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Account Number</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
               {trainer.paymentInfo.bankAccount?.accountNumber ? `****${trainer.paymentInfo.bankAccount?.accountNumber .slice(-4)}` : undefined}
              </span>
            </div>
               
              <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IFSC Code</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.paymentInfo.bankAccount?.ifscCode}
              </span>
            </div> 
            </div>
          ) : (
            <span className="text-sm text-slate-400">No bank account added.</span>
          )}
       </div>
      </div>

      <div className="text-start">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">UPI</h3>
        <div className={`rounded-xl border bg-zinc-800/70 p-4 `}>
          {trainer.paymentInfo?.upiId ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">UPI ID</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
               {trainer.paymentInfo.upiId}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">No UPI ID added.</span>
          )}
       </div>
      </div>
    </div>

  )
}



export default PaymentInfo;

