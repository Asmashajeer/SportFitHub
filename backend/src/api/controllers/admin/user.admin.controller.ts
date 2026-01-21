import { IUserService } from "../../../interfaces/services/IUser.service";
import { MESSAGES, STATUS_CODE } from "../../../utils/constants/messages";
import { Request,Response,NextFunction } from "express";

export class UserAdminController{
    private _userService: IUserService;
    constructor(userService:IUserService){
        this._userService=userService;
    }

   
    // --fetch all users
    getAllusers=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const page=parseInt(req.query.page as string)|| 1;
            const limit=parseInt(req.query.limit as string) || 5;
            const users=await this._userService.getUsers(page,limit);
            res.status(STATUS_CODE.OK).json(users)
        }
        catch(error){
            next(error);
        }           
    }

    getStats=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
           
            const userStats=await this._userService.getStats();
            res.status(STATUS_CODE.OK).json({ userStats});
        }
        catch(error){
            next(error);
        }           
    }
    // block or unblock user
    toggleBlock=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
       try{
        const id=req.body.id;        
        const user=await this._userService.toggleBlock(id);
        res.status(STATUS_CODE.OK).json({
            success: true,
            message: MESSAGES.success.USER_BLOCKED,
            data: user
        });

       }catch(error){
            next(error)
       }
        
    }

    //  delete a user
    deleteUser=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
       try{
        const id=req.params.id;        
        const user=await this._userService.deleteUser(id);
        res.status(STATUS_CODE.OK).json({
            success: true,
            message: MESSAGES.success.USER_DELETED,
            data: user
        });
       }catch(error){
            next(error)
       }
        
    }
    updateUserRole=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
       try{
        const {id,selectedRole}=req.body;    
        console.log(id,selectedRole)    
        const user=await this._userService.updateRole(id,selectedRole);
        res.status(STATUS_CODE.OK).json({
            success: true,
            message: MESSAGES.success.ROLE_UPDATED,
            data: user
        });

       }catch(error){
            next(error)
       }
        
    }
}