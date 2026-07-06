
import type { Trainer } from "@/features/admin/store/trainerSlice"
import { DAYS_OF_WEEK } from "@/constants/constants";



const ScheduleInfo=({trainer}:{trainer:Trainer})=> {  
    return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
         <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Availability</h3>
        <span
          className={`-mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            trainer.availability.isAvailable
              ? "bg-green-400/50 text-green-950"
              : "bg-red-200 text-red-700"
          }`}
        >
          {trainer.availability.isAvailable ? "Accepting Sessions" : "Not Available"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {DAYS_OF_WEEK.map((day) => {
          const d = trainer.availability[day];
          return (
            <div
              key={day}
              className={`rounded-xl  p-3 transition-opacity ${
                d.available
                  ? "border-slate-200 bg-green-400/40"
                  : "border-slate-100 bg-zinc-400 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-300">{day}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    d.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-300 text-slate-400"
                  }`}
                >
                  {d.available ? "Open" : "Off"}
                </span>
              </div>
              {d.available && (d.startTime || d.endTime) && (
                <p className="mt-1 text-xs text-slate-500">
                  {d.startTime ?? "?"} – {d.endTime ?? "?"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

}



export default ScheduleInfo

