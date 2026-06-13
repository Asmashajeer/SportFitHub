import User from './models/user.model';
import Profile from './models/profile.model';

import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import AuthController from './api/controllers/auth.controller';
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
import { SportsSessionRepository } from './repositories/sports.session.repository';



import sportsSessionModel from './models/sportsSession.model';
import {  SportsSessionService } from './services/session/sports.session.service';
import fitnessSessionModel from './models/fitnessSession.model';
import { FitnessSessionRepository } from './repositories/fitness.session.repository';
import { FitnessSessionService } from './services/session/fitness.session.service';
import { SportsSessionController } from './api/controllers/session/sports.session.controller';
import { SportsService } from './services/sports.service';
import { SportsController } from './api/controllers/sport.controller';
import { FitnessSessionController } from './api/controllers/session/fitness.session.controller';
import { FitnessController } from './api/controllers/fitness.controller';
import { FitnessService } from './services/fitness.service ';
import { SessionController } from './api/controllers/session/session.controller';
import { BookingService } from './services/booking/booking.service';
import { PaymentRepository } from './repositories/payment.repository';

import PaymentService from './services/booking/payment.service';
import { PaymentController } from './api/controllers/booking/payment.controller';
import { BookingRepository } from './repositories/booking.repository';
import { WebhookController } from './api/controllers/booking/webhookController';
import bookingModel from './models/booking.model';
import bookingSessionModel from './models/booking.session.model';
import paymentModel from './models/payment.model';
import { BookingController } from './api/controllers/booking/booking.controller';
import RedisClientService from './services/redis/redisClient.service';
import SlotLockService from './services/redis/slotLock.service';
import { BookingSessionRepository } from './repositories/booking.session.repository';
import { WalletRepository } from './repositories/wallet.repository';
import walletModel from './models/wallet.model';
import { WalletTransactionRepository } from './repositories/wallet.transaction.repository';
import walletTransactionModel from './models/wallet.transaction.model';
import { WalletTransactionService } from './services/wallet/wallet.transaction.service';
import { WalletService } from './services/wallet/wallet.service';
import { WalletController } from './api/controllers/user/wallet.controller';
import { SessionManagementService } from './services/admin/sessionManagement.service';
import { SessionManagementController } from './api/controllers/admin/session.management.controller';
import { BookingsManagementService } from './services/admin/bookingsManagement.service';
import { BookingsManagementController } from './api/controllers/admin/bookingsManagement.controller';
import { checkBlocked } from './middleware/checkBlocked.middleware';
import { PenaltyRepository } from './repositories/penalty.repository';
import { PenaltyService } from './services/trainer/penalty.service';
const userRepository = new UserRepository(User);
const userManagementService = new UserManagementService(userRepository);
const userManagementController = new UserManagementController(userManagementService);
const isBlocked= checkBlocked(userRepository);
const profileRepository = new ProfileRepository(Profile);
const profileService = new ProfileService(profileRepository, userRepository);
const profileController = new ProfileController(profileService);

const otpRepository = new OtpRepository(otpModel);

const trainerRepository = new TrainerRepository(TrainerProfile);
const trainerService = new TrainerService(trainerRepository);
const trainerManagementService = new TrainerManagementService(trainerRepository);

const trainerController = new TrainerController(trainerService);
const trainerManagementController = new TrainerManagementController(trainerManagementService);

const authService = new AuthService(
  userRepository,
  otpRepository,
  profileRepository,
  trainerRepository
);
const authController = new AuthController(authService);

const sportsRepository = new SportsRepository(SportsModel);
const sportsService=new SportsService(sportsRepository);
const sportsController=new SportsController (sportsService);

const sportsManagementService = new SportsManagementService(sportsRepository);
const sportManagementController = new SportsManagementController(sportsManagementService);

const fitnessRepository = new FitnessRepository(fitnessProgramModel);
const fitnessService=new FitnessService(fitnessRepository);
const fitnessController=new FitnessController (fitnessService);

const fitnessManagementService = new FitnessManagementService(fitnessRepository);
const fitnessManagementController = new FitnessManagementController(fitnessManagementService);



const sportsSessionRepository=new SportsSessionRepository(sportsSessionModel);
// const sportsSessionService= new SportsSessionService(sportsSessionRepository,trainerRepository,bookingService);
// const sportsSessionController=new SportsSessionController (sportsSessionService);

const fitnessSessionRepository=new FitnessSessionRepository(fitnessSessionModel);
// const fitnessSessionService= new FitnessSessionService(fitnessSessionRepository,trainerRepository);
// const fitnessSessionController=new FitnessSessionController (fitnessSessionService);
// const sessionController=new SessionController(sportsSessionService,fitnessSessionService);
const sessionManagementService= new SessionManagementService(sportsSessionRepository,fitnessSessionRepository);
const sessionManagementController=new SessionManagementController(sessionManagementService);


const paymentRepository=new PaymentRepository(paymentModel);
const paymentService=new PaymentService(paymentRepository,userRepository,sportsSessionRepository,fitnessSessionRepository);
const redisClientService=new RedisClientService();
const slotLockService=new SlotLockService(redisClientService);

const walletRepository=new WalletRepository(walletModel);
const walletService=new WalletService(walletRepository);
const walletTransactionRepository=new WalletTransactionRepository(walletTransactionModel);
const walletTransactionService=new WalletTransactionService(walletRepository,walletTransactionRepository);
const walletController=new WalletController(walletService,walletTransactionService);
const penaltyRepository = new PenaltyRepository(TrainerProfile);
const penaltyService = new PenaltyService(penaltyRepository, walletService);
const bookingRepository=new BookingRepository(bookingModel);
const bookingSessionRepository=new BookingSessionRepository(bookingSessionModel);
const bookingService=new BookingService(bookingRepository,bookingSessionRepository,paymentRepository,sportsSessionRepository,fitnessSessionRepository,slotLockService,walletService,walletTransactionService,penaltyService);
const paymentController=new PaymentController(paymentService,bookingService);
const bookingController=new BookingController(bookingService);
const webhookController=new WebhookController(bookingService,slotLockService);
const sportsSessionService= new SportsSessionService(sportsSessionRepository,trainerRepository,bookingService);
const sportsSessionController=new SportsSessionController (sportsSessionService);
const fitnessSessionService= new FitnessSessionService(fitnessSessionRepository,trainerRepository,bookingService);
const fitnessSessionController=new FitnessSessionController (fitnessSessionService);
const sessionController=new SessionController(sportsSessionService,fitnessSessionService);
const bookingsManagementService=new BookingsManagementService(bookingRepository,bookingSessionRepository);
const bookingsManagementController=new BookingsManagementController(bookingsManagementService);
export {
  authController,
  isBlocked,
  profileController,
  trainerController,
  userManagementController,
  trainerManagementController,
  sportsController,
  fitnessController,
  sportManagementController,
  fitnessManagementController,
  sportsSessionController,
  fitnessSessionController,
  sessionController,
  sessionManagementController,
  paymentController,
   webhookController,
   bookingController,
   redisClientService,
  slotLockService,
  walletController,
  bookingsManagementController
};
