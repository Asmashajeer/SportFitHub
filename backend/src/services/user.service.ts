import { UserRole } from "@/models/user.model";
import { usersResposeDTO, userStatsResponseDTO } from "../dtos/response/admin/user.dto";
import { IUserRepository } from '../interfaces/repositories/IUser.repository';
import { IUserService } from "../interfaces/services/IUser.service";
import { toUsersResponseData } from "../mappers/user.mapper";
import AppError from "../utils/AppError";
import { MESSAGES, STATUS_CODE } from "../utils/constants/messages"




export class UserService implements IUserService{
    private _userRepo:IUserRepository;
    constructor(userRepo:IUserRepository){
        this._userRepo=userRepo;
    }
     getUsers= async(page:number=1,limit:number=5):Promise<usersResposeDTO[]>=>{        
       try{
        const usersData=await this._userRepo.findAll(page,limit)             
       
        const users:usersResposeDTO[] =usersData.map((user)=>toUsersResponseData(user));       
        return users
        
        }
        catch(error){
            throw error;
        }
    }
    getStats= async():Promise<userStatsResponseDTO>=>{        
       try{
        const [totalUsers,activeUsers,blockedUsers]=await Promise.all([
               
                this._userRepo.countOfUsers(),
                 this._userRepo.countOfUsers({isActive:true,isBlocked:false}),
                 this._userRepo.countOfUsers({isBlocked:true})
                ]);
       
          
           const userStats:userStatsResponseDTO={totalUsers,activeUsers,blockedUsers};
            return userStats;
        
        }
        catch(error){
            throw error;
        }
    }



    toggleBlock=async(id:string):Promise<usersResposeDTO>=>{    
            const user=await this._userRepo.findById(id);
            if(!user) throw new AppError(MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
            const isBlocked=!user.isBlocked
            const data=await this._userRepo.blockUser(user._id,isBlocked);
            const userData=toUsersResponseData(data); 
            return userData; 
    }
    deleteUser=async(id:string):Promise<usersResposeDTO>=>{
        const user=await this._userRepo.findById(id);
        if(!user) throw new AppError(MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
        const data=await this._userRepo.softDeleteUser(user._id);
        const userData=toUsersResponseData(data); 
        return userData; 
    }
    updateRole=async(id:string,role:UserRole):Promise<usersResposeDTO>=>{    
            const user=await this._userRepo.findById(id);
            if(!user) throw new AppError(MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
           
            const data=await this._userRepo.updateRole(user._id,role);
            const userData=toUsersResponseData(data); 
            return userData; 
    }
}