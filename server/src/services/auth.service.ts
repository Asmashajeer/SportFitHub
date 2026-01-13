import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/repositories/IUser.repository';
// import { ProfileRepository } from '@/repositories/profile.repository.js';
import { UserRole } from '../models/user.model';
import AppError from '../utils/AppError';
import authConfig from '../config/auth.config';
import { IProfileRepository } from '../interfaces/repositories/IProfile.repository';
import {  AuthMeResponseDTO, GoolgleLoginDTO, LoginDTO,  RegisterDTO, RegisterResponseDTO, UpdateRoleDTO,  UserResponseDTO, VerifyEmailDTO, VerifyOtpDTO,ResetPasswordDTO, BaseResponseDTO } from '@/dtos/auth.dto.js';
import { generateOTP } from '../utils/generateOTP';
import { sendEmailOTP } from '../utils/sendMailOTP';
import { IOtpRepository } from '../interfaces/repositories/IOtp.repository';
import { OtpType } from '../models/otp.model';
import { IAuthService } from '../interfaces/services/IAuth.service';
import { OAuth2Client } from 'google-auth-library';
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

 register =async (userData: RegisterDTO): Promise<RegisterResponseDTO> =>{
    try{  

      const existingUser = await this._userRepo.findByEmail(userData.email);
      if (existingUser) {
        const message = 'user already exist';
        throw new AppError(message,409);     
      }
      const hashedPassword = await bcrypt.hash(userData.password!, 10);
      const newUser = await this._userRepo.create({ ...userData, password: hashedPassword });
      console.log(" registration starts----");
      const OTP= generateOTP();     
      console.log(OTP);
      const hashedOTP= await bcrypt.hash(OTP,10);
      // 3. Save the HASHED version
      await this._otpRepo.createOtp(newUser._id.toString(),hashedOTP,OtpType.VERIFICATION);
      const isEmailSent=sendEmailOTP(userData.email,OTP);        
      console.log('Registration successful. Please verify your email.');
      return { success: true,
            message: 'Registration successful. Please verify your email.',
            statusCode: 201,
            data:{
              id: newUser._id.toString(),
              email: newUser.email,
              emailSent: !!isEmailSent, 
              createdAt: newUser.createdAt.toISOString() 
            }
      }
    }
    catch(error){
      throw error;
    }
  }

  verifyEmail=async (data:VerifyEmailDTO):Promise<UserResponseDTO>=>{
    try {
        const user=await this._userRepo.findByEmail(data.email);
      if(!user) throw new  AppError ("User Not found",404);
      const userId = user._id.toString();
      const otp = data.otp;
      const otpContext = OtpType.VERIFICATION;     

      const result= await this.verifyOTPInternal({userId,otp,otpContext});
      if (!result.valid) {
        throw new AppError(result.message ,400);
       }

      const verifiedUser =await this._userRepo.updateVerificationStatus(user._id.toString(),true);

     

      let profileCount=0;
        if(user.role==='user'){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role==='trainer'){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
      const hasProfile = profileCount!==0
      const accessToken = this.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
    
      return {
        success: true,
        message: "Email verified successfully. You can now log in.",
        statusCode: 200,
        data: {
            userId: user._id.toString(),
            email:user.email,
            role: user.role,
            accessToken,
            refreshToken,
            hasProfile,
          }
      };
    } catch (error) {
      throw  error;
    }
    
  }

  resendOtp=async(email:string,otpContext:OtpType):Promise<RegisterResponseDTO>=>{
      const user = await this._userRepo.findByEmail(email);
      if (user) {
          const OTP= generateOTP();     
          console.log(OTP);
          const hashedOTP= await bcrypt.hash(OTP,10);
          // 3. Save the HASHED version
          await this._otpRepo.createOtp(user._id.toString(),hashedOTP,otpContext);
          const isEmailSent=sendEmailOTP(email,OTP);        
          console.log('OTP resent successfully Please verify your email.');
          return { success: true,
            message: 'OTP sent Please check your email.',
            statusCode: 201,
            data:{
              id: user._id.toString(),
              email: user.email,
              emailSent: !!isEmailSent, 
              createdAt: user.createdAt.toISOString() 
            }
          }
      }  
  }

  resetPassword = async ( data:ResetPasswordDTO):Promise<BaseResponseDTO>=>{

    const user=await this._userRepo.findByEmail(data.email);
    if(!user) throw new  AppError ("User Not found",404);
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
      message:"Updated password Successfully",
      statusCode:201
    }

  }
  login=async (data:LoginDTO ): Promise<UserResponseDTO>=> {
    try {
       const user = await this._userRepo.findByEmail(data.email);
        if (!user || !user.password) throw new AppError('invalid Credentials', 409);
        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) throw new AppError('invalid Credentials', 401);

        // CHECK FOR PROFILE existence
        let profileCount=0;
        if(user.role==='user'){
          profileCount = await this._profileRepo.count({userId:user._id.toString()});
        }
        if(user.role==='trainer'){        
          // profileCount = await this._trainerProfileRepo.count({userId:user._id.toString()});
        }
        const hasProfile = profileCount!==0
        const accessToken = this.generateAccessToken(user._id.toString(), user.role);
        const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

        return {
          success: true,
          message: "login successful.",
          statusCode: 200,
          data: {
              userId: user._id.toString(),
              email:user.email,
              role: user.role,
              accessToken,
              refreshToken,
              hasProfile: false
            },
        };
    } catch (error) {
      throw  error;
    }
    
  }

googleLogin=async (token:string):Promise<UserResponseDTO>=>{

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
    const profileCount = await this._profileRepo.count({userId:user._id.toString()});
    const hasProfile = profileCount!==0
    const accessToken = this.generateAccessToken(user._id.toString(), user.role);
    const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
    return {
      success: true,
      message: "logged successfully. ",
      statusCode: 200,
      data: {
          userId: user._id.toString(),
          email:user.email,
          role: user.role, 
          hasProfile,         
          accessToken,
          refreshToken,              
        },
    };
  }
  

   updateRole=async (data:UpdateRoleDTO):Promise<UserResponseDTO> =>{ 
    try {
        const userData= await this._userRepo.findByEmail(data.email);
        if (!userData) throw new AppError('user not found', 401);
        const userId=userData._id.toString();
        const user = await this._userRepo.findOneAndUpdate(userId, { role: data.chosenRole });

      if (!user) throw new AppError('User not found');
      const profileCount = await this._profileRepo.count({userId:userId});
      const hasProfile = profileCount!==0
      const accessToken = this.generateAccessToken(user._id.toString(), user.role);
      const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

    return {
        success: true,
        message: "role updated successfully. ",
        statusCode: 200,
        data: {
            userId: user._id.toString(),
            email:user.email,
            role: user.role,
            hasProfile,
            accessToken,
            refreshToken,              
          },
      };
    } catch (error) {
      throw error;
    }   
    
  }

  authMe= async(userId:string):Promise<AuthMeResponseDTO>=>{
    try {
       
    
      const user = await this._userRepo.findById(userId);
      const profile = await this._profileRepo.findOne({ userId: user._id });
      return {
        success: true,
        message: "in session ",
        statusCode: 200,
        data: {
            userId: user._id.toString(),
            email:user.email,
            role: user.role, 
            hasProfile:!!profile,      
                        
          },
      };
    } catch (error) {
      throw new AppError(" invalid Session",401);
    }
    

  }
  verifyOTPInternal= async(data:VerifyOtpDTO)=>{
      const savedOtp=await this._otpRepo.findOtp(data.userId,data.otpContext);
      if(!savedOtp) return { valid: false, message: " OTP expired or Not found,please request new one"};

      console.log("saved otp" ,savedOtp);
      const isMatch=await bcrypt.compare(data.otp,savedOtp.code);
      if(!isMatch) return { valid: false, message:"Invalid verification code"};

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

  refreshAccessToken=async (refreshToken: string): Promise<{ accessToken: string }>=> {
    const decoded = jwt.verify(refreshToken, authConfig.refresh_secret) as {
      id: string;
      role: string;
    };
    const accessToken = this.generateAccessToken(decoded.id, decoded.role) as string;
    return { accessToken };
  }



}
                                                                                