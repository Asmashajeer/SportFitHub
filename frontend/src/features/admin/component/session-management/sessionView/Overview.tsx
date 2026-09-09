import { Button } from "@/components/ui/Button"
import type { AdminFitnessSessionDetails, AdminSportSessionDetails } from "@/features/admin/store/types/session.types"
import { Clock, MapPin, User, Users } from "lucide-react"

const Overview=({session}:{session:AdminSportSessionDetails | AdminFitnessSessionDetails})=>{


  return (
    <div className="w-full space-y-3 ">
      <div className="flex flex-wrap items-center gap-1">
        <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
          {session.mode}
        </Button>
        <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
          {session.sessionType}
        </Button>
        <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
          {session.ageGroup}
        </Button>
        <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
          {session.duration} Min
        </Button>
      </div>
      <div className="p-2 text-sm  text-zinc-500 text-left justify-start  w-full ">
        <p>{session.description}</p>
      </div>
      <div className="flex items-center gap-2">
          <div className="bg-zinc-800 p-2 rounded-xl  ">
            <p className="flex items-center  gap-1 text-xs text-zinc-500"><span><Users className="w-3 h-3"/></span> Max Capacity</p>
            <p className="text-xs text-zinc-500">{session.maxCapacity}</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-xl ">
            <p className="flex items-center  gap-1 text-xs text-zinc-500"><span><User className="w-3 h-3"/></span> Enrolled</p>
            <p className="text-xs text-zinc-500">{session.enrolledCount}</p>
          </div>
          <div className="bg-zinc-800 p-2 rounded-xl ">
            <p className="flex items-center  gap-1 text-xs text-zinc-500"><span><Clock className="w-3 h-3"/></span> DeadLine</p>
            <p className="text-xs text-zinc-500">{session.bookingDeadline} hr Before</p>
          </div>
      </div>
      <div  className="flex items-center  gap-2 my-2 bg-zinc-800 p-2 rounded-xl text-zinc-500 ">
        <p  className="flex items-center gap-2 text-xs"><MapPin   className=" text-emerald-600 w-3 h-3"/> Venue</p>
        <p className="text-sm">{session.venue.name} -{session.venue.address}</p>
      </div>
    <div className="p-2 text-sm  text-zinc-400 text-left justify-start">
        <p> Amenitites</p>
        <div className="flex  flex-wrap items-center w-full gap-1">
          {session.amenities.map(a=>(
            <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
            {a}
          </Button>
          ))}
          
        </div> 
      </div>
      <div className="justify-Star text-left text-zinc-400" >
        <p className="text-Start" >Session images</p>    
        <div className=" flex items-center justify-Start gap-5 ">     
           {session.images.map((image,index)=>(
            <div className="  bg-zinc-800 p-2 rounded-xl ">
               <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="h-20 md:h-20 w-auto rounded-lg object-cover shrink-0"
              />            
           </div>
          ))}
        </div>    
      </div>
    </div>

  )
}



export default Overview

