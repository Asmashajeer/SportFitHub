import User from './models/user.model'
import Profile from './models/profile.model';

import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import AuthController from "./api/controllers/auth.controller";
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/user/profile.service';
import { ProfileController } from './api/controllers/user/profile.controller';
import otpModel from './models/otp.model';
import { OtpRepository } from './repositories/otp.repository';

import { UserManagementService } from './services/admin/userManagement.service';
import { UserManagementController } from './api/controllers/admin/userManagement.admin.controller';

import TrainerProfile from './models/trainerProfile.model';
import { TrainerRepository } from './repositories/trainer.repository';
import { TrainerService } from './services/trainer/trainer.service';
import { TrainerManagementService } from './services/admin/trainerManagement.service';
import { TrainerController } from './api/controllers/trainer/trainer.controller';
import { TrainerManagementController } from './api/controllers/admin/trainerManagement.admin.controller';
import SportsModel from './models/sports.model';
import { SportsRepository } from './repositories/sports.repository';
import { SportsManagementService } from './services/admin/sportsManagement.service';
import { SportsManagementController } from './api/controllers/admin/sportsManagement.controller';

import fitnessProgramModel from './models/fitnessProgram.model';
import { FitnessRepository } from './repositories/fitness.repository';
import { FitnessManagementService } from './services/admin/fitnessManagement.service';
import { FitnessManagementController } from './api/controllers/admin/fitnessManagement.controller';

const userRepository= new UserRepository(User);
const userManagementService=new UserManagementService(userRepository);
const userManagementController=new UserManagementController(userManagementService);


const profileRepository =new ProfileRepository(Profile);
const profileService=new ProfileService( profileRepository,userRepository);
const profileController=new ProfileController(profileService);

const otpRepository =new OtpRepository(otpModel);

const trainerRepository=new TrainerRepository(TrainerProfile);
const trainerService=new TrainerService(trainerRepository)
const trainerManagementService= new TrainerManagementService(trainerRepository);

const trainerController=new TrainerController(trainerService);
const trainerManagementController=new TrainerManagementController(trainerManagementService);

const authService=new AuthService(userRepository,otpRepository,profileRepository,trainerRepository);
const authController=new AuthController(authService);

const sportsRepository= new SportsRepository(SportsModel);
const sportsManagementService=new SportsManagementService(sportsRepository)
const sportManagementController= new SportsManagementController(sportsManagementService);

const fitnessRepository= new FitnessRepository(fitnessProgramModel);
const fitnessManagementService=new FitnessManagementService(fitnessRepository)
const fitnessManagementController= new FitnessManagementController(fitnessManagementService);


export {
    authController,
    profileController,
    trainerController,
    userManagementController,
    trainerManagementController,
    sportManagementController,
    fitnessManagementController
   
};