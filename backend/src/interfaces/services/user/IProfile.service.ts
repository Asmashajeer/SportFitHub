import { CreateProfileDTO } from "@/dtos/request/user/profile.request.dto";
import { AllProfilesResponseDTO } from "@/dtos/response/user/profile.response.dto";
import { ProfileResponseDataDTO } from "@/dtos/response/user/profile.response.dto";
import { IProfile } from "@/models/profile.model";

export interface IProfileService{
    addProfile( data: CreateProfileDTO): Promise<ProfileResponseDataDTO>;
    getProfile(userId: string): Promise <ProfileResponseDataDTO | null>;
    getProfiles(userId:string):Promise< ProfileResponseDataDTO[]>
    updateProfile(userId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDataDTO>
}