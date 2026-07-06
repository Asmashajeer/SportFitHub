import { Badge } from "@/components/ui/badge";
import { CURRENCY } from "@/constants/constants";
import type { Trainer } from "@/features/admin/store/trainerSlice";
import { formatDateReadable } from "@/utils/formatDate";



const AdminSection=({trainer}:{trainer:Trainer})=> {

   const metrics = [
    {
      label: "Strike Points",
      value: trainer.strikePoints,
      cls: trainer.strikePoints > 0 ? "text-red-600" : "text-emerald-600",
    },
    {
      label: "Cancellations",
      value: trainer.cancellationCount,
      cls: trainer.cancellationCount > 3 ? "text-orange-500" : "text-slate-700",
    },
    {
      label: `Penalty (${CURRENCY})`,
      value: `${CURRENCY} ${trainer.penalty}`,
      cls: trainer.penalty > 0 ? "text-red-600" : "text-slate-700",
    },
    {
      label: "Applications submitted",
      value: trainer.applicationCount,
      cls: "text-slate-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-start">
         <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Metrics</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map((m) => (
             <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 bg-zinc-800/70">
              <div className={`text-2xl font-extrabold ${m.cls}`}>{m.value}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

       <div className="text-start">
         <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Details</h3>
   
          <div className="grid grid-cols-2  gap-x-6 gap-y-6 bg-zinc-800/70 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Current Status</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
               {<Badge>{trainer.status}</Badge> }
              </span>
            </div> 
        
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Last Strike Date</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.lastStrikeDate?formatDateReadable(trainer.lastStrikeDate):"-"}
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Member Since</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
               {formatDateReadable(trainer.createdAt)} 
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Last Updated</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
              {formatDateReadable(trainer.updatedAt)} 
              </span>
            </div>
          </div>

          {trainer.suspensionReason && (
           <div className={`mt-3 rounded-lg border p-3 text-xs border-red-200 bg-red-50 text-red-800`}>
              <strong>Suspended {formatDateReadable(trainer.suspendedAt)}:</strong> {trainer.suspensionReason}
            </div>
          )}
          {trainer.rejectionReason && (
           <div className={`mt-3 rounded-lg border p-3 text-xs border-red-200 bg-red-50 text-red-800`}>
              <strong>Rejected {formatDateReadable(trainer.rejectedAt)}:</strong> {trainer.rejectionReason}
            </div>
          )}
    
      </div>
    </div>
  );

}



export default AdminSection;

