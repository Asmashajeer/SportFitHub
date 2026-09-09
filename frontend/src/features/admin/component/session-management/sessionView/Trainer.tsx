import { Button } from "@/components/ui/Button"
import type { AdminFitnessSessionDetails, AdminSportSessionDetails} from "@/features/admin/store/types/session.types"
import { formatDateDDMMYY } from "@/utils/formatDate"
import { Check } from "lucide-react"

const Trainer=({session}:{session:AdminSportSessionDetails | AdminFitnessSessionDetails}) =>{


  return (
    <div>
      <div className=" justify-start m-2 p-2 w-.5   rounded-xl  ">
        <p className="text-zinc-400 text-sm  flex justify-start">Submitted By</p>
            <div className=" justify-start text-start  text-zinc-300 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
              <p className="font-bold">  {session.trainer.displayName} </p> 
              <p className="font-sm text-zinc-400">{session.trainer.coreDiscipline} - {session.trainer.experience} yrs experience</p>
            </div>  
      </div>
      <div className=" justify-start m-2 p-2 w-.5   rounded-xl  ">
        <p className="text-zinc-400 text-sm  flex justify-start">Specialities</p>
            <div className=" justify-start text-start  text-zinc-300 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
              {session.trainer.specialties.map(sp=>(
                <Button  variant={'outline'} className= "text-xs px-3 py-1 rounded-full border transition-all font-medium bg-transparent text-zinc-400 border-zinc-700" >
                  {sp}
                </Button>
              ))}
              
              
            </div>  
      </div>
      <div className="  m-2 p-2    rounded-xl">  
        <div className=" flex items-center  gap-2  justify-between ">
          <div className=" justify-start m-2 p-2 w-full  bg-zinc-800/30 rounded-xl  ">
            <p className="text-zinc-400 text-sm  flex justify-start">ID Verified</p>
              <div className="flex  justify-start text-start  text-zinc-300 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
                <p className={`font-bold ${session.trainer.isIdVerified?'text-emerald-600':'text-red-600'}`}> <Check/>  </p> 
                <p className="font-sm text-zinc-400">{session.trainer.isIdVerified?"yes":"No"}</p>
            </div>  
          </div>
          <div className=" justify-start m-2 p-2 w-full   bg-zinc-800/30 rounded-xl  ">
              <p className="text-zinc-400 text-sm  flex justify-start">Certs Verified</p>
                  <div className=" flex justify-start text-start  text-zinc-300 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
                    <p className={`font-bold ${session.trainer.isCertificateVerified?'text-emerald-600':'text-red-600'}`}> <Check/>  </p> 
                    <p className="font-sm text-zinc-400">{session.trainer.isCertificateVerified?"yes":"No"}</p>
                  </div>  
          </div>
        </div>    
        
        <div className=" justify-start m-2 p-2 w-.5   rounded-xl  ">
          <p className="text-zinc-400 text-sm  flex justify-start">Joined At</p>
              <div className=" justify-start text-start  text-zinc-300 gap-2 bg-zinc-800/30 p-2 rounded-md m-2">
                <p className="text-sm">  {formatDateDDMMYY(session.trainer.joinedAt)} </p> 
              </div>  
        </div>
      </div>
    </div>
  )
}



export default Trainer