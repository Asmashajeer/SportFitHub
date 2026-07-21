import { Response } from 'express';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken?: string) => {
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
};
