import { ERROR_MESSAGES } from "@/constants/messages";
import { SportsResponseDTO } from "@/dtos/response/admin/sports.response.dto";
import { ISportsRespository } from "@/interfaces/repositories/ISports.respository";
import { ISportsService } from "@/interfaces/services/Isports.service";
import { toSportsResponseDTO } from "@/mappers/sports.mapper";
import AppError from "@/utils/AppError";

export class SportsService implements ISportsService{
    
    private _sportsRepo:ISportsRespository;
    constructor(sportsRepo:ISportsRespository){        
        this._sportsRepo=sportsRepo;
     }

     async getActiveSports():Promise<SportsResponseDTO[]>{
    const filter={
      isActive:true,
      
    }
    const data=await this._sportsRepo.find(filter);
     if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
     const sports = data.map((sport)=>toSportsResponseDTO(sport));
    return sports;
 
  }
   
}