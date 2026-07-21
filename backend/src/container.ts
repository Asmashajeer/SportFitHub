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
import { SportsSessionService } from './services/session/sports.session.service';
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

import DocumentsService from './services/documents.service';
import DocumentsController from './api/controllers/documents.controller';
import { AttendanceService } from './services/trainer/attendance.service';
import { AttendanceController } from './api/controllers/trainer/attendance.controller';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import conversationModel from './models/conversation.model';
import messageModel from './models/message.model';
import { ChatService } from './services/chat.service';
import { createChatHandler } from './socket/handlers/chat.handler';
import { ChatController } from './api/controllers/chat.controller';

const userRepository = new UserRepository(User);
const profileRepository = new ProfileRepository(Profile);
const otpRepository = new OtpRepository(otpModel);
const trainerRepository = new TrainerRepository(TrainerProfile);
const sportsRepository = new SportsRepository(SportsModel);
const fitnessRepository = new FitnessRepository(fitnessProgramModel);
const sportsSessionRepository = new SportsSessionRepository(sportsSessionModel);
const fitnessSessionRepository = new FitnessSessionRepository(fitnessSessionModel);
const paymentRepository = new PaymentRepository(paymentModel);
const walletRepository = new WalletRepository(walletModel);
const walletTransactionRepository = new WalletTransactionRepository(walletTransactionModel);
const bookingRepository = new BookingRepository(bookingModel);
const bookingSessionRepository = new BookingSessionRepository(bookingSessionModel);
const penaltyRepository = new PenaltyRepository(TrainerProfile);

const userManagementService = new UserManagementService(userRepository, bookingSessionRepository, walletRepository, trainerRepository, sportsSessionRepository, fitnessSessionRepository);
const userManagementController = new UserManagementController(userManagementService);
const isBlocked = checkBlocked(userRepository);
const authService = new AuthService(userRepository, otpRepository, profileRepository, trainerRepository);
const profileService = new ProfileService(profileRepository, userRepository, authService);
const profileController = new ProfileController(profileService);

const documentsService = new DocumentsService(trainerRepository);
const documentsController = new DocumentsController(documentsService);

const trainerManagementService = new TrainerManagementService(trainerRepository, userRepository);

const trainerManagementController = new TrainerManagementController(trainerManagementService);

const authController = new AuthController(authService);
const trainerService = new TrainerService(trainerRepository, userRepository, authService);

const trainerController = new TrainerController(trainerService);
const sportsService = new SportsService(sportsRepository);
const sportsController = new SportsController(sportsService);

const sportsManagementService = new SportsManagementService(sportsRepository);
const sportManagementController = new SportsManagementController(sportsManagementService);

const fitnessService = new FitnessService(fitnessRepository);
const fitnessController = new FitnessController(fitnessService);

const fitnessManagementService = new FitnessManagementService(fitnessRepository);
const fitnessManagementController = new FitnessManagementController(fitnessManagementService);

const sessionManagementService = new SessionManagementService(sportsSessionRepository, fitnessSessionRepository);
const sessionManagementController = new SessionManagementController(sessionManagementService);

const paymentService = new PaymentService(paymentRepository, userRepository, sportsSessionRepository, fitnessSessionRepository);

const redisClientService = new RedisClientService();
const slotLockService = new SlotLockService(redisClientService);

const walletService = new WalletService(walletRepository);
const walletTransactionService = new WalletTransactionService(walletRepository, walletTransactionRepository);
const walletController = new WalletController(walletService, walletTransactionService);

const penaltyService = new PenaltyService(penaltyRepository, walletService);

export const bookingService = new BookingService(
  bookingRepository,
  bookingSessionRepository,
  paymentRepository,
  sportsSessionRepository,
  fitnessSessionRepository,
  slotLockService,
  walletService,
  walletTransactionService,
  penaltyService,
  userRepository,
  trainerRepository
);
const paymentController = new PaymentController(paymentService, bookingService);
const bookingController = new BookingController(bookingService);

const webhookController = new WebhookController(bookingService, slotLockService);
const sportsSessionService = new SportsSessionService(sportsSessionRepository, trainerRepository, bookingService);
const sportsSessionController = new SportsSessionController(sportsSessionService);
const fitnessSessionService = new FitnessSessionService(fitnessSessionRepository, trainerRepository, bookingService);
const fitnessSessionController = new FitnessSessionController(fitnessSessionService);
const sessionController = new SessionController(sportsSessionService, fitnessSessionService);
const bookingsManagementService = new BookingsManagementService(bookingRepository, bookingSessionRepository);
const bookingsManagementController = new BookingsManagementController(bookingsManagementService);
const attendanceService = new AttendanceService(bookingSessionRepository);
const attendanceController = new AttendanceController(attendanceService);

const conversationRepository = new ConversationRepository(conversationModel);
const messageRepository = new MessageRepository(messageModel);

const chatService = new ChatService(conversationRepository, messageRepository);

const chatHandler = createChatHandler(chatService);
const chatController = new ChatController(chatService);
export {
  authController,
  isBlocked,
  profileController,
  documentsController,
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
  bookingsManagementController,
  attendanceController,
  chatService,
  chatController,
  chatHandler,
};
