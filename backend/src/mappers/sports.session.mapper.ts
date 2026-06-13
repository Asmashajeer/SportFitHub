import { ISportsSessionDetailsPopulated, ISportsSessionPopulated } from "@/dtos/response/session/sports.session.response.dto";

import { ISportsSession } from "@/models/sportsSession.model"
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toSportsSessionResponseDTO=(session:Partial<ISportsSession>)=>{
    const timezone = getTimezone();
    return{
        id:session._id.toString(),
        trainerId:session.trainerId.toString(),
        sessionName:session.sessionName,
        slug:session.slug,
        sportCategory: session.sportCategory.toString(),
        description:session.  description,
        duration:session. duration,
        ageGroup:session.  ageGroup,
        sessionType:session.  sessionType,
        maxCapacity:session. maxCapacity ,
        enrolledCount:session.  enrolledCount,        
        venue:session. venue,
        amenities:session.  amenities,
        timeSlots:session.  timeSlots,
        pricing:session. pricing,
        cancellationPolicy:session.cancellationPolicy,
        cancellationWindow:session.cancellationWindow,
         bookingDeadline:session.bookingDeadline,
        isActive: session.  isActive,
        isDeleted: session.  isDeleted,
        isApproved: session. isApproved,
        images:session.  images,
        rating:session. rating,
        createdAt: formatInTimeZone(session.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(session.updatedAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }

}



export const toSportSessionPublicDTO=(session:ISportsSessionPopulated)=>{
    const timezone = getTimezone();
    return{
        id:session._id.toString(),
        trainerId:session.trainerId.toString(),
        sportCategory:session.sportCategory?{
            _id: session.sportCategory._id.toString(),
            sportName: session.sportCategory.sportName, 
            icon: session.sportCategory.icon,
            slug:session.sportCategory.slug,
        } : null,
        
        sessionName: session. sessionName,
        slug:session.slug, 
        description:session.  description,
        duration:session. duration,
        ageGroup:session.  ageGroup,
        sessionType:session.  sessionType,
        maxCapacity:session. maxCapacity ,
        enrolledCount:session.  enrolledCount,       
        venue:session. venue,
        amenities:session.  amenities,
        timeSlots:session.  timeSlots,
        pricing:session. pricing,
         cancellationPolicy:session.cancellationPolicy,
        cancellationWindow:session.cancellationWindow,
        bookingDeadline:session.bookingDeadline,
        isActive: session.  isActive,
        isDeleted: session.  isDeleted,
        isApproved: session. isApproved,
        images:session.  images,
        rating:session. rating,
        createdAt: formatInTimeZone(session.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(session.updatedAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }

}


export const toSportSessionDetailedPublicDTO=(session:ISportsSessionDetailsPopulated)=>{
    const timezone = getTimezone();
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
        }:null,
        sportCategory:session.sportCategory?{
            id: session.sportCategory._id.toString(),
            sportName: session.sportCategory.sportName, 
            icon: session.sportCategory.icon,
            slug:session.sportCategory.slug,
        } : null,
        
        sessionName: session. sessionName,
        slug:session.slug, 
        description:session.  description,
        duration:session. duration,
        ageGroup:session.  ageGroup,
        sessionType:session.  sessionType,
        maxCapacity:session. maxCapacity ,
        enrolledCount:session.  enrolledCount,
     
        venue:session. venue,
        amenities:session.  amenities,
        timeSlots:session.  timeSlots,
        pricing:session. pricing,
        cancellationPolicy:session.cancellationPolicy,
        cancellationWindow:session.cancellationWindow,
        bookingDeadline:session.bookingDeadline,
        isActive: session.  isActive,
        isDeleted: session.  isDeleted,
        isApproved: session. isApproved,
        images:session.  images,
        rating:session. rating,
       createdAt: formatInTimeZone(session.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(session.updatedAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }

}


