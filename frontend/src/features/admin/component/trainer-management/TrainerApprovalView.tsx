import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { trainerManagementService } from '../../service/trainerManagementService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ExternalLink,
  CreditCard,
  Building2,
  ShieldCheck,
  Award,
  User2Icon,
} from 'lucide-react';
import { UseAdminStore } from '../../store/useAdminStore';
import { useEffect, useState } from 'react';
import type { ICertification, TrainerOverView } from '../../store/trainerSlice';
import {
  DOC_VERIFY_STATUS,
  TRAINER_STATUS,
  type Doc_status_type,
} from '@/constants/constants';
import toast from 'react-hot-toast';
import { parseISO } from 'date-fns';
import { formatTo12Hour } from '@/utils/formatDate';
import { documentsService } from '@/features/trainer/service/documentsService';


export const TrainerApprovalView = ({
  trainer,
  onClose,
}: {
  trainer: TrainerOverView;
  onClose: () => void;
}) => {
  const selectedTrainer = UseAdminStore((state) => state.selectedTrainer);
  const setSelectedTrainer = UseAdminStore((state) => state.setSelectedTrainer);
  const [rejectionTarget, setRejectionTarget] = useState<string | null>(null); // e.g., 'certificationInfo'
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { trainerData } = await trainerManagementService.getTrainer(
        trainer.id
      );

      setSelectedTrainer(trainerData);
    };

    fetchCurrentUser();
  }, [trainer]);


    const getCertificate=async(certId:string)=>{
      const newTab = window.open('', '_blank'); 
      try{      
        if(selectedTrainer){            
          const blob=await documentsService.getCertificateDoc(certId,selectedTrainer?.id);
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
        if(selectedTrainer){  
          
          const blob=await documentsService.getIdAttchmentDoc(selectedTrainer.id);
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
  //update cerificates/id status
  const updateStatus = async (
    id: string,
    targetField: 'certificationInfo' | 'idVerification',
    status: Doc_status_type,
    reason?: string
  ) => {
    try {
      const data = await trainerManagementService.updateFileStatus(
        id,
        targetField,
        status,
        reason
      );

      if (data.success) {
        toast.success(`certificationInfo updated to ${status}`);
        setSelectedTrainer(data.trainerData);
      }
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };

  //update Trainer application Status

  const trainerApplicationStatus = async (
    id: string,
    status: Doc_status_type,
    reason?: string
  ) => {
    try {
      const data = await trainerManagementService.updateTrainerStatus(
        id,
        status,
        reason
      );

      if (data.success) {
        toast.success(`Trainer ${status}`);
        setSelectedTrainer(data.trainerData);
        onClose();
      }
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };

  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="flex items-center p-6 border-b border-zinc-800">
            <div>
                <Avatar className="h-16 w-16 border border-border">
                    <AvatarImage   src={`${selectedTrainer?.profilePic}?v=${new Date()}`}   alt="Profile" /> 
                    <AvatarFallback className="bg-muted">
                    <User2Icon size={28} className="text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col px-2">
              <h1 className="text-xl text-left font-semibold text-zinc-100">{selectedTrainer?.displayName}</h1>
              <p  className="text-xs text-left "> {selectedTrainer?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400">{selectedTrainer?.coreDiscipline}·</span>
                <span className="text-xs text-zinc-400">{selectedTrainer?.category}·</span>
                <span className="text-xs text-zinc-400">{selectedTrainer?.experience} Yrs exp</span>              
              </div>
              <Badge variant={"destructive"}> {selectedTrainer?.status!==TRAINER_STATUS.APPROVED?' waiting for Approval':""}</Badge>
            </div>

            
          </div>


      <div className="lg:col-span-2 space-y-4">
        <Accordion
          type="single"        
           collapsible 
          className="w-full"
        >
          {/* Basic info */}
          <AccordionItem value="Branding" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] hover:no-underline py-4
             data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">Basic Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4 bg-zinc-800/70 p-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    DisplayName
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.displayName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Core Discipline{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.category} -  {selectedTrainer?.coreDiscipline}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Expertise{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.specialties.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    Experience :{' '}
                  </p>{' '}
                  <span className="text-sm font-medium">
                    {selectedTrainer?.experience}
                  </span>                  
                </div>
                <div>
                  <hr />
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    Language{' '}
                  </p>
                  <p>{selectedTrainer?.languages.join(", ")}</p>           
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Bio
                  </p>
                  <p className="text-sm">{selectedTrainer?.bio} </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Personal & Address */}
          <AccordionItem value="personal" className="border rounded-lg px-4">
            <AccordionTrigger className="text-[13px] hover:no-underline py-4
             data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">
                  Personal & Contact Information
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4  bg-zinc-800/70 p-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Full Name
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.personalInfo.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    DOB
                  </p>
                  <p className="text-sm font-medium">
                    {parseISO(
                      selectedTrainer?.personalInfo.DOB ?? ''
                    ).toLocaleDateString()}
                    {}
                  </p>
                </div>
                <div>
                  <p className="text-xs  font-semibold text-muted-foreground uppercase">
                    Gender{' '}
                  </p>
                  <p>{selectedTrainer?.personalInfo.gender}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Phone{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {selectedTrainer?.personalInfo.phone}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Address
                  </p>
                  <p className="text-sm">
                    {selectedTrainer?.personalInfo.address.street},{' '}
                    {selectedTrainer?.personalInfo.address.city},{' '}
                    {selectedTrainer?.personalInfo.address.state} -{' '}
                    {selectedTrainer?.personalInfo.address.zip}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/*Certificates &Licence  */}
          <AccordionItem
            value="Certificates"
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Award className="text-green-600 h-5 w-5" />
                <span className="font-bold">Professional Certificates </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4  bg-zinc-800/70 p-4">
             {selectedTrainer?.certificationInfo.documents.length && (
                <div className="flex items-center text-start  justify-between">
                  <p>
                    Certificates verificaton status:{' '}
                    {selectedTrainer?.certificationInfo?.status.toUpperCase()}
                  </p>
                  {selectedTrainer?.certificationInfo?.status ===
                    DOC_VERIFY_STATUS.PENDING &&
                    rejectionTarget !== 'certificationInfo' && (
                      <div className="flex items-center gap-2 ">
                        <Button
                          onClick={() =>
                            updateStatus(
                              selectedTrainer?.id,
                              'certificationInfo',
                              DOC_VERIFY_STATUS.VERIFIED
                            )
                          }
                        >
                          Verify
                        </Button>
                        <Button
                          variant={'destructive'}
                          onClick={() =>
                            setRejectionTarget('certificationInfo')
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  {/* REJECTION INPUT FIELD: Appears when Reject is clicked */}

                  {rejectionTarget === 'certificationInfo' && (
                    <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-destructive uppercase">
                          Rejection Reason
                        </label>
                        <textarea
                          className="w-full p-2 text-sm bg-background border rounded-md focus:ring-1 focus:ring-destructive outline-none min-h-20"
                          placeholder="Tell the trainer why their certificates were rejected..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRejectionTarget(null);
                            setRejectionReason('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={!rejectionReason.trim()}
                          onClick={() => {
                            updateStatus(
                              selectedTrainer?.id,
                              'certificationInfo',
                              DOC_VERIFY_STATUS.REJECTED,
                              rejectionReason
                            );
                            setRejectionTarget(null);
                            setRejectionReason('');
                          }}
                        >
                          Confirm & Send Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-5 gap-y-4">
                {selectedTrainer?.certificationInfo.documents.map(
                  (cert: ICertification, i: number) => (
                    <div
                      key={i}
                      className="text-sm p-3 border rounded-md hover:bg-muted/30"
                    >
                      <p className="font-normal text-primary">
                        Name:   {cert.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Expires: {new Date(cert.validUpto).toLocaleDateString()}
                      </p>

                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs"
                        asChild
                      >
                        <a
                          onClick={()=>getCertificate(cert.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      </Button>
                    </div>
                  )
                )}
              </div>
             
            </AccordionContent>
          </AccordionItem>
          {/* Govt ID Verification */}
          <AccordionItem value="id" className="border rounded-lg  px-4">
            <AccordionTrigger className="text-[13px] hover:no-underline
             data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="text-orange-600 h-5 w-5" />
                <span className="font-bold">Government ID Verification</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4 bg-zinc-800/70 p-4">
              <div className="flex items-center text-start  justify-between"> 
               <div className="flex items-center   justify-evenly gap-4 px-2">
                <div className="px-2">
                  <p>verification Status{' '}    </p>
                  <Badge variant={
                        selectedTrainer?.idVerification.verified
                          ? 'default'
                          : 'destructive'
                      }
                    >                  
                      {selectedTrainer?.idVerification.status}
                    </Badge> 
                </div>             
                <div className="px-2">
                    <p className="text-sm">                    Type:{' '} </p>
                      <strong>{selectedTrainer?.idVerification.idType}</strong>                 
                </div> 
                <div className="px-2"> 
                  <p className="text-sm">                    Number:{' '} </p>  
                    <strong>{selectedTrainer?.idVerification.idNumber}</strong>                               
                </div>               
                <Button variant="outline" size="sm" asChild>
                  <a
                   onClick={getIdAttachment}
                    target="_blank"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Preview ID
                  </a>
                </Button>
                </div>
                 {selectedTrainer?.idVerification.status ===
                  DOC_VERIFY_STATUS.PENDING &&
                  rejectionTarget !== 'idVerification' && (
                    <div className="flex items-center gap-2 ">
                      <Button
                        onClick={() =>
                          updateStatus(
                            selectedTrainer?.id,
                            'idVerification',
                            DOC_VERIFY_STATUS.VERIFIED
                          )
                        }
                      >
                        Verify
                      </Button>
                      <Button
                        variant={'destructive'}
                        onClick={() => setRejectionTarget('idVerification')}
                      >
                        Reject
                      </Button>
                    </div>
                )}              
                {rejectionTarget === 'idVerification' && (
                  <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-destructive uppercase">
                        Rejection Reason
                      </label>
                      <textarea
                        className="w-full p-2 text-sm bg-background border rounded-md focus:ring-1 focus:ring-destructive outline-none min-h-20"
                        placeholder="Tell the trainer why their certificates were rejected..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRejectionTarget(null);
                          setRejectionReason('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!rejectionReason.trim()}
                        onClick={() => {
                          if (!selectedTrainer?.id) return;
                          updateStatus(
                            selectedTrainer?.id,
                            'idVerification',
                            DOC_VERIFY_STATUS.REJECTED,
                            rejectionReason
                          );
                          setRejectionTarget(null);
                          setRejectionReason('');
                        }}
                      >
                        Confirm & Send Rejection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Availability & Schedule */}
          <AccordionItem value="personal" className="border rounded-lg px-4">
            <AccordionTrigger className=" text-[13px] hover:no-underline py-4
             data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600 h-5 w-5" />
                <span className="font-bold">Availability & Schedule</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4  bg-zinc-800/70 p-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    SessionCharge
                  </p>
                  <p className="text-sm font-medium">
                    ₹ {selectedTrainer?.pricing.sessionCharge}{' '}
                    
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Availabilty:{' '}
                    <span className="text-sm font-medium">
                      {selectedTrainer?.availability.isAvailable
                        ? 'Active'
                        : 'Not Available'}{' '}
                    </span>
                  </p>
                  <div className="space-y-2">
                    {selectedTrainer?.availability &&
                      Object.entries(selectedTrainer.availability)
                        .filter(
                          ([key, value]) =>
                            key !== 'isAvailable' &&
                            typeof value === 'object' &&
                            value.available
                        )
                        .map(([day, info]: [string, any]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center text-sm border-b pb-1 border-muted/50"
                          >
                            <span className="font-medium capitalize">
                              {day}
                            </span>
                            <span className="text-muted-foreground">
                              {formatTo12Hour(info.startTime)} - {formatTo12Hour(info.endTime)}
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Payment & Bank Info */}
          <AccordionItem
            value="payment"
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-[13px] hover:no-underline
             data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
              <div className="flex items-center gap-3">
                <Building2 className="text-green-600 h-5 w-5" />
                <span className="font-bold">Banking & Payment Data</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 border-t pt-4  bg-zinc-800/70 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    Bank Account
                  </p>
                  <div className="p-2 bg-zinc-950 rounded">
                    
                    <p className="text-[13px] text-slate-400">
                      Account Name: <span className='text-slate-200 px-2'>{selectedTrainer?.paymentInfo.bankAccount?.accountName}</span>
                    </p>
                    <p className="flex text-[13px] text-slate-400 ">
                      A/C:
                      <span className='px-2 text-slate-200'>{selectedTrainer?.paymentInfo.bankAccount?.accountNumber}</span>
                    </p>
                    <p className="text-[13px] text-slate-400">
                      IFSC: <span className='text-slate-200 px-2'>{selectedTrainer?.paymentInfo.bankAccount?.ifscCode}</span>
                    </p>
                  </div>
                </div>  
                <div className="p-3 bg-secondary/20 rounded">
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    UPI ID
                  </p>
                  <p className="text-sm font-mono mt-2">
                    {selectedTrainer?.paymentInfo.upiId || 'Not Provided'}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-4">
        {/* ADMIN ACTION BOX */}
        <div className="border rounded-lg bg-secondary/10 p-4 sticky top-4">
          <h4 className="font-bold text-sm mb-4">Verification Actions</h4>
          {selectedTrainer && (
            <div className="space-y-2 flex  justify-end gap-2">
              <Button
                className="text-[13px] bg-green-600 hover:bg-green-700 "
                onClick={() =>
                  trainerApplicationStatus(
                    selectedTrainer?.id,
                    TRAINER_STATUS.APPROVED
                  )
                }
              >
                Approve Application
              </Button>
              <div>
                <Button
                  variant="outline"
                  className="text-[13px]  border-destructive text-destructive hover:bg-destructive/5"
                  onClick={() => setRejectionTarget('trainerStatus')}
                 
                >
                  Reject Application
                </Button>
                {rejectionTarget === 'trainerStatus' && (
                  <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-destructive uppercase">
                        Rejection Reason
                      </label>
                      <textarea
                        className="w-full p-2 text-sm bg-background border rounded-md focus:ring-1 focus:ring-destructive outline-none min-h-20"
                        placeholder="Tell the trainer why their certificates were rejected..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRejectionTarget(null);
                          setRejectionReason('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!rejectionReason.trim()}
                        onClick={() => {
                          if (!selectedTrainer?.id) return;
                          trainerApplicationStatus(
                            selectedTrainer?.id,
                            TRAINER_STATUS.REJECTED,
                            rejectionReason
                          );
                          setRejectionTarget(null);
                          setRejectionReason('');
                        }}
                      >
                        Confirm & Send Rejection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className=" text-[13px] border-amber-200 text-amber-200 hover:bg-amber-600/5"
                onClick={() =>
                  trainerApplicationStatus(
                    selectedTrainer?.id,
                    TRAINER_STATUS.UNDER_REVIEW
                  )
                }
              >
                Under Review
              </Button>
            </div>
          )}
          <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
            Approval will notify the selectedTrainer? and activate their public
            profile.
          </p>
        </div>
      </div>
    </div>
  );
};
