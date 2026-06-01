import { ITrainerProfile } from "@/models/trainerProfile.model";
import { Types } from "mongoose";
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

interface ITrainerProfilePopulatedUser extends Omit<ITrainerProfile,'userId'>{
    userId:{
        _id:Types.ObjectId,
        name:string,
        email;string,
    }
}
export const toAdminTrainersResponseDTO=(trainer:ITrainerProfilePopulatedUser )=>{
    const timezone = getTimezone();
    return{
        id:trainer._id.toString(),
          userId:trainer.userId._id.toString(),
          name:trainer.userId.name,
          email:trainer.userId.email,
          // basic Info Branding
          category: trainer.category,
          displayName: trainer.displayName,
          coreDiscipline:trainer.coreDiscipline,
          specialties: trainer.specialties,
          experience:trainer.experience,
          languages: trainer.languages,
          isCertsVerified:trainer.certificationInfo.status,
          isIdVerified:trainer.idVerification.status,
          status: trainer.status,
          createdAt: formatInTimeZone(trainer.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        }
    }
