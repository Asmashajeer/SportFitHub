import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models/user.model';
import AppError from '../../utils/AppError';
import { IAuthService } from '../../interfaces/services/IAuth.service';
import { OtpType } from '../../models/otp.model';
import {
  AuthMeResponseDto,
  RegisterResponseDTO,
  UserDataDTO,
  UserResponseDTO,
} from '../../dtos/response/auth.response.dto';

export default class AuthController {
  private _authService: IAuthService;
  constructor(authService: IAuthService) {
    this._authService = authService;
  }
  //register user
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._authService.register(req.body);
      console.log(result);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

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

  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const { email, otpContext } = req.body;
      const result: RegisterResponseDTO = await this._authService.resendOtp(email, otpContext);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

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

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      const { email, otp, newPassword } = req.body;

      const result = await this._authService.resetPassword({ email, otp, newPassword });
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };
  // login user
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(" welcome");
      const { email, password, role } = req.body;
      const result = await this._authService.login({ email, password });
      const { refreshToken, accessToken, ...data } = result; 
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  //-googleLogin
  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body; // Token from frontend
    console.log('token', token);
    try {
      const result = await this._authService.googleLogin(token);
      const { refreshToken, accessToken, ...user } = result;
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json(user);
    } catch (error) {
      console.error('Google Auth Error:', error.message);
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('updating role.........');
      const { email, role } = req.body;
      if (!Object.values(UserRole).includes(role)) {
        throw new AppError('Invalid role selected', 400);
      }
      const chosenRole = role as UserRole.TRAINER | UserRole.USER;
      const data: UserResponseDTO = await this._authService.updateRole({
        email: email,
        role: chosenRole,
      });
      const { refreshToken, accessToken, ...user } = data;
      this._setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json( user);
    } catch (error) {
      next(error);
    }
  };

  authMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as any;
      const data: AuthMeResponseDto = await this._authService.authMe(id);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  //refresh AccessToken
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenExisted = req.cookies.refreshToken;
      if (!refreshTokenExisted)
             throw new AppError('No refreshToken provided', 401);

      const {accessToken,refreshToken} = await this._authService.refreshAccessToken(refreshTokenExisted);
     
      this._setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({ success: true });
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
