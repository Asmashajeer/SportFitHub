import { useEffect, useState } from "react"
import { trainerManagementService } from "../../service/trainerManagementService"
import type { Trainer } from "../../store/trainerSlice";
import {  User2Icon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainerOverview from "./trainerDetailView/TrainerOverview";
import VerificationInfo from "./trainerDetailView/VerificationInfo";
import ScheduleInfo from "./trainerDetailView/ScheduleInfo";
import PaymentInfo from "./trainerDetailView/PaymentInfo";
import AdminSection from "./trainerDetailView/AdminSection";



const TrainerDetailModal=({trainerId,onClose}:{trainerId:string,onClose:()=>void})=> {


  const [trainerData,setTrainerData]=useState<Trainer|null>(null);
  useEffect(()=>{
      const getTrainer=async()=>{
          const data=await trainerManagementService.getTrainer(trainerId);
          setTrainerData(data.trainerData);
          
      }
      getTrainer();
  },[]);
  
   return (   
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Modal card */}
      {trainerData &&
      <div className="relative bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/40 shadow-2xl">
       <div className='flex items-start  justify-between' >
          {/* Header */}
          <div className="flex items-center p-6 border-b border-zinc-800">
            <div>
                <Avatar className="h-16 w-16 border border-border">
                    <AvatarImage   src={`${trainerData?.profilePic}?v=${new Date()}`}   alt="Profile" /> 
                    <AvatarFallback className="bg-muted">
                    <User2Icon size={28} className="text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col px-2">
              <h1 className="text-xl text-left font-semibold text-zinc-100">{trainerData?.displayName}</h1>
            
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400">{trainerData?.coreDiscipline}·</span>
                <span className="text-xs text-zinc-400">{trainerData?.category}·</span>
                <span className="text-xs text-zinc-400">{trainerData?.experience} Yrs exp</span>              
              </div>
            </div>

            
          </div>
          {/* Close button top-right */}
          <button
            onClick={onClose}
            className="text-zinc-500 pt-5 hover:text-zinc-100 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Tabs */}
        <div className="overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full rounded-none bg-zinc-800/40 h-12 border-b border-zinc-800">
              <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-zinc-900">
                Overview
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex-1 data-[state=active]:bg-zinc-900">
                Verification
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1 data-[state=active]:bg-zinc-900">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1 data-[state=active]:bg-zinc-900">
                Payment
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 data-[state=active]:bg-zinc-900">
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <TrainerOverview trainer={trainerData} />
            </TabsContent>
            <TabsContent value="verification" className="p-6">
              <VerificationInfo trainer={trainerData} />
            </TabsContent>
            <TabsContent value="schedule" className="p-6">
              <ScheduleInfo trainer={trainerData} />
            </TabsContent>
            <TabsContent value="payment" className="p-6">
              <PaymentInfo trainer={trainerData} />
            </TabsContent>
            <TabsContent value="admin" className="p-6">
              <AdminSection trainer={trainerData} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors text-sm"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>

      </div>
      }
    </div>
  );
}
export default TrainerDetailModal






 



