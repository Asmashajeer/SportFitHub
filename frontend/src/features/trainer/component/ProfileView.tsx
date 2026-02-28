import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  ExternalLink,
  CreditCard,
  Building2,
  ShieldCheck,
  Award,
  Edit2,
  VerifiedIcon,
} from "lucide-react";

import { useEffect, useState } from "react";

import { DOC_VERIFY_STATUS, TRAINER_STATUS } from "@/constants/constants";

import { parseISO } from "date-fns";

import { useTrainerStore, type ICertification } from "../store/useTrainerStore";
import CertificatesForm from "./profileEditForm/CertificatesForm";

import { trainerService } from "../service/trainerService";
import toast from "react-hot-toast";
import IdVerificationFormEdit from "./profileEditForm/IdVerificationFormEdit";
import AvailabilityFormEdit from "./profileEditForm/AvailabiltyFormEdit";
import PaymentInfoFormEdit from "./profileEditForm/PaymentInfoEdit";

const ProfileView = () => {
  const fetchProfile = useTrainerStore((state) => state.fetchProfile);
  const profile = useTrainerStore((state) => state.profile);
  const setProfile=useTrainerStore((state)=>state.setProfile);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  // const {user}=useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleClose=()=>setEditingSection(null);
  const reSubmit=async()=>{
    if(profile){

      if(profile?.certificationInfo.status===DOC_VERIFY_STATUS.REJECTED ||
        profile?.idVerification.status===DOC_VERIFY_STATUS.REJECTED){
        toast.custom('Please update your rejected documents,then submit');
        return;
      }
      const data=await trainerService.updateTrainerStatus(profile?.id,TRAINER_STATUS.SUBMITTED);
      setProfile(data.profile);    
    }
    
  }

  return (
    <div className=" bg-card grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className="w-full py-6 z-50 font-bold">
        <h1>Profile Overview</h1>
        <p>{profile?.status===TRAINER_STATUS.REJECTED && (<Badge variant="destructive"> {profile?.status}</Badge>)}</p>
        <span className="text-xs font-normal text-amber-200">{profile?.status===TRAINER_STATUS.APPROVED? <VerifiedIcon className="text-primary"/>:`status: ${profile?.status}`}</span>
      </div>
      {profile && Object.keys(profile).length > 0 ? (
        <>
          <div className="lg:col-span-2 space-y-4"></div>

          <div className="lg:col-span-2 space-y-4">
            <Accordion
              type="multiple"
              defaultValue={["personal", "id"]}
              className="w-full"
            >
              {/* Basic info */}
              <AccordionItem
                value="Branding"
                className="border  rounded-lg px-4"
              >
                <AccordionTrigger className="  hover:  no-underline py-4">
                  <div className="flex  gap-3">
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                    <span className="font-bold">Branding Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="   relative pb-4 bg-[#1e1e1f] border-t pt-4 rounded-lg">
                 {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&
                      <Button className=" absolute right-0"
                    variant="ghost">
                      <Edit2 className=" text-trainer-primary"/>
                  </Button>
                }
                  <div className=" grid grid-cols-2 gap-y-4 justify-items-start text-left px-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        DisplayName
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.displayName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Core Discipline{" "}
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.category}: ({profile?.coreDiscipline})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Expertise{" "}
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.specialties}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase">
                        Experience :{" "}
                      </p>{" "}
                      <span className="text-sm font-medium">
                        {profile?.experience}
                      </span>
                      <hr />
                      <p className="text-sm font-semibold text-muted-foreground uppercase">
                        Language{" "}
                      </p>
                      <p>{profile?.languages}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Bio
                      </p>
                      <p className="text-sm">{profile?.bio} </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* Personal & Address */}
              <AccordionItem
                value="personal"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                    <span className="font-bold">
                      Personal & Contact Information
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4">
                  {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&
                      <Button className=" absolute right-0"
                    variant="ghost">
                      <Edit2 className=" text-trainer-primary"/>
                  </Button>
                  }
                  <div className="grid grid-cols-2 gap-y-4 justify-items-start text-left px-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Full Name
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.personalInfo.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        DOB
                      </p>
                      <p className="text-sm font-medium">
                        {parseISO(
                          profile?.personalInfo.DOB ?? "",
                        ).toLocaleDateString()}
                        {}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-semibold text-muted-foreground uppercase">
                        Gender{" "}
                      </p>
                      <p>{profile?.personalInfo.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Phone{" "}
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.personalInfo.phone}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Address
                      </p>
                      <p className="text-sm">
                        {profile?.personalInfo.address.street},{" "}
                        {profile?.personalInfo.address.city},{" "}
                        {profile?.personalInfo.address.state} -{" "}
                        {profile?.personalInfo.address.zip}
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
                    <span className="font-bold">
                      Professional Certificates{" "}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                  <div className=" grid grid-cols-2 gap-y-4">
                    {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&    
                      <Button variant="outline"className=" absolute right-0"
                      onClick={()=>setEditingSection("certificationInfo")}>{profile?.certificationInfo?.status !==
                      DOC_VERIFY_STATUS.REJECTED ? <Edit2 className=" text-trainer-primary"/>:"Change"}</Button>
                    }
                    {profile?.certificationInfo.documents.map(
                      (cert: ICertification, i: number) => (
                        <div
                          key={i}
                          className="text-sm p-3 border rounded-md hover:bg-muted/30"
                        >
                          <p className="font-normal text-primary">
                            Name:{cert.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Issued:{" "}
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Expires:{" "}
                            {new Date(cert.validUpto).toLocaleDateString()}
                          </p>

                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs"
                            asChild
                          >
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          </Button>
                        </div>
                      ),
                    )}
                     {profile?.certificationInfo.documents.length && (
                        <div className=" flex items-left right-0 justify-around gap-5 px-2">  
                          <div>                  
                            <p
                              className={`text-sm ${profile?.certificationInfo?.status === DOC_VERIFY_STATUS.REJECTED
                                  ? "text-red-600"
                                  : "text-white"
                              }`}> verification Status : 
                              {profile?.certificationInfo?.status.toUpperCase()} 
                              {profile.certificationInfo.status=== DOC_VERIFY_STATUS.REJECTED &&(` with Reason : " ${ profile?.certificationInfo?.rejectReason} "` )}
                            </p>           
                            
                          </div>   
                        </div> 
                      )}    
                  </div>
                  {/* edit section */}
                  <div>                        
                           {editingSection === "certificationInfo" &&(                          
                            <CertificatesForm
                            initialData={profile?.certificationInfo.documents || []}
                              onCancel={handleClose}
                            
                              onSuccess={handleClose}
                            />   
                         
                          )}                           
                  </div>  
                </AccordionContent>
              </AccordionItem>

              {/* Govt ID Verification */}
              <AccordionItem value="id" className="border rounded-lg mt-4 px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-orange-600 h-5 w-5" />
                    <span className="font-bold">
                      Government ID Verification
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                    {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&
                      <Button variant="outline"className=" absolute right-0"
                      onClick={()=>setEditingSection("idVerification")}>{profile?.idVerification?.status !== DOC_VERIFY_STATUS.REJECTED ? <Edit2 className=" text-trainer-primary"/>:"Change"}</Button>
                    }
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <p className="text-sm">
                        Type: <strong>{profile?.idVerification.idType}</strong>
                      </p>
                      <p className="text-sm">
                        Number:{" "}
                        <strong>{profile?.idVerification.idNumber}</strong>
                      </p>
                      <Badge
                        variant={
                          profile?.idVerification.verified
                            ? "default"
                            : "destructive"
                        }
                      >
                         {profile?.idVerification.status}
                      </Badge>
                    </div>

                    <div className="w-full md:w-48 aspect-video bg-muted rounded flex flex-col items-center justify-center border border-dashed border-gray-400">
                      <p className="text-[10px] text-muted-foreground mb-2 text-center px-2">
                        ID Attachment
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile?.idVerification.idAttachment}
                          target="_blank"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Preview ID
                        </a>
                      </Button>
                    </div>
                     {profile?.idVerification?.status && (
                      <div className="flex items-end right-0 justify-around">                      
                        
                        {profile?.idVerification?.status ===
                          DOC_VERIFY_STATUS.REJECTED && (
                          <div className="flex items-center gap-2 ">
                            
                            <Button variant="ghost"><Edit2 className=" text-trainer-primary"/></Button>
                          </div>
                        )}
                      </div>
                    )}
                    {profile?.idVerification.status ===
                      DOC_VERIFY_STATUS.REJECTED && (
                      <div className="flex items-center gap-2 ">
                        <Button variant="ghost"><Edit2 className=" text-trainer-primary"/></Button>
                      </div>
                    )}
                  </div>
                  {profile &&editingSection==='idVerification'&& (
                    <IdVerificationFormEdit
                    initialData={{idType: profile.idVerification?.idType,
                                  idNumber: profile.idVerification?.idNumber,
                    }}
                      onCancel={handleClose}
                  
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
              {/* Availability & Schedule */}
              <AccordionItem
                value="personal"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                    <span className="font-bold">Availability & Schedule</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3 ">
                  {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&
                    <Button variant="ghost"className=" absolute right-0"
                    onClick={()=>setEditingSection("availability")}> <Edit2 className=" text-trainer-primary"/></Button>
                  }
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        SessionCharge
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.pricing.sessionCharge}{" "}
                        {profile?.pricing.currency}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Availabilty:{" "}
                        <span className="px-2 text-sm font-bold text-primary">
                          {profile?.availability.isAvailable
                            ? "Active"
                            : "Not Available"}{" "}
                        </span>
                      </p>
                      <div className="space-y-2 ">
                        {profile?.availability &&
                          Object.entries(profile.availability)
                            .filter(
                              ([key, value]) =>
                                key !== "isAvailable" &&
                                typeof value === "object" &&
                                value.available,
                            )
                            .map(([day, info]: [string, any]) => (
                              <div
                                key={day}
                                className="w-full flex justify-between items-center  text-sm border-b pb-1 border-muted/50"
                              >
                                <span className="font-medium capitalize">
                                  {day}:
                                </span>
                                <span className="px-10 text-muted-foreground">
                                  {info.startTime} - {info.endTime}
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                  {editingSection === "availability" && (
                    <AvailabilityFormEdit 
                      initialData=
                      {{ 
                        pricing: profile.pricing,
                        availability:profile?.availability,
                      
                      }}                      
                      onCancel={() => setEditingSection(null)}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
              {/* Payment & Bank Info */}
              <AccordionItem
                value="payment"
                className="border rounded-lg mt-4 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-green-600 h-5 w-5" />
                    <span className="font-bold">Banking & Payment Data</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                  {profile.status!==TRAINER_STATUS.UNDER_REVIEW &&
                    <Button variant="ghost"className=" absolute right-0"
                    onClick={()=>setEditingSection("paymentInfo")}> <Edit2 className=" text-trainer-primary"/></Button>
                  }
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/20 rounded">
                      <p className="text-xs text-muted-foreground uppercase font-bold">
                        Bank Account
                      </p>
                      <p className="text-sm">
                        Name:{profile?.paymentInfo.bankAccount?.accountName}
                      </p>
                      <p className="text-sm">
                        A/C:{profile?.paymentInfo.bankAccount?.accountNumber}
                      </p>
                      <p className="text-sm">
                        IFSC: {profile?.paymentInfo.bankAccount?.ifscCode}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded">
                      <p className="text-xs text-muted-foreground uppercase font-bold">
                        UPI ID
                      </p>
                      <p className="text-sm font-mono mt-2">
                        {profile?.paymentInfo.upiId || "Not Provided"}
                      </p>
                    </div>
                  </div>
                  {editingSection === "paymentInfo" && (
                    <PaymentInfoFormEdit 
                      initialData={profile?.paymentInfo} 
                      onCancel={() => setEditingSection(null)} 
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-4">
            {/* ADMIN ACTION BOX */}
            <div className="border rounded-lg bg-secondary/10 p-4 sticky top-4">
              {profile && (
              <div className="space-y-2">
                {profile.status===TRAINER_STATUS.REJECTED &&(
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 h-12"
                    onClick={reSubmit}
                  >
                  submit for Re review
                  </Button>
                )}
               
                
              </div>
            )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-10 text-center text-muted-foreground">
          Loading Profile ...
        </div>
      )}
    </div>
  );
};
export default ProfileView;
