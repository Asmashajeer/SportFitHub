import { IProfileService } from '@/interfaces/services/IProfile.service';
import type { Request, Response, NextFunction } from 'express';


export class ProfileController {
  private _profileService:IProfileService;
  constructor(profileService:IProfileService){
    this._profileService=profileService;
  }

  createProfile=async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    try {
      const userId = (req as any).user.id;
      console.log(userId);
      const profile = await this._profileService.createProfile({userId,...req.body});
      res.status(201).json({
        status: 'success',
        message: 'Profile created successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };
 getAllProfile =async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
      const userId = (req as any).user.id as any;
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
      const userId = (req as any).user.id as any;
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
          const userId = (req as any).user.id as any;
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
