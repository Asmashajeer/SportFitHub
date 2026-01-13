import { AllProfileResponseDTO, CreateProfileDTO,  ProfileResponseDTO } from "@/dtos/profile.dto";
import { IProfile } from "@/models/profile.model";

export interface IProfileService{
    createProfile( data: CreateProfileDTO): Promise<ProfileResponseDTO>;
    getProfile(userId: string): Promise <ProfileResponseDTO | null>;
    getProfiles(userId:string):Promise< AllProfileResponseDTO>
    updateProfile(userId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDTO>
}