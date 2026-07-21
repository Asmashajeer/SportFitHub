const authConfig = {
  secret: process.env.JWT_SECRET as string,
  secret_expires_in: process.env.JWT_SECRET_EXPIRES_IN as string,
  refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  refresh_secret_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRES_IN as string,
  sendGrid_api: process.env.SENDGRID_API_KEY,
};

export default authConfig;
