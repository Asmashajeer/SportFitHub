
import { Types } from 'mongoose';
import { IProfile } from '@/models/profile.model';
import AppError from '@/utils/AppError';
import {  ProfileResponseDataDTO  } from '@/dtos/response/user/profile.response.dto';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IProfileRepository } from '@/interfaces/repositories/IProfile.repository';
import { CreateUserProfileDTO } from '@/dtos/request/user/profile.request.dto';
import { toProfileResponseData } from '@/mappers/profile.mapper';


export class ProfileService {
  private _profileRepo: IProfileRepository;
  private _userRepo:IUserRepository;
  constructor(profileRepository: IProfileRepository,userRepository:IUserRepository) {
    this._profileRepo = profileRepository;
    this._userRepo=userRepository;
  }

  //-------------Create a profile
  async addProfile( data: CreateUserProfileDTO): Promise<ProfileResponseDataDTO> {
    let {userId:inputUserId}=data;
    const profileCount = await this._profileRepo.count({userId:inputUserId});   
    
    const isPrimary = profileCount === 0;
    const existing = await this._profileRepo.findOne({fullName:data.fullName,userId:inputUserId});
    if (existing) throw new AppError('Profile with this name already exists for this user.', 400);

    //the Location Object (GeoJSON format)
    let location=null;
    if (data.longitude !== undefined && data.latitude !== undefined) {
      location = {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      };
    }

    // Required Fields
    const profile= {
      userId: new Types.ObjectId(inputUserId),
      fullName: data.fullName,
      DOB: data.DOB,
      gender: data.gender,
      phone:data.phone,
      relationship: data.relationship,
      address: {
          street: data.street || '',
          city: data.city || '',
          zip: data.zip || '',
        },
      location,
      profilePic: data.profilePic,
      isPrimary
    };

    const result=await this._profileRepo.create(profile);
    if (!result) throw new AppError('Failed to create profile', 500);
   
    const profileData:ProfileResponseDataDTO=toProfileResponseData(result);
    return profileData
             
   }
  

  // ----------------to get a profile by profileId
  async getProfile(profileId: string): Promise <ProfileResponseDataDTO | null>{
    const result=await this._profileRepo.findById(profileId);
    const profileData:ProfileResponseDataDTO=toProfileResponseData(result);
    return profileData    
          
  }

  //------------- to get All profile by userId
  async getProfiles(userId:string):Promise< ProfileResponseDataDTO[]>{  
        const profiles= await this._profileRepo.AllProfiles(userId); 
        const allProfiles:ProfileResponseDataDTO[] = profiles.map(profile => toProfileResponseData(profile));
        return  allProfiles; 
  }

  //---------------- Update Profile
  async updateProfile(profileId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDataDTO> {
    const updated = await this._profileRepo.update(profileId, updateData);
    if (!updated) throw new Error('Profile not found.');
    const profileData:ProfileResponseDataDTO=toProfileResponseData(updated);
    return profileData ;
    
   }
}
