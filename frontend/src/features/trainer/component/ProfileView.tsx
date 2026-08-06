import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  ExternalLink,
  CreditCard,
  Building2,
  ShieldCheck,
  Award,
  Edit2,
  VerifiedIcon,
  User2Icon,
  Camera,
  Loader2,
} from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { CURRENCY, DOC_VERIFY_STATUS, ROLES, TRAINER_STATUS, UPLOAD_TYPE } from '@/constants/constants';

import { parseISO } from 'date-fns';

import { useTrainerStore, type ICertification,  } from '../store/useTrainerStore';
import CertificatesForm from './profileEditForm/CertificatesForm';

import { trainerService } from '../service/trainerService';
import toast from 'react-hot-toast';
import IdVerificationFormEdit from './profileEditForm/IdVerificationFormEdit';
import AvailabilityFormEdit from './profileEditForm/AvailabiltyFormEdit';
import PaymentInfoFormEdit from './profileEditForm/PaymentInfoEdit';
import { formatTo12Hour } from '@/utils/formatDate';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import BasicInfoEditForm from './profileEditForm/BasicInfoEditForm';
import PersonalInfoEditForm from './profileEditForm/PersonalInfoEditForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadService } from '@/service/upload.service';
import {  documentsService } from '../service/documentsService';

const ProfileView = () => {
  const fetchProfile = useTrainerStore((state) => state.fetchProfile);
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const [trainerData, setTrainerData] = useState(profile);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const {user,setUser}=useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading,setIsLoading]=useState(false);    
const [imageVersion, setImageVersion] = useState(() => Date.now());

  useEffect(() => {
    fetchProfile();    
  }, []);

  useEffect(() => {
       setTrainerData(profile)
  }, [profile]);


    const LOCKED_STATUSES = [
      TRAINER_STATUS.SUBMITTED,
      TRAINER_STATUS.UNDER_REVIEW,
      TRAINER_STATUS.SUSPENDED,
    ];

    const canEditBasicInfo = !LOCKED_STATUSES.includes(profile?.status!);
    const canEditPersonalInfo = !LOCKED_STATUSES.includes(profile?.status!);
    const canEditProfessionalInfo = !LOCKED_STATUSES.includes(profile?.status!);
    const canEditPricingAvailability = !LOCKED_STATUSES.includes(profile?.status!);
    const canEditIdDocuments = profile?.status === TRAINER_STATUS.REJECTED;
    const canEditPayment =  profile?.status === TRAINER_STATUS.APPROVED ||  profile?.status === TRAINER_STATUS.REJECTED;

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const userId = user?.id;    
      if (!file || !userId) return; 
      try{
        setIsLoading(true);
         const folderPath = `trainers/${userId}/${profile?.category}`;
        // 1. Upload Profile Picture
        const  [profilePicUrl] = await uploadService.upload(
            file,
            `${folderPath}/profiles`,
            userId!,
            UPLOAD_TYPE.PROFILE_PIC
          );
        if(!trainerData?.id){
          toast.error("failed to update profile photo, please try again");
          return;
        }
        const data = await trainerService.updateProfilePic(trainerData.id, profilePicUrl);
        setImageVersion(Date.now()); 
        setProfile(data.profileData);
        setUser({ 
          ...user,
          profilePic: data.profileData.profilePic,
        });    
        console.log(data.profileData.profilePic);
       setIsLoading(false);
    } 
    catch (error) {
        toast.error('Failed to update profile photo, please try again');
        setIsLoading(false);
    }
     
  };
  const getCertificate=async(certId:string)=>{
       const newTab = window.open('', '_blank'); 
    try{      
      if(profile){  
         
        const blob=await documentsService.getCertificateDoc(certId,profile?.id);
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
      if(profile){  
         
        const blob=await documentsService.getIdAttchmentDoc(profile?.id);
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

  const handleClose = () => {
    setEditingSection(null);
  }
  
  
  const reSubmit = async () => {
    if (profile) {
      if (
        profile?.certificationInfo.status === DOC_VERIFY_STATUS.REJECTED ||
        profile?.idVerification.status === DOC_VERIFY_STATUS.REJECTED
      ) {
        toast.custom('Please update your rejected documents,then submit');
        return;
      }
      const data = await trainerService.updateTrainerStatus(
        profile?.id,
        TRAINER_STATUS.SUBMITTED
      );
      setProfile(data.profile);
    }
  };

  return (
  
    <div className="w-full max-w-3xl p-6 rounded-xl mx-auto z-50 bg-zinc-800/50">
        <div className="  items-center  justify-center  gap-2 w-full pb-6 mb-4 z-50 font-bold">
          <h1>Profile Overview</h1>
          <p>
            {profile?.status === TRAINER_STATUS.REJECTED && (
              <Badge variant="destructive"> {profile?.status}</Badge>
            )}
          </p>
          <span className="text-xs font-normal text-amber-200">
            {profile?.status === TRAINER_STATUS.APPROVED ? (
              <VerifiedIcon className="text-primary" />
            ) : (
              `status: ${profile?.status}`
            )}
          </span>
        </div>
       
        {/* Avatar Row */}
          <div className="flex items-center justify-center gap-5 pb-6 border-b border-border/50">
            <div className="relative">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarImage src={`${trainerData?.profilePic}?v=${imageVersion}`} />
                <AvatarFallback className="bg-muted">
                  <User2Icon size={28} className="text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
               {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />            
            </div>                 
            <div className='text-start'>
              <h3 className="text-base font-semibold">{profile?.displayName}</h3>
              <p className="text-sm text-muted-foreground">{ROLES.TRAINER[0].toUpperCase()+ROLES.TRAINER.slice(1)}</p>
              <p className="text-sm text-primary " >{user?.email}</p>
            </div>
          </div>
        {profile && Object.keys(profile).length > 0 ? (
        <>
          <div className="space-y-4 border-2 rounded-xl p-2 mb-2">
            {/* Basic info */}
            <div className=" grid grid-cols-2 gap-y-4 justify-items-start text-left px-3 relative">
                {canEditBasicInfo && (      
                 <Button className=" absolute right-0  " variant="ghost"
                  onClick={() => setEditingSection('basicInfo')}>
                    <Edit2 className=" text-primary"/>
                  </Button>
                )}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Display Name:
                  </p>
                  <p className="text-sm font-normal">
                    {profile?.displayName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Core Discipline{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {profile?.category} -{profile?.coreDiscipline}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Email{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {user?.email} 
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Specialties{' '}
                  </p>
                  <p className="text-sm font-medium">
                    {profile?.specialties?.length> 1 ?profile?.specialties.join(', '):profile?.specialties}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    Experience :{' '}
                  </p>{' '}
                  <span className="text-sm font-medium">
                    {profile?.experience} year
                  </span>
                  <hr />
                </div>  
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    Language{' '}
                  </p>
                  <span>{profile?.languages?.length> 1 ?profile?.languages.join(', '):profile?.languages}
                  </span>
                  
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Bio
                  </p>
                  <p className="text-sm">{profile?.bio} </p>
                </div>
              </div>             
          </div>
           {/* edit section */}
            <div>
                {editingSection === 'basicInfo' && (
                  <BasicInfoEditForm
                    initialData={{displayName:profile?.displayName,category:profile?.category,coreDiscipline:profile?.coreDiscipline,bio:profile?.bio?profile?.bio:"",specialties:profile?.specialties,languages:profile?.languages,experience:profile?.experience}}
                    onCancel={handleClose}                    
                  />
                )}
            </div>
          <div className="lg:col-span-2 space-y-4">
            <Accordion
              type="single"
              collapsible 
              // defaultValue={['personal', 'id']}
              className="w-full"
            >          
             
              {/* Personal & Address */}
              <AccordionItem
                value="personal"
                className="border rounded-lg px-4 "
              >
                <AccordionTrigger className="hover:no-underline  py-4 border-b border-gray-500
                 
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

                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4">
                  {canEditPersonalInfo && (
                    <Button className=" absolute right-0" variant="ghost"
                    onClick={() => setEditingSection('personalInfo')}>
                      <Edit2 className=" text-trainer-primary" />                      
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-y-4 justify-items-start text-left px-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Full Name
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.personalInfo?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        DOB
                      </p>
                      <p className="text-sm font-medium">
                        {parseISO(
                          profile?.personalInfo?.DOB ?? ''
                        ).toLocaleDateString()}
                        {}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs  font-semibold text-muted-foreground uppercase">
                        Gender{' '}
                      </p>
                      <p>{profile?.personalInfo?.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Phone{' '}
                      </p>
                      <p className="text-sm font-medium">
                        {profile?.personalInfo?.phone}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Address
                      </p>
                      <p className="text-sm">
                        {profile?.personalInfo?.address.street},{' '}
                        {profile?.personalInfo?.address.city},{' '}
                        {profile?.personalInfo?.address.state} -{' '}
                        {profile?.personalInfo?.address.zip}
                      </p>
                    </div>
                  </div>
                  {/* edit section */}
                  <div>
                      {editingSection === 'personalInfo' && (
                        <PersonalInfoEditForm
                          initialData={profile.personalInfo}
                          onCancel={handleClose}                    
                        />
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/*Certificates &Licence  */}
              <AccordionItem
                value="Certificates"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4 border-b border-gray-500
              data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
                
                  <div className="flex items-center gap-3">
                    <Award className="text-green-600 h-5 w-5" />
                    <span className="font-bold">
                      Professional Certificates{' '}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                  <div className=" grid grid-cols-2 gap-y-4">
                    {canEditProfessionalInfo && (
                      <Button
                        variant="outline"
                        className=" absolute right-0"
                        onClick={() => setEditingSection('certificationInfo')}
                      >
                        {profile?.certificationInfo?.status !==
                        DOC_VERIFY_STATUS.REJECTED ? (
                          <Edit2 className=" text-trainer-primary" />
                        ) : (
                          'Change'
                        )}
                      </Button>
                    )}
                    {profile?.certificationInfo?.documents.length && (
                      <div className="absolute flex items-end left-0 top-0  gap-2 px-4 py-2">
                        <div>
                          <p className='text-xs'> verification Status :
                            <span
                              className={`text-xs ${
                                profile?.certificationInfo?.status ===
                                DOC_VERIFY_STATUS.REJECTED
                                  ? 'text-red-600'
                                  :  profile?.certificationInfo?.status ===DOC_VERIFY_STATUS.PENDING?'text-amber-400':'text-white'
                              }`}
                            >
                              {' '}
                            
                              {profile?.certificationInfo?.status[0].toUpperCase()+profile?.certificationInfo?.status.slice(1)}
                              {profile.certificationInfo.status ===
                                DOC_VERIFY_STATUS.REJECTED &&
                                ` with Reason : " ${profile?.certificationInfo?.rejectReason} "`}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                    {profile?.certificationInfo?.documents.map(
                      (cert: ICertification, i: number) => (
                        <div
                          key={i}
                          className="text-sm mt-2 p-2 border border-black bg-zinc-900/80 rounded-md hover:bg-muted/30"
                        >
                          <p className="font-normal text-primary">
                            Name:{cert.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Issued:{' '}
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Expires:{' '}
                            {new Date(cert.validUpto).toLocaleDateString()}
                          </p>

                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs"
                            asChild
                          >
                            <a
                                 onClick={()=>getCertificate(cert.id)}                             
                            >
                              View Certificate
                            </a>
                          </Button>
                        </div>
                      )
                    )}
                    
                  </div>
                  {/* edit section */}
                  {}
                  <div>
                    {editingSection === 'certificationInfo' && (
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
                <AccordionTrigger className="hover:no-underline border-b border-gray-500
                 data-[state=open]:text-gray-400
                    data-[state=open]:bg-green-900/50
                   data-[state=open]:border-b-2
                  data-[state=open]:px-2
                  data-[state=open]:rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-orange-600 h-5 w-5" />
                    <span className="font-bold">
                      Government ID Verification
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                  {canEditIdDocuments && (
                    <Button
                      variant="outline"
                      className=" absolute right-0"
                      onClick={() => setEditingSection('idVerification')}
                    >
                      {profile?.idVerification?.status ===
                      DOC_VERIFY_STATUS.REJECTED && (
                        <Edit2 className=" text-trainer-primary" />
                      ) }
                    </Button>
                  )}
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <p className="text-sm">
                        Type: <strong>{profile?.idVerification?.idType}</strong>
                      </p>
                      <p className="text-sm">
                        Number:{' '}
                        <strong>{profile?.idVerification?.idNumber}</strong>
                      </p>
                      <Badge
                        variant={
                          profile?.idVerification?.verified
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {profile?.idVerification?.status}
                      </Badge>
                    </div>

                    <div className="w-full md:w-48 aspect-video bg-muted rounded flex flex-col items-center justify-center border border-dashed border-gray-400">
                      <p className="text-[10px] text-muted-foreground mb-2 text-center px-2">
                        ID Attachment
                      </p>
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
                    {profile?.idVerification?.status && (
                      <div className="flex items-end right-0 justify-around">
                        {profile?.idVerification?.status ===
                          DOC_VERIFY_STATUS.REJECTED && (
                          <div className="flex items-center gap-2 ">
                            <Button variant="ghost">
                              <Edit2 className=" text-trainer-primary" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {profile?.idVerification?.status ===
                      DOC_VERIFY_STATUS.REJECTED && (
                      <div className="flex items-center gap-2 ">
                        <Button variant="ghost">
                          <Edit2 className=" text-trainer-primary" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {profile && editingSection === 'idVerification' && (
                    <IdVerificationFormEdit
                      initialData={{
                        idType: profile.idVerification?.idType,
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
                <AccordionTrigger className="hover:no-underline py-4 border-b border-gray-500
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
                <AccordionContent className="relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3 ">
                  {canEditPricingAvailability && (
                    <Button
                      variant="ghost"
                      className=" absolute right-0"
                      onClick={() => setEditingSection('availability')}
                    >
                      {' '}
                      <Edit2 className=" text-trainer-primary" />
                    </Button>
                  )}
                  <div>
                    <div className="grid grid-cols-2 items-center gap-y-4">
                      <div>
                          <p className="text-xs font-semibold p-2 text-muted-foreground uppercase">
                            SessionCharge :<span className="text-sm px-2 text-white font-medium">
                          {' '}{CURRENCY} {profile?.pricing?.sessionCharge}
                            
                          </span>
                          </p>                      
                      </div>                  
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Availabilty:{' '}
                        <span className="px-2 text-sm font-bold text-primary">
                          {profile?.availability?.isAvailable
                            ? 'Active'
                            : 'Not Available'}{' '}
                        </span>
                      </p>
                    </div>  
                    <div className=" space-y-2 border rounded-xl p-2">
                          {profile?.availability &&
                            Object.entries(profile.availability)
                              .filter(
                                ([key, value]) =>
                                  key !== 'isAvailable' &&
                                  typeof value === 'object' &&
                                  value.available
                              )
                              .map(([day, info]: [string, any]) => (
                                <div
                                  key={day}
                                  className="grid grid-cols-2 gap-y-2"
                                  // className="w-full flex justify-between items-center  text-sm border-b pb-1 border-muted/50"
                                >
                                  <span className="font-medium capitalize">
                                    {day}:
                                  </span>
                                  <span className="px-6 text-muted-foreground">
                                    {formatTo12Hour(info.startTime)} - {formatTo12Hour(info.endTime)}
                                  </span>
                                </div>
                            ))}
                    </div>
                  </div>    
                  {editingSection === 'availability' && (
                    <AvailabilityFormEdit
                      initialData={{
                        pricing: profile.pricing,
                        availability: profile?.availability,
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
                <AccordionTrigger className="hover:no-underline border-b border-gray-500
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
                <AccordionContent className=" relative pb-4 bg-[#1e1e1f] border-t pt-4 justify-items-start text-left px-3">
                  {canEditPayment && (
                    <Button
                      variant="ghost"
                      className=" absolute right-0"
                      onClick={() => setEditingSection('paymentInfo')}
                    >
                      {' '}
                      <Edit2 className=" text-trainer-primary" />
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary/20 rounded">
                      <p className="text-xs text-muted-foreground uppercase font-bold">
                        Bank Account
                      </p>
                      <p className="text-sm">
                        Name: {profile?.paymentInfo?.bankAccount?.accountName}
                      </p>
                      <p className="text-sm">
                        A/C : {profile?.paymentInfo?.bankAccount?.accountNumber}
                      </p>
                      <p className="text-sm">
                        IFSC: {profile?.paymentInfo?.bankAccount?.ifscCode}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded">
                      <p className="text-xs text-muted-foreground uppercase font-bold">
                        UPI ID
                      </p>
                      <p className="text-sm font-mono mt-2">
                        {profile?.paymentInfo?.upiId || 'Not Provided'}
                      </p>
                    </div>
                  </div>
                  {editingSection === 'paymentInfo' && (
                    <PaymentInfoFormEdit
                      initialData={profile?.paymentInfo}
                      onCancel={() => setEditingSection(null)}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* <div className="space-y-4">
            
            {/* <div className="border rounded-lg bg-secondary/10 p-4 sticky top-4"> */}
            {/* ADMIN ACTION BOX */}
              {profile && (
                <div className="space-y-2">
                  {profile.status === TRAINER_STATUS.REJECTED && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 h-12"
                      onClick={reSubmit}
                    >
                      submit for Re review
                    </Button>
                  )}
                </div>
              )}
            {/* </div> */}
          {/* </div> */}
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
