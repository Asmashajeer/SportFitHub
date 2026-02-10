import { IProfileService } from '@/interfaces/services/user/IProfile.service';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { MESSAGES, STATUS_CODE } from '@/constants/messages';
import type { Request, Response, NextFunction } from 'express';
import { IUser } from '@/models/user.model';


export class ProfileController {
  private _profileService:IProfileService;
  constructor(profileService:IProfileService){
    this._profileService=profileService;
  }

  addProfile=async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    try {
      const user=req.user as IUser
      const userId=user.id;
      let profilePicUrl=req.body.profilePic
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file);
        profilePicUrl = uploadResult.secure_url;
      }
      console.log(userId);
      const profileData = await this._profileService.addProfile({userId,profilePic: profilePicUrl,...req.body});
      res.status(STATUS_CODE.CREATED).json({      
        message: MESSAGES.success.PROFILE_CREATED,
        data: profileData,
      });
    } catch (error) {
      next(error);
    }
  };
 getAllProfile =async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
       const user=req.user as IUser
      const userId=user.id;
      const profiles = await this._profileService.getProfiles(userId);
      res.status(200).json({
        status: 'success',
        data: profiles,
      });
    } catch (error) {
      next(error);
    }   

  }
 getMyProfile=async (req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try {
       const user=req.user as IUser
            const userId=user.id;
      const profile = await this._profileService.getProfile(userId);
      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
           const user=req.user as IUser
            const userId=user.id;
          const profileData= await this._profileService.updateProfile(userId,req.body)
          res.status(200).json({
            status: 'success',
            data: profileData,
          });
        } catch (error) {
          next(error);
        }
  }
}
