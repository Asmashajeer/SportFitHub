import User from './models/user.model'
import Profile from './models/profile.model';
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import AuthController from "./api/controllers/auth.controller";
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/user/profile.service';
import { ProfileController } from './api/controllers/user/profile.controller';
import { OtpRepository } from './repositories/otp.repository';
import otpModel from './models/otp.model';
import { UserManagementService } from './services/admin/userManagement.service';
import { UserManagementController } from './api/controllers/admin/userManagement.admin.controller';
import { AdminDashboardController } from './api/controllers/admin/admin.dashboard.controller';
import TrainerProfile from './models/trainerProfile.model';
import { TrainerRepository } from './repositories/trainer.repository';
import { TrainerService } from './services/trainer/trainer.service';
import { TrainerController } from './api/controllers/trainer/trainer.controller';
import { TrainerApprovalsController } from './api/controllers/admin/trainerApprovals.admin.controller';


const userRepository= new UserRepository(User);
const userManagementService=new UserManagementService(userRepository);
const userManagementController=new UserManagementController(userManagementService);


const profileRepository =new ProfileRepository(Profile);
const profileService=new ProfileService( profileRepository,userRepository);
const profileController=new ProfileController(profileService);

const otpRepository =new OtpRepository(otpModel);

const trainerRepository=new TrainerRepository(TrainerProfile);
const trainerService=new TrainerService(trainerRepository)
const trainerController=new TrainerController(trainerService);
const trainerApprovalsController=new TrainerApprovalsController(trainerService);

const authService=new AuthService(userRepository,otpRepository,profileRepository,trainerRepository);
const authController=new AuthController(authService);




export {
    authService,
    authController,
    profileService,
    profileController,
    trainerController,
    trainerService,
    userManagementController,
    trainerApprovalsController
   
};