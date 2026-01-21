import { IUserService } from "@/interfaces/services/IUser.service";
import { STATUS_CODE } from "@/utils/constants/messages";
import { Request,Response,NextFunction } from "express";


export class AdminDashboardController{
    private _userService:IUserService;
    constructor(userService:IUserService){
        this._userService=userService;
    }
   

    
}