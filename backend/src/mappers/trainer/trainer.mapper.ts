import { TrainerProfileResponseDTO } from "@/dtos/response/trainer/trainer.response.dto";
import {  PendingTrainersBasicDTO, TrainerProfileDTO } from "@/dtos/response/trainer/trainerApprovals.response";
import { ITrainerProfile,ICertification, } from "@/models/trainerProfile.model";
import { Document } from "mongoose";

export const toTrainerProfileData=(profile:Partial<ITrainerProfile>):TrainerProfileResponseDTO=>{
       {
        return{
            basicInfo:{
                displayName: profile.displayName,
                profilePic :profile.profilePic,
                // category :profile.category ,
                // coreDiscipline : profile.coreDiscipline ,
                // bio :profile.bio,
                // specialties :profile.specialties,
                // experience :profile.experience.toString(),
                // languages :profile.languages
            },
           verification : {
                overallStatus : profile.status ,
                idStatus : {
                    type  : profile.idVerification.idType ,
                    status :  profile.idVerification.status
                },
                certificationStatus  :{
                    count:  profile.certificationInfo.documents.length,
                    status :  profile.certificationInfo.status 
                },           
            },
            createdAt :profile.createdAt.toString()
        }
}
}

//trainer Approvals Basic Data
export const toPendingTrainersBasicData=(profile:Partial<ITrainerProfile>):PendingTrainersBasicDTO=>{
    return{
        id: profile._id.toString(),
          userId:profile.userId.toString(), 
          // basic Info Branding
          category:profile.category,
          displayName: profile.displayName, 
          specialties:profile.specialties ,
          experience:profile.experience,
          profilePic:profile.profilePic, 
        
          // Personal Info
          personalInfo: {
            fullName: profile.personalInfo.fullName,
             phone: profile.personalInfo.phone,  
          },
          // Administrative State
          status: profile.status,
          
          // Timestamps 
          createdAt: profile.createdAt.toISOString(),
          certCount:profile.certificationInfo.documents.length,
    }
}

export const ToTrainerProfileDTO = (trainer: ITrainerProfile): TrainerProfileDTO => {

    const data = trainer instanceof Document ? trainer.toObject() : trainer;

  return {
    id: trainer._id.toString(),
    userId: trainer.userId.toString(),
    
    category: trainer.category,
    displayName: trainer.displayName,
    coreDiscipline: trainer.coreDiscipline,
    bio: trainer.bio,
    specialties: trainer.specialties ? [...trainer.specialties] : [],
    experience: trainer.experience,
    languages: trainer.languages ,
    profilePic: trainer.profilePic,
    pricing: trainer.pricing ,

    personalInfo: {
      ...trainer.personalInfo,
     
      DOB: trainer.personalInfo?.DOB?.toISOString() || "",
      address: trainer.personalInfo?.address ? { ...trainer.personalInfo.address } : {}
    },

    certificationInfo: {
      ...trainer.certificationInfo,
      documents: (trainer.certificationInfo?.documents || []).map((doc:ICertification) => ({
        name: doc.name,
        url: doc.url,
        validUpto: doc.validUpto?.toString(),
        issuedAt: doc.issuedAt?.toString(),
        
      })),
      verifiedAt: trainer.certificationInfo?.verifiedAt?.toISOString()
    },

    idVerification: {
      ...trainer.idVerification,
      verifiedAt: trainer.idVerification?.verifiedAt?.toISOString()
    },

    currentLocation: trainer.currentLocation ? { ...trainer.currentLocation } : undefined,
    availability: trainer.availability ? { ...trainer.availability } : undefined,

    paymentInfo: {
      bankAccount: trainer.paymentInfo?.bankAccount ? { ...trainer.paymentInfo.bankAccount } : {},
      upiId: trainer.paymentInfo?.upiId
    },

    status: trainer.status,
    suspensionReason: trainer.suspensionReason,
    suspendedAt: trainer.suspendedAt?.toISOString(),
    rejectionReason: trainer.rejectionReason,
    rejectedAt: trainer.rejectedAt?.toISOString(),
    applicationCount: trainer.applicationCount || 0,

    createdAt: trainer.createdAt?.toISOString(),
  
    updatedAt: trainer.updatedAt?.toISOString() 
  };
};