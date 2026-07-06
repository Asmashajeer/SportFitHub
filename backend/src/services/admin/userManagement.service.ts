import { AppEmail, AppName, BOOKING_SESSION_STATUS, UserRole } from '@/constants/enums';
import {
  getAllusersResponseDTO,
  usersResposeDTO,
  userStatsResponseDTO,
} from '../../dtos/response/admin/user.dto';
import { IUserRepository } from '../../interfaces/repositories/IUser.repository';
import { IUserManagementService } from '../../interfaces/services/admin/IUserManagement.service';
import { toUsersResponseData } from '../../mappers/user.mapper';
import AppError from '../../utils/AppError';
import { ERROR_MESSAGES, STATUS_CODE } from '../../constants/messages';
import { getAllUsersRequestDTO } from '@/dtos/request/admin/admin.user.request.dto';
import mongoose, { FilterQuery } from 'mongoose';
import { IUser } from '@/models/user.model';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { IWalletRepository } from '@/interfaces/repositories/IWallet.repository';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import { formatDateTo } from '@/utils/formatTo';
import { sendPushNotification } from '@/utils/push-notification.service';
import { IBookingSession } from '@/models/booking.session.model';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { Mongoose } from 'mongoose';

export class UserManagementService implements IUserManagementService {
  private _userRepo: IUserRepository;
  private _bookingSessionRepo:IBookingSessionRepository;
  private _walletRepo:IWalletRepository;
  private _trainerRepo:ITrainerRepository;
  private _sportsSessionRepo: ISportsSessionRepository;
  private _fitnessSessionRepo: IFitnessSessionRepository;
  constructor(userRepo: IUserRepository,bookingSessionRepo:IBookingSessionRepository,walletRepo:IWalletRepository,trainerRepo:ITrainerRepository,sportsSessionRepo: ISportsSessionRepository,fitnessSessionRepo: IFitnessSessionRepository) {
    this._userRepo = userRepo;
    this._bookingSessionRepo=bookingSessionRepo;
    this._walletRepo=walletRepo;
    this._trainerRepo=trainerRepo;
    this._sportsSessionRepo= sportsSessionRepo;
    this._fitnessSessionRepo= fitnessSessionRepo;
  }
  getUsers = async (filters: getAllUsersRequestDTO): Promise<getAllusersResponseDTO> => {
    const { page, limit, search, status, role } = filters;

    const skip = (page - 1) * limit;
    const query: FilterQuery<IUser> = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if(!status||status==='all'){
      query.isActive=true;
    }
    else if (status === 'blocked') {
      query.isBlocked = true;
      query.isActive = true;
    } else if (status === 'active') {
      query.isBlocked = false;
      query.isActive = true;
    } else if (status === 'deleted') {
      query.isBlocked = true;
      query.isActive = false;
    }
    if (!role || role === 'all') {
      query.role = { $ne: 'admin' };
    } else {
      query.role = role;
    }

    const [usersData, totalCount] = await Promise.all([
      this._userRepo.findAll(query, { skip, limit }),
      this._userRepo.countOfUsers(query),
    ]);

    const users: usersResposeDTO[] = usersData.map(user => toUsersResponseData(user));
    return {
      users,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  };
  getStats = async (): Promise<userStatsResponseDTO> => {
    const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
      this._userRepo.countOfUsers(),
      this._userRepo.countOfUsers({ isActive: true, isBlocked: false }),
      this._userRepo.countOfUsers({ isBlocked: true, isActive: true, }),
    ]);

    const userStats: userStatsResponseDTO = { totalUsers, activeUsers, blockedUsers };
    return userStats;
  };
//-------------------block /unblock user
  toggleBlock = async (id: string): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);   
    if(!user.isBlocked ){
        if(user.role===UserRole.TRAINER){
          const trainer=await this._trainerRepo.findByUserId(user.id); 
          const skip=0;
          const limit=0;           
          const  sessions = await this._bookingSessionRepo.findBookedSessionsPopulatedUser({ trainerId:trainer.id, status:BOOKING_SESSION_STATUS.SCHEDULED },{skip,limit}) ;
          if(sessions.length>0) throw new AppError("Cannot block trainer,who's session is booked by user."); 
        }   
        else if(user.role===UserRole.USER){
            const sessions = await this._bookingSessionRepo.find({ userId:user.id, status:BOOKING_SESSION_STATUS.SCHEDULED }) ;
            if(sessions.length>0) throw new AppError("Cannot block user with scheduled sessions."); 
        } 
    }
    const isBlocked = !user.isBlocked;        
    const data = await this._userRepo.blockUser(user._id,isBlocked);
    const userData = toUsersResponseData(data);
    if(!data){
      throw new AppError(`Failed to ${user.isBlocked?'Restore':'Block'} user. Please try again.`);
    }
      // send email to user
    sendNotificationEmail({
      to:user.email,
      title:`Your account has been ${userData.isBlocked?'Blocked':'Restored'} `,
      description:` ${userData.isBlocked?              
        'Your account has been suspended. You will not be able to access the platform.Contact support if you think this is a mistake.':
        'Your account has been restored. You can now access the platform again.'} `,
      details:{
        userName:user.name,
        Email:user.email,
        JoiningDate:formatDateTo(userData.createdAt)
      },
      closingLine:` - ${AppName} Team`
    })
    // send pushNotification
    sendPushNotification(user.fcmToken,{
      title:" Account deleted",
      body:"Your account has been deleted by our admin. Contact support if you think this is a mistake"
    })
            
    return userData;
  }
        
    
  
//--------------delete user------------
  deleteUser = async (id: string): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    if(user.role===UserRole.USER){
      const [sessions,wallet]=await Promise.all([
          this._bookingSessionRepo.find({ userId:user.id, status:BOOKING_SESSION_STATUS.SCHEDULED }) ,
          this._walletRepo.findByUserId(user._id),
      ]);
      if(sessions.length>0){ 
          throw new AppError("Cannot delete user with scheduled sessions.");         
        } else if(wallet &&wallet.balance>0){
        throw new AppError("Cannot delete user with remaining wallet balance. Refund first..");         
        }
   }
   else if(user.role===UserRole.TRAINER){       
        const trainer=await this._trainerRepo.findByUserId(user.id);          
        const [sessions,wallet]=await Promise.all([         
        this._bookingSessionRepo.findBookedSessionsPopulatedUser({ trainerId:trainer.id, status:BOOKING_SESSION_STATUS.SCHEDULED }) ,
        this._walletRepo.findByUserId(user._id)]);
        if(sessions.length>0){ 
          throw new AppError("Cannot delete trainer with scheduled sessions.");         
        } else if(wallet && wallet.balance>0){
          throw new AppError("Cannot delete trainer with remaining wallet balance. Refund first..");         
        }
   }
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
      try {
        if (user.role === UserRole.TRAINER) {
          const trainer = await this._trainerRepo.findByUserId(user.id);
          await Promise.all([
            this._sportsSessionRepo.updateMany({trainerId:trainer.id},{isDeleted:true,isActive:false}),
            this._fitnessSessionRepo.updateMany({trainerId:trainer.id},{isDeleted:true,isActive:false}),
            this._trainerRepo.softDelete(trainer.id)
          ])
        }
        const data = await this._userRepo.softDeleteUser(user._id);
        if (!data) {
            throw new AppError(`Failed to delete ${user.role}. Please try again.`);
        }
        await dbSession.commitTransaction();
        const userData = toUsersResponseData(data);
     
       // send email to user
       sendNotificationEmail({
        to:user.email,
        title:"Your account has been deleted",
        description:`Your account on ${AppName} has been permanently deleted by our admin team.If you believe this was a mistake, please contact support at ${AppEmail}`,
        details:{
          userName:user.name,
          Email:user.email,
          JoiningDate:formatDateTo(userData.createdAt)
        },
         closingLine:` - ${AppName} Team`
       })
       // send pushNotification
       sendPushNotification(user.fcmToken,{
         title:" Account deleted",
         body:"Your account has been deleted by our admin. Contact support if you think this is a mistake"
       })
       return userData;
      } catch (error) {
        await dbSession.abortTransaction();
        throw error;
      } finally {
          dbSession.endSession();
      }

    }

    
  
  updateRole = async (id: string, role: UserRole): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const data = await this._userRepo.updateRole(user._id, role);
    const userData = toUsersResponseData(data);
    return userData;
  };
}
