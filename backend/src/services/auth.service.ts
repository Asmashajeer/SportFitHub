import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/repositories/IUser.repository';
import { UserRole } from '@/constants/enums';
import AppError from '../utils/AppError';
import authConfig from '../config/auth.config';
import { IProfileRepository } from '../interfaces/repositories/IProfile.repository';
import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '../constants/messages';
import { generateOTP } from '../utils/generateOTP';
import { sendEmailOTP } from '@/utils/sendMailOTP';
import { IOtpRepository } from '../interfaces/repositories/IOtp.repository';
import { OtpType } from '@/constants/enums';
import { IAuthService } from '../interfaces/services/IAuth.service';
import { OAuth2Client } from 'google-auth-library';
import { toRegisterData, toUserData } from '../mappers/auth.mapper';
import {
  LoginDTO,
  RegisterRequestDTO,
  UpdateRoleDTO,
  VerifyEmailDTO,
  VerifyOtpDTO,
  ResetPasswordDTO,
} from '@/dtos/request/auth.request.dto';
import {
  RegisterResponseDTO,
  UserResponseDTO,
  BaseResponseDTO,
  UserDataDTO,
  RefreshTokensResponse,
  AuthMeResponseDto,
  LoginResponseDTO,
  RegisterDataDTO,
} from '@/dtos/response/auth.response.dto.js';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService implements IAuthService {
  private _userRepo: IUserRepository;
  private _otpRepo: IOtpRepository;
  private _profileRepo: IProfileRepository;
  private _trainerRepo: ITrainerRepository;

  constructor(
    userRepo: IUserRepository,
    otpRepo: IOtpRepository,
    profileRepo: IProfileRepository,
    trainerRepo: ITrainerRepository
  ) {
    this._userRepo = userRepo;
    this._otpRepo = otpRepo;
    this._profileRepo = profileRepo;
    this._trainerRepo = trainerRepo;
  }
  // register
  register = async (userData: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    const existingUser = await this._userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.AUTH.USER_EXISTS, STATUS_CODE.ERROR.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = await this._userRepo.create({ ...userData, password: hashedPassword });
    const RegisterData: RegisterDataDTO = toRegisterData(newUser);

    const otpContext = OtpType.VERIFICATION;
    const isEmailSent = this.generateOtpAndSendMail(
      newUser._id.toString(),
      newUser.email,
      otpContext
    );
    console.log('Registration successful. ');
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
      statusCode: STATUS_CODE.SUCCESS.CREATED,
      user: RegisterData,
      emailSent: !!isEmailSent,
    };
  };

  //Verify email with otp
  verifyEmail = async (data: VerifyEmailDTO): Promise<UserResponseDTO> => {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const userId = user._id.toString();
    const otp = data.otp;
    const otpContext = OtpType.VERIFICATION;
    console.log(otp, -'otp');
    const result = await this.verifyOTPInternal({ userId, otp, otpContext });
    if (!result.valid) {
      throw new AppError(result.message, STATUS_CODE.ERROR.BAD_REQUEST);
    }

    const verifiedUser = await this._userRepo.updateVerificationStatus(user._id.toString(), true);
    const userData: UserDataDTO = toUserData(verifiedUser);

    let profileCount = 0;
    if (user.role === UserRole.USER) {
      profileCount = await this._profileRepo.count({ userId: user._id.toString() });
    }
    if (user.role === UserRole.TRAINER) {
      profileCount = await this._trainerRepo.count({ userId: user._id.toString() });
    }

    const hasProfile = profileCount !== 0;
    userData.hasProfile = hasProfile;
    const accessToken = this.generateAccessToken(user._id.toString(),user.email, user.role,user.timezone);
    const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.EMAIL_VERIFIED,
      statusCode: STATUS_CODE.SUCCESS.OK,
      user: userData,
      accessToken,
      refreshToken,
    };
  };

  // resend otp
  resendOtp = async (email: string, otpContext: OtpType): Promise<RegisterResponseDTO> => {
    const user = await this._userRepo.findByEmail(email);
    if (user) {
      const isEmailSent = this.generateOtpAndSendMail(user._id.toString(), email, otpContext);
      const userData: RegisterDataDTO = toRegisterData(user);
      return {
        success: true,
        message: SUCCESS_MESSAGES.AUTH.OTP_SENT,
        statusCode: STATUS_CODE.SUCCESS.CREATED,
        user: userData,
        emailSent: !!isEmailSent,
      };
    }
  };

  // reset Password
  resetPassword = async (data: ResetPasswordDTO): Promise<BaseResponseDTO> => {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const userId = user._id.toString();
    const otp = data.otp;
    const otpContext = OtpType.PASSWORD_RESET;
    const result = await this.verifyOTPInternal({ userId, otp, otpContext });
    console.log('otp verified');
    if (!result.valid) {
      throw new AppError(result.message, 400);
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this._userRepo.updatePassword(userId, hashedPassword);
    console.log('password updated');
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_UPDATED,
      statusCode: STATUS_CODE.SUCCESS.CREATED,
    };
  };

  //------------------------Login
  login = async (data: LoginDTO): Promise<LoginResponseDTO> => {
    const user = await this._userRepo.findByEmail(data.email);
    if (!user || !user.password)
      throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch)
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODE.ERROR.UNAUTHORIZED);  
    if (user.isBlocked)
      throw new AppError(ERROR_MESSAGES.AUTH.BLOCKED_USER, STATUS_CODE.ERROR.FORBIDDEN);
    
     const userWithTimezone = await this._userRepo.findOneAndUpdate(user._id, { timezone:data.timezone } );
     const userData: UserDataDTO = toUserData(userWithTimezone);
    if (!user.isVerified)
      this.generateOtpAndSendMail(user._id.toString(), user.email, OtpType.VERIFICATION);

    // CHECK FOR PROFILE existence
    let profileCount = 0;
    if (user.role === UserRole.USER) {
      profileCount = await this._profileRepo.count({ userId: user._id.toString() });
    }
    if (user.role === UserRole.TRAINER) {
      profileCount = await this._trainerRepo.count({ userId: user._id.toString() });
    }
    userData.hasProfile = profileCount !== 0;
    const accessToken = this.generateAccessToken(user._id.toString(),user.email, user.role,user.timezone);
    const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
    console.log('user logged in');
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      statusCode: STATUS_CODE.SUCCESS.OK,
      user: userData,
      isVerified: user.isVerified,
      accessToken,
      refreshToken,
    };
  };

  //Google Login
  googleLogin = async (token: string): Promise<LoginResponseDTO> => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, sub, name } = ticket.getPayload();

    let user = await this._userRepo.findByEmail(email);
  
    if (!user) {
      user = await this._userRepo.create({
        googleId: sub,
        name: name,
        email: email,
        role: UserRole.PENDING,
        password: `google_${Date.now()}`,
        isVerified: true,
      });
    }
    if (user.isBlocked)
      throw new AppError(ERROR_MESSAGES.AUTH.BLOCKED_USER, STATUS_CODE.ERROR.FORBIDDEN);
    
    const userData: UserDataDTO = toUserData(user);
    let profileCount = 0;
    if (user.role === UserRole.USER) {
      profileCount = await this._profileRepo.count({ userId: user._id.toString() });
    }
    if (user.role === UserRole.TRAINER) {
      profileCount = await this._trainerRepo.count({ userId: user._id.toString() });
    }
    userData.hasProfile = profileCount !== 0;
    const accessToken = this.generateAccessToken(user._id.toString(),user.email, user.role,user.timezone);
    const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);
    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      statusCode: STATUS_CODE.SUCCESS.OK,
      user: userData,
      isVerified: true,
      accessToken,
      refreshToken,
    };
  };

  //add role of user
  updateRole = async (data: UpdateRoleDTO): Promise<UserResponseDTO> => {
    const Data = await this._userRepo.findByEmail(data.email);
    if (!Data) {
      console.log('No user Data');
      throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }

    const userId = Data._id.toString();
    const user = await this._userRepo.findOneAndUpdate(userId, { role: data.role });

    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const userData: UserDataDTO = toUserData(user);
    let profileCount = 0;
    if (user.role === UserRole.USER) {
      profileCount = await this._profileRepo.count({ userId: user._id.toString() });
    }
    if (user.role === UserRole.TRAINER) {
      profileCount = await this._trainerRepo.count({ userId: user._id.toString() });
    }
    const hasProfile = profileCount !== 0;
    userData.hasProfile = hasProfile;
    const accessToken = this.generateAccessToken(user._id.toString(),user.email, user.role,user.timezone);
    const refreshToken = this.generateRefreshToken(user._id.toString(), user.role);

    return {
      success: true,
      message: SUCCESS_MESSAGES.AUTH.ROLE_UPDATED,
      statusCode: STATUS_CODE.SUCCESS.OK,
      user: userData,
      accessToken,
      refreshToken,
    };
  };

  //authentication check
  authMe = async (userId: string): Promise<AuthMeResponseDto> => {
    const user = await this._userRepo.findById(userId);
    if (user.isBlocked) {
      console.log(ERROR_MESSAGES.AUTH.BLOCKED_USER);
      throw new AppError(ERROR_MESSAGES.AUTH.BLOCKED_USER, STATUS_CODE.ERROR.FORBIDDEN);
    }
    let profileCount = 0;
    if (user.role === UserRole.USER) {
      profileCount = await this._profileRepo.count({ userId: user._id.toString() });
    }
    if (user.role === UserRole.TRAINER) {
      profileCount = await this._trainerRepo.count({ userId: user._id.toString() });
    }

    const hasProfile = profileCount !== 0;
    const userData: UserDataDTO = toUserData(user);
    userData.hasProfile = hasProfile;
    return {
      success: true,
      message: 'in session ',
      statusCode: STATUS_CODE.SUCCESS.OK,
      user: userData,
    };
  };

  // refresh access token with refresh token
  refreshAccessToken = async (refreshToken: string): Promise<RefreshTokensResponse> => {
    const decoded = jwt.verify(refreshToken, authConfig.refresh_secret) as {
      id: string;
      email:string;
      role: string;
      timezone:string
    };
    if (!decoded)
      throw new AppError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID, STATUS_CODE.ERROR.UNAUTHORIZED);

    const accessToken = this.generateAccessToken(decoded.id, decoded.email,decoded.role,decoded.timezone) as string;
    refreshToken = this.generateRefreshToken(decoded.id, decoded.role) as string;
    return { accessToken, refreshToken };
  };

  verifyOTPInternal = async (data: VerifyOtpDTO) => {
    const savedOtp = await this._otpRepo.findOtp(data.userId, data.otpContext);
    if (!savedOtp) return { valid: false, message: ERROR_MESSAGES.AUTH.OTP_INVALID };

    console.log('saved otp', savedOtp.code);
    const isMatch = await bcrypt.compare(data.otp, savedOtp.code);
    console.log('isMatch', isMatch);
    if (!isMatch) return { valid: false, message: ERROR_MESSAGES.AUTH.OTP_INVALID };

    await this._otpRepo.deleteOtp(savedOtp.userId.toString(), data.otpContext);
    return { valid: true, userId: savedOtp.userId };
  };

  //access Token
  private generateAccessToken(id: string,email:string, role: string,timezone:string): string {
    return jwt.sign({ id,email,role,timezone }, authConfig.secret!, {
      expiresIn: authConfig.secret_expires_in,
    } as SignOptions);
  }

  //refresh Token
  private generateRefreshToken(id: string, role: string): string {
    return jwt.sign({ id, role }, authConfig.refresh_secret!, {
      expiresIn: authConfig.refresh_secret_expires_in,
    } as SignOptions);
  }

  // generate OTP and send mail to user
  generateOtpAndSendMail = async (userId: string, email: string, otpContext: OtpType) => {
    const OTP = generateOTP();
    console.log(OTP);
    const hashedOTP = await bcrypt.hash(OTP, 10);
    // 3. Save the HASHED version
    await this._otpRepo.createOtp(userId, hashedOTP, otpContext);
    try {
      await sendEmailOTP(email, OTP);
      console.log('Verification code sent to:', email);
    } catch (error) {
       console.log(error)   ;
      throw new AppError("Failed to send verification email", STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    
    
    console.log('verification code sent to your mail. Please verify your email.');
    return true;
  };
}
