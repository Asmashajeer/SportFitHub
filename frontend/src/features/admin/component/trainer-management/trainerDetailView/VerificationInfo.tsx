
import type { Trainer } from "@/features/admin/store/trainerSlice";
import { formatDateReadable } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { documentsService } from "@/features/trainer/service/documentsService";
import toast from "react-hot-toast";



const VerificationInfo=({trainer}:{trainer:Trainer})=> {

 const getCertificate=async(certId:string)=>{
       const newTab = window.open('', '_blank'); 
    try{      
      if(trainer){  
         
        const blob=await documentsService.getCertificateDoc(certId,trainer?.id);
       const objectUrl = URL.createObjectURL(blob);
       if (newTab) {
          newTab.location.href = objectUrl;
        } else {
          toast.error('Please allow popups to view this document');
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
          }

    }catch(error){
      newTab?.close();
      const message= error instanceof Error? error.message:"cannot open document,try again";
      toast.error(message);
      console.log(error);            
    }
  }

  const getIdAttachment=async()=>{
       const newTab = window.open('', '_blank'); 
    try{      
      if(trainer){  
         
        const blob=await documentsService.getIdAttchmentDoc(trainer?.id);
       const objectUrl = URL.createObjectURL(blob);
       if (newTab) {
          newTab.location.href = objectUrl;
        } else {
          toast.error('Please allow popups to view this document');
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
          }

    }catch(error){
      newTab?.close();
      const message= error instanceof Error? error.message:"cannot open document,try again";
      toast.error(message);
      console.log(error);            
    }
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Certifications */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Certifications</h3>
          <Badge>{trainer.certificationInfo.status}</Badge> 
        </div>

        {trainer.certificationInfo.documents?.length ? (
          <div className="flex flex-col gap-3">
            {trainer.certificationInfo.documents.map((doc, i) => (
              <div className={`text-start rounded-xl border bg-zinc-800/70 p-4 key=${i}`}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Document Name</span>
                    <span className="text-sm font-medium text-slate-400 wrap-break-word">
                      {doc.name}
                    </span>
                  </div> 
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Issued At</span>
                    <span className="text-sm font-medium text-slate-400 wrap-break-word">
                    {formatDateReadable(doc.issuedAt.toString())}
                    </span>
                  </div> 
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Valid Until</span>
                    <span className="text-sm font-medium text-slate-400 wrap-break-word">
                      {formatDateReadable(doc.validUpto.toString())}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">File</span>
                    <span className="text-sm font-medium text-slate-400 wrap-break-word">
                      {
                            doc.url ? (
                              <a 
                                 onClick={()=>getCertificate(doc.id)}   
                                target="_blank" rel="noreferrer"
                                className="flex items-center  gap-2 text-sm font-semibold text-green-600 hover:underline">
                                View Document <ExternalLink size={14} />
                              </a>
                            ) : undefined
                          }
                    </span>
                  </div>                   
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className={`rounded-xl border bg-zinc-800/70 p-4 `}>
            <span className="text-sm text-slate-400">No certification documents uploaded.</span>
          </div>
        )}

      {trainer.certificationInfo.verifiedAt && (
        <p className="mt-2 text-xs text-slate-400">
          Verified on {formatDateReadable(trainer.certificationInfo.verifiedAt)}
        </p>
      )}
      {trainer.certificationInfo.rejectReason && (
        <div className={`mt-3 rounded-lg border p-3 text-xs border-red-200 bg-red-50 text-red-800`}>
          <strong>Rejection reason:</strong> {trainer.certificationInfo.rejectReason}
        </div>
      )}
    </div>

    {/* ID Verification */}
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Identity Verification</h3>
        <Badge >{trainer.idVerification.status} </Badge>
      </div>
        <div className={`text-start rounded-xl border bg-zinc-800/70 p-4 `}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ID Type</span>
            <span className="text-sm font-medium text-slate-400 wrap-break-word">
             {trainer.idVerification.idType}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ID Number</span>
            <span className="text-sm font-medium text-slate-400 wrap-break-word">
             {
              trainer.idVerification.idNumber
                ? `****${trainer.idVerification.idNumber.slice(-4)}`
                : undefined
            }
            </span>
          </div>
           
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Verified At</span>
            <span className="text-sm font-medium text-slate-400 wrap-break-word">
             {formatDateReadable(trainer.idVerification.verifiedAt)}
            </span>
          </div> 
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Attachment</span>
            <span className="text-sm font-medium text-slate-400 wrap-break-word">
             {
              trainer.idVerification.idAttachment ? (
                <a onClick={getIdAttachment} target="_blank" rel="noreferrer"
                  className="flex items-center  gap-2 text-sm font-semibold text-green-600 hover:underline">
                  View ID <ExternalLink size={14} />
                </a>
              ) : undefined
            }
            </span>
          </div>           
        </div>
      </div>
      {trainer.idVerification.rejectReason && (
        <div className={`mt-3 rounded-lg border p-3 text-xs border-red-200 bg-red-50 text-red-800`}>
          <strong>Rejection reason:</strong> {trainer.idVerification.rejectReason}
        </div>
      )}
    </div>
    </div>
  );

}



export default VerificationInfo

