import User from './models/user.model'
import Profile from './models/profile.model';
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import AuthController from "./api/controllers/auth.controller";
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './api/controllers/profile.controller';
import { OtpRepository } from './repositories/otp.repository';
import otpModel from './models/otp.model';


const userRepository= new UserRepository(User);

const profileRepository =new ProfileRepository(Profile);
const profileService=new ProfileService( profileRepository,userRepository);
const profileController=new ProfileController(profileService);

const otpRepository =new OtpRepository(otpModel);


const authService=new AuthService(userRepository,otpRepository,profileRepository);
const authController=new AuthController(authService);




export {
    authService,
    authController,
    profileService,
    profileController
};