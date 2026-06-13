
import { PAGINATION_LIMIT, UserRole } from "@/constants/enums";
import { ERROR_MESSAGES, STATUS_CODE } from "@/constants/messages";
import { FitnessSessionDetailedPublicDTO, FitnessSessionResponseDTO, GetFitnessSessionsResponseDTO, PaginatedFitnessSessionsResponseDTO } from "@/dtos/response/session/fitness.session.response.dto";
import { IFitnessSessionRepository } from "@/interfaces/repositories/IFitness.session.repository";
import { ITrainerRepository } from "@/interfaces/repositories/ITrainer.repository";
import { IUserRepository } from "@/interfaces/repositories/IUser.repository";
import { IBookingService } from "@/interfaces/services/booking/IBooking.service";
import { IFitnessSessionService } from "@/interfaces/services/session/IFitness.session.service ";
import { toFitnessSessionDetailedPublicDTO, toFitnessSessionPublicDTO, toFitnessSessionResponseDTO } from "@/mappers/fitness.session.mapper";
import { IFitnessSession } from "@/models/fitnessSession.model";
import AppError from "@/utils/AppError";
import { FilterQuery, Types } from "mongoose";

export class FitnessSessionService implements IFitnessSessionService{
    
    private _fitnessSessionRepo:IFitnessSessionRepository;  
    private _trainerRepo: ITrainerRepository;
    private _bookingService:IBookingService;
  
    constructor(fitnessSessionRepo:IFitnessSessionRepository,trainerRepo: ITrainerRepository,bookingService:IBookingService){
        
        this._fitnessSessionRepo=fitnessSessionRepo
        this._trainerRepo = trainerRepo;
  
     }
 
    

    //----------create Session------------------
      async createFitnessSession(
        sessionData: Partial<IFitnessSession>
      ): Promise<FitnessSessionResponseDTO> {
        const data = await this._fitnessSessionRepo.create(sessionData);
        if (!data) {
          throw new AppError(ERROR_MESSAGES.SESSION.CREATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
        }
        const session = toFitnessSessionResponseDTO(data);
        return session;
      }
    
      //--------update session-----------
      async updateFitnessSession(
        id: string | Types.ObjectId,
        sessionData: Partial<IFitnessSession>
      ): Promise<FitnessSessionResponseDTO> {
        const data = await this._fitnessSessionRepo.findOneAndUpdate(id, sessionData);
        if (!data) {
          throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
        }
        const session = toFitnessSessionResponseDTO(data);
        return session;
      }
    
      //-------delete session---------
      async deleteFitnessSession(id: string,cancelledBy:UserRole  ): Promise<FitnessSessionResponseDTO> {
        const bookingSessions= await this._bookingService.getBookedSessionsBySessionId(id);
         // ---no bookings
        if(bookingSessions.length===0){
          const data = await this._fitnessSessionRepo.deleteASession(id);
          
          if (!data) {
            throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
          }
          const session = toFitnessSessionResponseDTO(data);
          return session;
        }
        // ----with bookings
        const cancellationWindow= bookingSessions[0].session.cancellationWindow        
        const withinWindow = bookingSessions.some((bookingSession) =>
            this._bookingService.isWithinCancellationWindow(
              bookingSession.date.toString(),
              bookingSession.startTime,
              bookingSession.session.cancellationWindow
            )
          );
        if (withinWindow) {
            throw new AppError(
              `Cannot delete — one or more booked sessions are within the ${cancellationWindow}hr cancellation window`,
              STATUS_CODE.ERROR.BAD_REQUEST
            );
          }
        await Promise.all( 
          bookingSessions.map(async(bookingSession)=>{
            const sessionBookingId=bookingSession.id;
            const userId=bookingSession.userId.toString();
            const reason="Cancelled by trainer"
              
            await this._bookingService.cancelSession(sessionBookingId,reason,cancelledBy);
          })
        );
        const data = await this._fitnessSessionRepo.deleteASession(id);
          
          if (!data) {
            throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
          }
          const session = toFitnessSessionResponseDTO(data);
          return session;
      }
     //--------------make active/inactive session ----------
      async updateSessionVisibility( id: string | Types.ObjectId,isActive:boolean):Promise<FitnessSessionResponseDTO>{
          const data = await this._fitnessSessionRepo.findOneAndUpdate(id, {isActive:isActive});
          if (!data) {
            throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
          }
          const session = toFitnessSessionResponseDTO(data);
          return session;
      }





      //-------------- get all sessions by a trianerId--------------
      async getSessionsByTrainer(userId: string | Types.ObjectId,filters: FilterQuery<IFitnessSession>): Promise<PaginatedFitnessSessionsResponseDTO> {
        const trainer = await this._trainerRepo.findByUserId(userId);
        if (!trainer)
          throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
        const { search, page,limit } = filters;
            const query: FilterQuery<IFitnessSession> = {trainerId:trainer.id, isDeleted: false,page:page,limit:limit };
            if (search) {
              query.$or=[
                {sessionName : { $regex: search, $options: 'i' }},
                {sessionType : { $regex: search, $options: 'i' }}, 
                {intensityLevel:{$regex: search, $options: 'i'}}  ,    
                { mode:{ $regex: search, $options: 'i' }}
              ]
            }
            const isNumber = !isNaN(Number(search));
            if (isNumber && search !== "") {
            query.$or.push({ duration: Number(search) });
            }
            const result = await this._fitnessSessionRepo.findByTrainer(query);
              const sessionData = result?.sessions || [];     
            const sessions = sessionData.map(session => toFitnessSessionResponseDTO(session));
            return { sessions, pagination: result.pagination };
      }
      
      //--------------- get all sessions--public------------
      async getAllSessions(filters: FilterQuery<IFitnessSession>): Promise<GetFitnessSessionsResponseDTO> {
        const { page,limit,search,program, sessionType, ageGroup,lat,lng,radius } = filters;
        
        const query: FilterQuery<IFitnessSession> = { isDeleted: false,isApproved:true,isActive:true };
      
        if (search) {
          query.$or = [
            { sessionName: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
          ];
        }
        if (program && program!=='all') query.fitnessCategory = program;
        if (sessionType && sessionType!=='all') query.sessionType = sessionType;
        if (ageGroup && ageGroup!=='all') query.ageGroup = ageGroup;

         if (lat && lng && radius) {
            query["venue.location"] = {
            $geoWithin: {
                $centerSphere: [
                  [Number(lng), Number(lat)],  // [longitude, latitude]
                  radius/ 6371 
                ]
            }
          };
          }
        const result = await this._fitnessSessionRepo.findAll(query, {page: Number(page) || 1,limit: Number(limit) || PAGINATION_LIMIT});
        const sessionData = result?.sessions || [];
        console.log(result.pagination);
        const sessions = sessionData.map((session) => toFitnessSessionPublicDTO(session));
        return {sessions,pagination:result.pagination}
      }
      
    
      // ---------------------get  a session by ID-public-------------
      async getASession(id:string|Types.ObjectId):Promise<FitnessSessionDetailedPublicDTO>{
     
        const sessionData=await this._fitnessSessionRepo.findBysessionId(id);
       console.log("-----------");
        console.log(sessionData);
        const session=toFitnessSessionDetailedPublicDTO(sessionData)
        return session;
       
    
      }
}