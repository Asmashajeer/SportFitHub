
import type { Trainer } from "@/features/admin/store/trainerSlice";
import { formatDateReadable} from "@/utils/formatDate";

import {  useState } from "react";
import GetMapsLink from "@/components/reusable/GetMapsLink";



const TrainerOverview=({trainer}:{trainer:Trainer})=> {
  
  const [venueLocation, setVenueLocation]=useState("");
  const lat=trainer.currentLocation.coordinates[0];
  const lng=trainer.currentLocation.coordinates[1];

  function calcAge(dob?: string | Date): string {
    if (!dob) return "—";
    const age = Math.floor(
      (Date.now() - new Date(dob as string).getTime()) / (365.25 * 24 * 3600 * 1000)
    );
    return isNaN(age) ? "—" : `${age} yrs`;
  }

  const showAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();  
    setVenueLocation(`${data.display_name}`); // selected location  display only
  }
   showAddress(lat,lng);

 return (
    <div className="flex flex-col gap-6">
      {trainer.bio && (
        <div className="text-start">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             Bio
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">{trainer.bio}</p>
        </div>
      )}

      {/* <div>        
         <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Expertise</h3>
         <p>{trainer.coreDiscipline}</p>
      </div> */}
      <div className="grid grid-cols-2 gap-4">
         <div className="text-start ">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Specialties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trainer.specialties?.length ? (
                trainer.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-green-500">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-300">None listed</span>
              )}
            </div>
        </div>
          <div className="text-start">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Languages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trainer.languages?.length ? (
                trainer.languages.map((l) => (
                  <span key={l} className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-green-500">
                    {l}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-300">None listed</span>
              )}
            </div>
          </div>
        
      </div>

       <div className="text-start">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Personal Information</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 bg-zinc-800/70">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Full Name</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.personalInfo.fullName?? <span className="text-slate-300">—</span>}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date of Birth</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {`${formatDateReadable(trainer.personalInfo.DOB)} (${calcAge(trainer.personalInfo.DOB)})`}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Gender</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.personalInfo.gender}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Phone</span>
              <span className="text-sm font-medium text-slate-400 wrap-break-word">
                {trainer.personalInfo.phone}
              </span>
            </div>
            
            
            <div className="col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Address</span>
              <div className="flex flex-col gap-0.5">
                
                <span className="text-sm font-medium text-slate-400 wrap-break-word">
                  {trainer.personalInfo.address.street}. {trainer.personalInfo.address.city}.{trainer.personalInfo.address.state}.{trainer.personalInfo.address.zip}.
                </span>
              </div>
            
            </div>
          </div>
      </div>

      {trainer.currentLocation?.coordinates?.length === 2 && (
        <div className="text-start">
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Location</h3>
           <div className='  bg-zinc-800/70 rounded-xl  p-4 '>
            <span className="text-[12px] font-semibold  tracking-wider text-slate-400">{venueLocation}</span>
            <GetMapsLink coords={[lat,lng]}/>
          </div>
        </div>
      )}
    </div>
  );




//   return (
//    <div className="w-full space-y-3 ">
//         <div className="m-2 p-2">
//           <div className=" bg-zinc-800 p-2 justify-start rounded-xl  ">
//             <p className="flex items-center  gap-1 text-sm text-zinc-400"><span><User className="w-3 h-3"/></span>{booking.userName}</p>
//             <p className="text-xs text-start  text-zinc-400">{booking.userEmail}</p>
//           </div>
//         </div>

//         <div className="m-2 p-2">
//           <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-xl ">
//             <p className="flex items-center  gap-1 text-sm text-zinc-400"><span><Calendar className="w-3 h-3"/></span> {booking.sessionName}</p>
//             <p className="text-xs text-zinc-400">{booking.sessionModel} </p>
//              <p className="flex items-center  gap-1 text-xs text-zinc400"><span><User className="w-3 h-3"/></span>{booking.sessionType}</p>
//           </div>
//           {/* <div className="bg-zinc-800 p-2 rounded-xl ">
//             <p className="flex items-center  gap-1 text-xs text-zinc-500"><span><UserCog className="w-3 h-3"/></span> {booking.trainerId}</p>        
//          </div> */}          
//         </div>

//       <div className="m-2 p-2">
//           <p className="flex items-center  gap-1 text-xs text-zinc-400"> Price Plan</p> 
//           <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-xl ">
            
//             <p className="text-sm text-zinc-400">{booking.pricePlan.totalSessions} sessions</p> 
//             <p className="text-sm text-zinc-400">Total: ₹ {booking.pricePlan.pricePaid.toFixed(2)} </p>
//             <p className="text-sm text-zinc-400">₹ {booking.pricePlan.unitPrice.toFixed(2)}  / session</p>
//           </div>
//       </div>
//       <div className="m-2 p-2">
//         <p className="flex items-center  gap-1 text-xs text-zinc-400">Venue</p>
//           <div className="bg-zinc-800 p-2 rounded-xl ">            
//             <p className=" flex items-center gap-1 text-sm text-zinc-400 "><span><MapPin className="w-3 h-3 text-emerald-600"/></span>  {booking.venue.name}  , {booking.venue.address} </p>
//           </div>
//       </div>
    
//     </div>
//   )
}



export default TrainerOverview

