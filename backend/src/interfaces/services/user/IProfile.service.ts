import { CreateUserProfileDTO } from "@/dtos/request/user/profile.request.dto";

import { ProfileResponseDataDTO } from "@/dtos/response/user/profile.response.dto";
import { IProfile } from "@/models/profile.model";

export interface IProfileService{
    addProfile( data: CreateUserProfileDTO): Promise<ProfileResponseDataDTO>;
    getProfile(profileId: string): Promise <ProfileResponseDataDTO | null>;
    getPrimaryProfile(userId: string,isPrimary?:boolean): Promise <ProfileResponseDataDTO | null>;
    getProfiles(userId:string):Promise< ProfileResponseDataDTO[]>
    updateProfile(userId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDataDTO>
}