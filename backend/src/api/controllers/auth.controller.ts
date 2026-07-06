import type { Request, Response, NextFunction } from 'express';
import { UserRole, OtpType } from '@/constants/enums';
import AppError from '../../utils/AppError';
import { IAuthService } from '../../interfaces/services/IAuth.service';

import {
  AuthMeResponseDto,
  RegisterResponseDTO,
  UserResponseDTO,
} from '../../dtos/response/auth.response.dto';
import Logger from '@/utils/logger';
import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { AuthRequest } from '@/middleware/auth.middleware';

export default class AuthController {
  private _authService: IAuthService;
  constructor(authService: IAuthService) {
    this._authService = authService;
  }
  //---------------user Registration------------
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`User requested a for registration with ${req.body.email}`);
    try {
      const result = await this._authService.register(req.body);
      Logger.info('Account created successfully', {
        userId: result.user.id,
        action: 'registration',
        role: result.user.role,
      });
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  //------------------email verififcation
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: UserResponseDTO = await this._authService.verifyEmail(req.body);
      const { refreshToken, accessToken, ...user } = result;
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(result.statusCode).json(user);
    } catch (error) {
      next(error);
    }
  };


  //----------------resend OTP
  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otpContext } = req.body;
      const result: RegisterResponseDTO = await this._authService.resendOtp(email, otpContext);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };


  //-------------------forgot Password
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const otpContext = OtpType.PASSWORD_RESET;
      const result = await this._authService.resendOtp(email, otpContext);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };


  //------------------reset PASSWORD
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp, newPassword } = req.body;

      const result = await this._authService.resetPassword({ email, otp, newPassword });
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };


  //----------------user Login-----------------
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password,timezone } = req.body;
      const result = await this._authService.login({ email, password,timezone });
      Logger.info(`User logged in`, { userId: result.user.id, email: email,timezone:timezone });
      const { refreshToken, accessToken, ...data } = result;
      this._setAuthCookies(res, accessToken, refreshToken);
      
      res.status(STATUS_CODE.SUCCESS.OK).json(data);

    } catch (error) {
      next(error);
    }
  };

  //------------------Google Login
  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body; // Token from frontend

    try {
      const result = await this._authService.googleLogin(token);
      Logger.info(`User logged in via google login`, {
        userId: result.user.id,
        email: result.user.email,
      });
      const { refreshToken, accessToken, ...user } = result;
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(STATUS_CODE.SUCCESS.OK).json(user);
    } catch (error) {
      console.error('Google Auth Error:', error.message);
      next(error);
    }
  };

  //-----------------update userRole
  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;
      const CurrUser = authReq.user
                    
      const id = CurrUser.id;
      const { email, role } = req.body;
      if (!Object.values(UserRole).includes(role)) {
        throw new AppError(ERROR_MESSAGES.AUTH.ROLE_INVALID, STATUS_CODE.ERROR.BAD_REQUEST);
      }
      const chosenRole = role as UserRole.TRAINER | UserRole.USER;
      const data: UserResponseDTO = await this._authService.updateRole({
        email: email,
        role: chosenRole,
      });
      Logger.warn(`Role updated for user`, { targetEmail: email, newRole: role, updatedBy: id });
      const { refreshToken, accessToken, ...user } = data;
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(STATUS_CODE.SUCCESS.OK).json(user);
    } catch (error) {
      next(error);
    }
  };



  // -------------------------Authentication
  authMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const authReq = req as AuthRequest;
     const userId = authReq.user.id;
     const data: AuthMeResponseDto = await this._authService.authMe(userId);

      res.status(STATUS_CODE.SUCCESS.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  //---------------------------Refresh AccessToken
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenExisted = req.cookies.refreshToken;
      if (!refreshTokenExisted)
        throw new AppError(
          ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID,
          STATUS_CODE.ERROR.UNAUTHORIZED
        );

      const { accessToken, refreshToken } =
        await this._authService.refreshAccessToken(refreshTokenExisted);
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(STATUS_CODE.SUCCESS.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  //-----------------------Logout user
  logout = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    const userId = authReq.user.id;

    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    Logger.info(`User logged out`, { userId:userId });
    res
      .status(STATUS_CODE.SUCCESS.OK)
      .json({ success: true, message: SUCCESS_MESSAGES.GENERAL.LOGGED_OUT });
  };

  // ---------------------------Add FCM token for pushNotification
 updateFcmToken=async(req: AuthRequest, res: Response, next: NextFunction): Promise<void>=> {
  try {
    const { fcmToken } = req.body;
    await this._authService.updateFcmToken(req.user.id, fcmToken);
    res.status(STATUS_CODE.SUCCESS.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}


// -----------------------Set Cookies---------------
  private _setAuthCookies(res: Response, accessToken: string, refreshToken?: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: Number(process.env.ACCESS_TOKEN_MAXAGE),
    });

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: Number(process.env.REFRESH_TOKEN_MAXAGE),
      });
    }
  }
}
