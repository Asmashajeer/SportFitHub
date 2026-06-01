
import { Badge } from "@/components/ui/badge";
import type { AdminFitnessSessionDetails, AdminSportSessionDetails, } from "../../../store/types/session.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, X, XCircle } from "lucide-react";

import Overview from "./Overview";
import Schedule from "./Schedule";
import Pricing from "./Pricing";
import Trainer from "./Trainer";
import { formatDateDDMMYY, formatDateReadable } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";


interface SessionDetailModalProps {
  session: AdminSportSessionDetails | AdminFitnessSessionDetails;
  sessionModel: 'sports' | 'fitness';
  open: boolean;
  onClose: () => void;
  onAction: (id: string, action: 'approve' | 'reject') => Promise<void>;
}
const SessionDetailModal=({session,sessionModel,open,onClose,onAction}:SessionDetailModalProps )=>{
  if(!open)return null;
 return (
  <div className=" fixed inset-0 mt-6 z-50 flex items-center justify-center shadow-xl ">
      
      <div className=" relative bg-zinc-900  w-full max-w-2xl max-h-[90vh] overflow-y-auto  border shadow-2xl p-6">
      
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>        
            <h1 className="text-2xl font-semibold text-zinc-100">{session?.sessionName}</h1>
            <p className="text-sm font-bold px-3 text-zinc-500 mt-1">
              {sessionModel.toLocaleUpperCase()} - <span>SubmittedOn: {formatDateDDMMYY(session?.createdAt)} </span>
              <Badge>{session?.isApproved?(session.isActive?"Active":"inactive"):"pending"} </Badge>
            </p>
            
          </div>           
          <Button
              variant={"outline"}
              onClick={onClose}
              className="text-zinc-400 text-end hover:text-zinc-100 transition-colors p-1"
            >
              <X className="w-5 h-5" />
          </Button>        
        </div>

        {/* Tabs */}
        <div className="rounded-xl   border-zinc-850 overflow-hidden ">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full rounded-none bg-zinc-850/40 h-12">
              <TabsTrigger    value="overview"    className="bg-zinc-850 data-[state=active]:bg-zinc-900 "  >
                Overview
              </TabsTrigger>
              <TabsTrigger    value="schedule"    className=" bg-zinc-850  data-[state=active]:bg-zinc-900  "  >
                Schedule
              </TabsTrigger>
              <TabsTrigger    value="pricing"    className=" bg-zinc-850  data-[state=active]:bg-zinc-900  "  >
                Pricing
              </TabsTrigger>
              <TabsTrigger     value="trainer"     className=" bg-zinc-850  data-[state=active]:bg-zinc-900  "   >
                Trainer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4">
              <Overview session={session}/>
            </TabsContent>

            <TabsContent value="schedule" className="p-4">
              <Schedule session={session}/>
            </TabsContent>
            <TabsContent value="pricing" className="p-4">
            <Pricing session={session}/>
            </TabsContent>

            <TabsContent value="trainer" className="p-4">
              <Trainer session={session}/>
            </TabsContent>
          </Tabs>
          <div className="flex items-center gap-2 p-1 justify-end">
              <button onClick={ onClose }
                  title="Cancel"
                  className=" flex p-1.5  items-center  gap-2 rounded-lg border border-zinc-500/30 text-zinc-400 hover:bg-emerald-500/10 transition-colors"
                  >
                  <X className="w-3.5 h-3.5 " />Close
              </button> 
              {!session.isApproved  &&(
                <div className="flex items-center gap-2 p-1 justify-end">
                  <button onClick={() => {onAction( session?.id, 'approve'); onClose }}
                      title="Approve"
                      className=" flex p-1.5  items-center  gap-2  rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                  </button>                                    
                  <button
                      onClick={() => { onAction(session?.id,'reject' ) }}
                      title="Reject"
                      className=" flex p-1.5  items-center  gap-2  rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                  </button>  
                </div>
              )}
          </div>
        </div>
      </div>
    
  </div>
  
  );
}
export default SessionDetailModal;