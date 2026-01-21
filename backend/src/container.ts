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
import { UserService } from './services/user.service';
import { UserAdminController } from './api/controllers/admin/user.admin.controller';
import { AdminDashboardController } from './api/controllers/admin/admin.dashboard.controller';


const userRepository= new UserRepository(User);
const userService=new UserService(userRepository);
const userAdminController=new UserAdminController(userService);
const adminDashboardController=new AdminDashboardController(userService);

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
    profileController,
    userAdminController,
    adminDashboardController
};