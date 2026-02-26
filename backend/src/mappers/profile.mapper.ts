import {  ProfileResponseDataDTO } from "@/dtos/response/user/profile.response.dto";
import { IProfile } from "../models/profile.model";


export const toProfileResponseData=(profile:Partial<IProfile>):ProfileResponseDataDTO=>{
    return{
            id:profile._id.toString(),
            userId:profile.userId.toString(),
            fullName:profile.fullName,
            DOB: profile.DOB,
            gender:profile.gender,
            phone:profile.phone,
            relationship:profile.relationship,
            address:profile.address,        
            location:profile.location,      
            profilePic: profile.profilePic,
            isPrimary:profile.isPrimary,
            createdAt:profile.createdAt.toString(),
            updatedAt:profile.updatedAt.toString()
            
        }
}