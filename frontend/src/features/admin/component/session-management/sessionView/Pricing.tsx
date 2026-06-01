import { Button } from "@/components/ui/button"
import type { AdminFitnessSessionDetails, AdminSportSessionDetails, FitnessSessionDetailsData, SportsSessionDetailsData } from "@/features/admin/store/types/session.types"

const Pricing=({session}:{session:AdminSportSessionDetails | AdminFitnessSessionDetails}) =>{


  return (
    <div>
       <div className=" justify-start m-2 p-2 w-.5   rounded-xl  ">
        <p className="text-zinc-400 text-sm  flex justify-start">Pricing</p>
       
        {session.pricing.map(price=>(
            <div className=" flex items-center justify-between text-sm text-zinc-500 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
              <p>  {price.sessionCount} {price.sessionCount>1?'sessions':'session'}</p> 
              <p className="font-medium text-zinc-400">₹ {price.price}</p>
            </div>
        ))}
            
      </div>
    </div>
  )
}



export default Pricing