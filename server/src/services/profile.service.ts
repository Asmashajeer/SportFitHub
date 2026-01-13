
import { Types } from 'mongoose';
import type { IProfile } from '../models/profile.model';
import AppError from '../utils/AppError';
import { AllProfileResponseDTO, CreateProfileDTO,  ProfileResponseDTO } from '@/dtos/profile.dto';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IProfileRepository } from '@/interfaces/repositories/IProfile.repository';




export class ProfileService {
  private _profileRepo: IProfileRepository;
  private _userRepo:IUserRepository;
  constructor(profileRepository: IProfileRepository,userRepository:IUserRepository) {
    this._profileRepo = profileRepository;
    this._userRepo=userRepository;
  }

  //-------------Create a profile
  async createProfile( data: CreateProfileDTO): Promise<ProfileResponseDTO> {
    let {userId:inputUserId}=data;
    const profileCount = await this._profileRepo.count({userId:inputUserId});   
    
    const isPrimary = profileCount === 0;
    const existing = await this._profileRepo.findOne({name:data.name,userId:inputUserId});
    if (existing) throw new AppError('Profile with this name already exists for this user.', 400);

    //the Location Object (GeoJSON format)
    let location=null;
    if (data.longitude !== undefined && data.latitude !== undefined) {
      location = {
        type: 'Point' as const,
        coordinates: [data.longitude, data.latitude],
      };
    }

    // Required Fields
    const profileData= {
      userId: new Types.ObjectId(inputUserId),
      name: data.name,
      DOB: data.DOB,
      gender: data.gender,
      relationship: data.relationship,
      address: {
          street: data.street || '',
          city: data.city || '',
          zip: data.zip || '',
        },
      location,
      profilePic: data.profilePic,
    };
    
    const result = await this._profileRepo.create(profileData);
    if (!result) throw new AppError('Failed to create profile', 500);
   
    // set verified true
    await this._userRepo.updateVerificationStatus(inputUserId,true);
     
    const profileObj = result.toObject();
    
    const { userId, _id,  ...rest } = profileObj;
     
    return {
      success: true,
      message: " Profile added succefully",
      statusCode:200,
      data: {
        userId:userId.tostring,...rest}
      }         
    }
  

  // ----------------to get a profile by profileId
  async getProfile(profileId: string): Promise <ProfileResponseDTO | null>{
    const result=await this._profileRepo.findById(profileId);
      const profileObj = result.toObject();
    // 2. Extract the IDs and rename DOB to match your Zod DTO (dob)
    const { userId, ...rest } = profileObj;
     
    return {
      success: true,
      message: " Profile added succefully",
      statusCode:200,
      data: {
        userId:userId.tostring,...rest}
      }         
    }

  //------------- to get All profile by userId
  async getProfiles(userId:string):Promise< AllProfileResponseDTO>{
  
        const profiles= await this._profileRepo.AllProfiles(userId); 

        const formattedData = profiles.map(profile => ({
          id: profile._id.toString(),
          userId: profile.userId.toString(),
          name: profile.name,
          isPrimary:profile.isPrimary,
        }));
     
        return {
          success: true,
          message: "Profiles retrieved successfully",
          statusCode: 200,
          data: formattedData
        };

          
  }

  //---------------- Update Profile
  async updateProfile(profileId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDTO> {
    const updated = await this._profileRepo.update(profileId, updateData);
    if (!updated) throw new Error('Profile not found.');
    const profileObj = updated.toObject();
    const{userId,...data}=profileObj;
      const newData={
          userId:userId.toString(),
          ...data
      }
    return {
      success: true,
      message: " Profile updated succefully",
      statusCode:200,
      data:newData
    } 
  }
}
