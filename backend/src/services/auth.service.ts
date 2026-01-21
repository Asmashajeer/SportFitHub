import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/repositories/IUser.repository';
// import { ProfileRepository } from '@/repositories/profile.repository.js';
import { UserRole } from '../models/user.model';
import AppError from '../utils/AppError';
import authConfig from '../config/auth.config';
import { IProfileRepository } from '../interfaces/repositories/IProfile.repository';
import { MESSAGES, STATUS_CODE } from '../utils/constants/messages';
import { generateOTP } from '../utils/generateOTP';
import { sendEmailOTP } from '../utils/sendMailOTP';
import { IOtpRepository } from '../interfaces/repositories/IOtp.repository';
import { OtpType } from '../models/otp.model';
import { IAuthService } from '../interfaces/services/IAuth.service';
import { OAuth2Client } from 'google-auth-library';
import { toRegisterData, toUserData } from '../mappers/auth.mapper'
import { LoginDTO, RegisterRequestDTO ,UpdateRoleDTO , VerifyEmailDTO, VerifyOtpDTO,ResetPasswordDTO,GoolgleLoginDTO} from '@/dtos/request/auth.request.dto';
import {   RegisterResponseDTO, UserResponseDTO, BaseResponseDTO, RegisterDataDTO, UserDataDTO, RefreshTokensResponse, AuthMeResponseDto, LoginResponseDTO } from '@/dtos/response/auth.response.dto.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService implements IAuthService {
  private _userRepo: IUserRepository;
  private _otpRepo:IOtpRepository;
  private _profileRepo: IProfileRepository;

  constructor(userRepo: IUserRepository,otpRepo:IOtpRepository,profileRepo:IProfileRepository) {
    this._userRepo = userRepo;
    this._otpRepo=otpRepo;
    this._profileRepo=profileRepo;    
  }

 register =async (userData: RegisterRequestDTO): Promise<RegisterResponseDTO> =>{
    try{  

      const existingUser = await this._userRepo.findByEmail(userData.email);
      if (existingUser) {        
        throw new AppError(MESSAGES.error.USER_EXISTS,STATUS_CODE.BAD_REQUEST);     
      }
      const hashedPassword = await bcrypt.hash(userData.password!, 10);
      const newUser = await this._userRepo.create({ ...userData, password: hashedPassword });
      const RegisterData:RegisterDataDTO=toRegisterData(newUser);
   
      const OTP= generateOTP();     
      console.log(OTP);
      const hashedOTP= await bcrypt.hash(OTP,10);
      // 3. Save the HASHED version
      await this._otpRepo.createOtp(newUser._id.toString(),hashedOTP,OtpType.VERIFICATION);
      const isEmailSent=sendEmailOTP(userData.email,OTP);        
      console.log('Registration successful. Please verify your email.');
      return { success: true,
            message: MESSAGES.success.REGISTER_SUCCESS,
            statusCode: STATUS_CODE.CREATED,
            data:RegisterData,              
            emailSent: !!isEmailSent,               
            }
    }
    
    catch(error){
      throw error;
    }
  }  

  verifyEmail = async (data:VerifyEmailDTO):Promise<UserResponseDTO>=>{
    try {
        const user=await this._userRepo.findByEmail(data.email);
      if(!user) throw new  AppError (MESSAGES.error.USER_NOT_FOUND,404);
      const userId = user._id.toString();
      const otp = data.otp;
      const otpContext = OtpType.VERIFICATION;     
      console.log(otp,-"otp");
      const result= await this.verifyOTPInternal({userId,otp,otpContext});
      if (!result.valid) {
        throw new AppError(result.message ,400);
       }

      const verifiedUser =await this._userRepo.updateVerificationStatus(user._id.toString(),true);
       const userData:UserDataDTO=toUserData(verifiedUser);
     

      let profileCount=0;
        if(user.role===UserRole.USER){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role===UserRole.TRAINER){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
        const hasProfile = profileCount!==0
      const accessToken = this.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
    
      return {
        success: true,
        message:MESSAGES.success.EMAIL_VERIFIED,
        statusCode: STATUS_CODE.OK,
        user: userData,            
        accessToken,
        refreshToken,      
          
      };
    } catch (error) {
      throw  error;
    }
    
  }

  resendOtp=async(email:string,otpContext:OtpType):Promise<RegisterResponseDTO>=>{
      const user = await this._userRepo.findByEmail(email);
      if (user) {
       
          const isEmailSent=this.generateOtpAndSendMail(user._id.toString(),email,otpContext);
          const userData:RegisterDataDTO=toRegisterData(user);
          return { success: true,
            message: MESSAGES.success.OTP_SENT,
            statusCode: STATUS_CODE.CREATED,
            data:userData,          
            emailSent: !!isEmailSent,            
            
          }
      }  
  }

  resetPassword = async ( data:ResetPasswordDTO):Promise<BaseResponseDTO>=>{

    const user=await this._userRepo.findByEmail(data.email);
    if(!user) throw new  AppError (MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
    const userId = user._id.toString();
    const otp = data.otp;
    const otpContext=OtpType.PASSWORD_RESET;
    const result=await this.verifyOTPInternal({userId,otp,otpContext})
    console.log("otp verified");
    if (!result.valid) {
        throw new AppError(result.message ,400);
       }
     const hashedPassword=await bcrypt.hash(data.newPassword,10);
    await this._userRepo.updatePassword(userId,hashedPassword);
    console.log("password updated");
    return{
      success:true,
      message:MESSAGES.success.PASSWORD_UPDATED,
      statusCode:STATUS_CODE.CREATED
    }

  }
  login=async (data:LoginDTO ): Promise<LoginResponseDTO>=> {
    try {
       const user = await this._userRepo.findByEmail(data.email);
        if (!user || !user.password) throw new AppError(MESSAGES.error.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        const isMatch = await bcrypt.compare(data.password, user.password);
        if(user.isBlocked) throw new AppError(MESSAGES.error.BLOCKED_USER,STATUS_CODE.FORBIDDEN);
        if (!isMatch) throw new AppError(MESSAGES.error.INVALID_CREDENTIALS,STATUS_CODE.UNAUTHORIZED);
        const userData:UserDataDTO=toUserData(user);
       if(!user.isVerified)
             this.generateOtpAndSendMail(user._id.toString(),user.email,OtpType.VERIFICATION);

        // CHECK FOR PROFILE existence
        let profileCount=0;
        if(user.role===UserRole.USER){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role===UserRole.TRAINER){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
        userData.hasProfile = profileCount!==0
        const accessToken = this.generateAccessToken(user._id.toString(), user.role);
        const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

        return {
          success: true,
          message: MESSAGES.success.LOGIN_SUCCESS,
          statusCode: STATUS_CODE.OK,
          user:userData,
          isVerified:user.isVerified,              
          accessToken,
          refreshToken,
          
        };
    } catch (error) {
      throw  error;
    }
    
  }

googleLogin=async (token:string):Promise<LoginResponseDTO>=>{
  try{
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, sub, name, picture } = ticket.getPayload();

        let user = await this._userRepo.findByEmail(email);
        if (!user) {
          user = await this._userRepo.create({
            googleId:sub,
            email: email,
            role: UserRole.PENDING,
            password: `google_${Date.now()}`,
            isVerified:true
          });
        
        }
        const userData:UserDataDTO=toUserData(user);
      let profileCount=0;
            if(user.role===UserRole.USER){
              profileCount = await this._profileRepo.count({userId:user._id.toString()});
            }
            if(user.role===UserRole.TRAINER){        
              // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
            }
            userData.hasProfile = profileCount!==0
        const accessToken = this.generateAccessToken(user._id.toString(), user.role);
        const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
        return {
          success: true,
          message: MESSAGES.success.LOGIN_SUCCESS,
          statusCode: STATUS_CODE.OK,
          user: userData,       
          isVerified:true,   
          accessToken,
          refreshToken,              
            
        };
  }catch(error){
    throw error;
  }
  }
  

   updateRole=async (data:UpdateRoleDTO):Promise<UserResponseDTO> =>{ 
    try {
        const Data= await this._userRepo.findByEmail(data.email);
        if (!Data){
          console.log("No user Data");
          throw new AppError(MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
        } 
        
        const userId=Data._id.toString();
        const user = await this._userRepo.findOneAndUpdate(userId, { role: data.role });

      if (!user) throw new AppError(MESSAGES.error.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
      const userData:UserDataDTO=toUserData(user);
      let profileCount=0;
        if(user.role===UserRole.USER){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role===UserRole.TRAINER){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
        const hasProfile = profileCount!==0
      const accessToken = this.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

    return {
        success: true,
        message: MESSAGES.success.ROLE_UPDATED,
        statusCode: STATUS_CODE.OK,
        user:userData,           
        
        accessToken,
        refreshToken,              
          
      };
    } catch (error) {
      throw error;
    }   
    
  }

  authMe= async(userId:string):Promise<AuthMeResponseDto>=>{
   try {      
    
      const user = await this._userRepo.findById(userId);
      let profileCount=0;
        if(user.role===UserRole.USER){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role===UserRole.TRAINER){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
        const hasProfile = profileCount!==0
      const userData:UserDataDTO=toUserData(user);
      userData.hasProfile=hasProfile;
      return {
        success: true,
        message: "in session ",
        statusCode: STATUS_CODE.OK,
        user: userData,
           
         
      };
    } catch (error) {
      throw new AppError(" invalid Session",401);
    }
    

  }
  verifyOTPInternal= async(data:VerifyOtpDTO)=>{
      const savedOtp=await this._otpRepo.findOtp(data.userId,data.otpContext);
      if(!savedOtp) return { valid: false, message: " OTP expired or Not found,please request new one"};

      console.log("saved otp" ,savedOtp.code);
      const isMatch=await bcrypt.compare(data.otp,savedOtp.code);
      console.log('isMatch',isMatch);
      if(!isMatch) return { valid: false, message:MESSAGES.error.OTP_INVALID};

      await this._otpRepo.deleteOtp(savedOtp.userId.toString(),data.otpContext);
      return { valid: true, userId: savedOtp.userId };
  }
  private  generateAccessToken(id: string, role: string): string {
    return jwt.sign({ id, role }, authConfig.secret!, {
      expiresIn: authConfig.secret_expires_in,
    } as SignOptions);
  }

 private generateRefreshToken(id: string, role: string): string {
    return jwt.sign({ id, role }, authConfig.refresh_secret!, {
      expiresIn: authConfig.refresh_secret_expires_in,
    } as SignOptions);
  }


  generateOtpAndSendMail= async(userId: string,email: string,otpContext:OtpType)=>{
    try{
      const OTP= generateOTP();     
      console.log(OTP);
      const hashedOTP= await bcrypt.hash(OTP,10);
      // 3. Save the HASHED version
      await this._otpRepo.createOtp(userId,hashedOTP,otpContext);
      const isEmailSent=sendEmailOTP(email,OTP);        
      console.log('verification code sent to your mail. Please verify your email.');
    }
    catch(error){
      throw new AppError(MESSAGES.error.SEND_VERIFICATION_CODE_FAILED,STATUS_CODE.INTERNAL_SERVER_ERROR )
    }

  }
  refreshAccessToken=async (refreshToken: string): Promise<RefreshTokensResponse>=> {
    try{    
      const decoded = jwt.verify(refreshToken, authConfig.refresh_secret) as {
        id: string;
        role: string;
      };

      const accessToken = this.generateAccessToken(decoded.id, decoded.role) as string;
      refreshToken = this.generateRefreshToken(decoded.id, decoded.role) as string;
      const tokens={ accessToken,  refreshToken};
      return { accessToken,  refreshToken  };
    }
    catch(error){
      throw new AppError(MESSAGES.error.REFRESH_TOKEN_INVALID,STATUS_CODE.UNAUTHORIZED);
    }
   }



}
                                                                                