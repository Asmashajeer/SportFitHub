
import type { Trainer } from "@/features/admin/store/trainerSlice"
import { DAYS_OF_WEEK } from "@/constants/constants";
import { formatDateReadable, formatTo12Hour } from "@/utils/formatDate";



const ScheduleInfo=({trainer}:{trainer:Trainer})=> {  
    return (
    <div className="flex flex-col gap-4 b">
      <div className="flex items-center gap-3">
         <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Availability</h3>       
      </div>
      <div className="bg-zinc-800 p-2 rounded-xl">
         <div className=" flex justify-evenly py-2 bg-zinc-800">
            {/* <p className="text-xs font-semibold text-muted-foreground uppercase ">Availabilty Period </p> */}
            <p className="text-emerald-600 px-2">
                From : <span  className="text-white">{formatDateReadable(trainer?.availability.effectiveFrom)}</span>{' '}
            </p>-
            <p className="text-emerald-600 px-2">
              To : <span  className="text-white">{formatDateReadable(trainer?.availability.effectiveTo)}</span>{' '}
            </p>

          </div>  
        <div className="grid grid-cols-2 gap-2.5">
            {trainer?.availability?.weeklySchedule &&
              trainer.availability.weeklySchedule
                .filter((value) =>typeof value === 'object' && value.isAvailable)
                .map((value) => (
                  <div
                    key={value.day}
                    className=" gap-x-1 gap-y-2 bg-green-900"
                  >
                    <span className="text-xs md:text-sm font-medium capitalize">{value.day}</span>
                    <div className=" md:flex justify-evenly  p-1 text-xs ">
                      {value.slots.length>0 && value.slots.map((s)=>(
                        <p className="text-xs text-zinc-300 p-1 border  ">
                          {formatTo12Hour(s.startTime)} - {formatTo12Hour(s.endTime)} 
                        </p>  
                                                    
                      ))}
                    </div>
                  </div>
                ))}
            {/* return (
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
          })} */}
        </div>
      </div>
    </div>
  );

}



export default ScheduleInfo

