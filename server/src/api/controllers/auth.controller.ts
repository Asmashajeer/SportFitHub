import type { Request, Response, NextFunction } from 'express';
import { authService } from '../../container';
import authConfig from '../../config/auth.config';
import type { IUser, UserRole } from '../../models/user.model';
import AppError from '../../utils/AppError';
// import { UserRepository } from '../../repositories/user.repository';
// import { ProfileRepository } from '../../repositories/profile.repository';
// import { RegisterSchema, VerifyOtpSchema } from '../../dtos/auth.dto';
import { IAuthService } from '../../interfaces/services/IAuth.service';
import { OtpType } from '../../models/otp.model';
import { BaseResponseDTO } from '../../dtos/profile.dto';
import { OAuth2Client } from 'google-auth-library';



export default class AuthController {
  private _authService: IAuthService;
  constructor(authService: IAuthService) {
    this._authService = authService;
  }
  //register user
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const result = await this._authService.register(req.body);
      console.log( result);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const result = await this._authService.verifyEmail(req.body);
      const { accessToken, refreshToken, ...user } = result.data;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.ACCESS_TOKEN_MAXAGE),
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.REFRESH_TOKEN_MAXAGE),
      });

      res.status(result.statusCode).json(user);
    } catch (error) {
      next(error);
    }
  };

  resendOtp=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {email,otpContext}=req.body.data;
        const  result= await  this._authService.resendOtp(email,otpContext);       
        res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }



  forgotPassword=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const {email}=req.body;
       
        const  otpContext=OtpType.PASSWORD_RESET;
        const  result= await  this._authService.resendOtp(email,otpContext);
        
        res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }

  resetPassword=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        console.log(req.body);
        const { email, otp, newPassword } = req.body
       
        const result=await this._authService.resetPassword({email,otp,newPassword});
        res.status(result.statusCode).json(result);
    } catch (error) {
       next(error);
    }

  }
  // login user
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, role } = req.body;
      const result = await this._authService.login({ email, password });
      const { accessToken, refreshToken, ...user } = result.data;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.ACCESS_TOKEN_MAXAGE),
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.REFRESH_TOKEN_MAXAGE),
      });
      res.status(200).json({ success: true, user,message:"login successful" });
    } catch (error) {
      next(error);
    }
  };

//-googleLogin
 googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  const { token } = req.body; // Token from frontend  
    try{
      const { data } = await this._authService.googleLogin(token);
            const { accessToken, refreshToken, ...user } = data;
            res.cookie('accessToken', accessToken, {
              httpOnly: true,
              maxAge: 15 * 60 * 1000,
            });
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).json(user);  

        res.json({
          id: user.userId,
          email: user.email,
          hasProfile: user.hasProfile,     
        });      
      }
      catch (error) {
        console.error('Google Auth Error:', error);
        next(error);
      }
};


  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      if (!['trainer', 'user'].includes(role)) {
        throw new AppError('Invalid role selected', 400);
      }
      const chosenRole = role as UserRole.TRAINER | UserRole.STANDERED_USER;
      const { data } = await this._authService.updateRole({ email: email, chosenRole });
       const { accessToken, refreshToken, ...user } = data;
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ success: true, user,message:"role updated" });
    } catch (error) {
      next(error);
    }
  };


  authMe=async(req:Request,res:Response,next:NextFunction)=>{
   try {
   
    const  { id } = req.user as any; 
    const user=await this._authService.authMe(id);
    res.status(200).json(user);
   } catch (error) {
      next(error);
   } 
  } 
  //refresh AccessToken
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new AppError('No refreshToken provided', 401);
      const accessToken = await this._authService.refreshAccessToken(refreshToken);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      res.status(200).json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  };

  //Logout user
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  };
}
