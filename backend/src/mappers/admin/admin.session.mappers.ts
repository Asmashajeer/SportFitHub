import { IPopulatedTrainer } from "@/dtos/response/session/sports.session.response.dto";
import { IFitnessSession } from "@/models/fitnessSession.model";
import { ISportsSession } from "@/models/sportsSession.model";
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";
import { IFitnessSessionDTOWithCategory, ISportsSessionDTOWithCategory } from "@/dtos/request/admin/admin.session.dto";

export const toAdminSessionResponseDTO=(session:ISportsSessionDTOWithCategory|IFitnessSessionDTOWithCategory)=>{
    const timezone = getTimezone();
     const isFitness = 'fitnessCategory' in session;
    const category = isFitness
        ? (session as IFitnessSessionDTOWithCategory).fitnessCategory.programName
        : (session as ISportsSessionDTOWithCategory).sportCategory.sportName;
    return{
         id:session._id.toString(),
        sessionName: session.sessionName,
        trainer: session.trainerId,
        category,
        sessionType: session.sessionType,
       
        ageGroup:session.ageGroup, 
        enrolledCount: session.enrolledCount,
        maxCapacity:session.maxCapacity ,
        pricing: session.pricing,
        isActive: session.isActive,
        isApproved: session.isApproved,
        isDeleted: session.isDeleted,
        createdAt: formatInTimeZone(session.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
        // only include for fitness sessions
        ...(isFitness && {
            mode: (session as IFitnessSessionDTOWithCategory).mode,           
        }),
    }
}


export const toAdminSessionActionResponseDTO=(session:ISportsSession|IFitnessSession)=>{
    const timezone = getTimezone();
    const isFitness = 'fitnessCategory' in session;
    const category = isFitness
        ? (session as IFitnessSession).fitnessCategory.toString()
        : (session as ISportsSession).sportCategory.toString()
    return{
         id:session._id.toString(),
        sessionName: session.sessionName,
        trainer: session.trainerId.toString(),
        category,
        sessionType: session.sessionType,
        
        ageGroup:session.ageGroup, 
        enrolledCount: session.enrolledCount,
        maxCapacity:session.maxCapacity ,
        pricing: session.pricing,
        isActive: session.isActive,
        isApproved: session.isApproved,
        isDeleted: session.isDeleted,
        createdAt:formatInTimeZone(session.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
         ...(isFitness && {
            mode: (session as IFitnessSession).mode,           
        }),
    }
}
interface  ITrainerDetails extends IPopulatedTrainer{    
    idVerification:{
        verified:boolean
    }

    certificationInfo:{
        verified:boolean,
    }
    createdAt:string
} 
export interface SportsSessionDetails extends  Omit<ISportsSession ,'trainerId'>{
    trainerId: ITrainerDetails
}
export interface FitnessSessionDetails extends  Omit<IFitnessSession ,'trainerId'>{
    trainerId: ITrainerDetails
};
export const toAdminSessionDetailedViewDTO=(session:SportsSessionDetails|FitnessSessionDetails)=>{
    const timezone = getTimezone();
    const isFitness = 'fitnessCategory' in session;
    const category = isFitness
        ? (session as unknown as IFitnessSession).fitnessCategory.toString()
        : (session as unknown as ISportsSession).sportCategory.toString();
    return{
        id:session._id.toString(),
        trainer:session.trainerId?{
            id: session.trainerId._id.toString(),
           displayName: session.trainerId.displayName,
            profilePic:session.trainerId.profilePic,
           coreDiscipline:session.trainerId.coreDiscipline,
            specialties:session.trainerId.specialties,
           experience :session.trainerId.experience,
            languages:session.trainerId.languages,
            averageRating:session.trainerId.averageRating,
            isIdVerified:session.trainerId.idVerification.verified,
            isCertificateVerified:session.trainerId.certificationInfo.verified,
            joinedAt:formatInTimeZone(session.trainerId.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
        }:null,
        category,
        sessionName: session.sessionName,
        description:session.description,
        duration:session.duration,
        ageGroup:session.ageGroup,
        sessionType: session.sessionType,
        
        maxCapacity:session.maxCapacity ,
        enrolledCount: session.enrolledCount,       
        venue: session.venue,
        amenities: session.amenities,
        timeSlots:session.timeSlots,
        pricing: session.pricing,
         cancellationPolicy: session.cancellationPolicy,
        cancellationWindow:  session. cancellationWindow,
        bookingDeadline: session.bookingDeadline,
        isActive: session.isActive,
        isApproved: session.isApproved,
        isDeleted: session.isDeleted,
         images: session.images,
        rating:session.rating, 
        createdAt:formatInTimeZone(session.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
        updatedAt:formatInTimeZone(session.updatedAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
        // only include for fitness sessions
        ...(isFitness && {
            mode: (session as FitnessSessionDetails).mode,
            meetingLink: (session as FitnessSessionDetails).meetingLink ?? null,
            venue: (session as FitnessSessionDetails).venue ?? null,
        }),
    }
}
