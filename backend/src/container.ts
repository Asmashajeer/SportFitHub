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
import reviewModel from './models/review.model';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './services/review/review.service';
import { ReviewController } from './api/controllers/review/review.controller';
import { createVideoCallHandler } from './socket/handlers/video.call.handler';
import { PaymentsManagementController } from './api/controllers/admin/paymentManagement.controller';
import { PaymentsManagementService } from './services/admin/paymentManagement.service';
import { PenaltyLedgerModel } from './models/penaltyLedger.model';
import { PenaltyLedgerRepository } from './repositories/penaltyLedger.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { SettingsService } from './services/admin/settings.service';
import PlatformSettingsModel from './models/PlatformSettings.model';
import { PayoutLedgerRepository } from './repositories/payoutLedger.repository';
import payoutLedgerModel from './models/payoutLedger.model';
import { SettingsController } from './api/controllers/admin/settings.controller';
import { PayoutLedgerService } from './services/trainer/payoutLedger.service';
import { TrainerEarningsService } from './services/trainer/trainerEarnings.service';
import { TrainerEarningsController } from './api/controllers/trainer/trainerEarnings.controller';
import { PayoutBatchRepository } from './repositories/payoutBatch.repository';
import PayoutBatchModel from './models/payoutBatch.model';
import { PayoutService } from './services/trainer/payout.service';
import Stripe from 'stripe';
import { StripeConnectService } from './services/trainer/stripeConnect.service';
import { StripeConnectController } from './api/controllers/trainer/stripeConnect.controller';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});
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
const reviewRepository=new ReviewRepository(reviewModel);
const reviewService=new ReviewService(reviewRepository,bookingSessionRepository,sportsSessionRepository,fitnessSessionRepository);
export const reviewController=new ReviewController(reviewService);
const settingsRepo = new SettingsRepository(PlatformSettingsModel);
const settingsService = new SettingsService(settingsRepo);
const payoutLedgerRepository=new PayoutLedgerRepository(payoutLedgerModel);
const payoutBatchRepository=new PayoutBatchRepository(PayoutBatchModel)
const userManagementService = new UserManagementService(userRepository, bookingSessionRepository, walletRepository, trainerRepository, sportsSessionRepository, fitnessSessionRepository);
export const userManagementController = new UserManagementController(userManagementService);
export const isBlocked = checkBlocked(userRepository);
const authService = new AuthService(userRepository, otpRepository, profileRepository, trainerRepository);
const profileService = new ProfileService(profileRepository, userRepository, authService);
export const profileController = new ProfileController(profileService);

const documentsService = new DocumentsService(trainerRepository);
export const documentsController = new DocumentsController(documentsService);

const trainerManagementService = new TrainerManagementService(trainerRepository, userRepository);

export const trainerManagementController = new TrainerManagementController(trainerManagementService);

export const authController = new AuthController(authService);
const trainerService = new TrainerService(trainerRepository, userRepository, authService);

export const trainerController = new TrainerController(trainerService);
const sportsService = new SportsService(sportsRepository);
export const sportsController = new SportsController(sportsService);

const sportsManagementService = new SportsManagementService(sportsRepository);
export const sportManagementController = new SportsManagementController(sportsManagementService);

const fitnessService = new FitnessService(fitnessRepository);
export const fitnessController = new FitnessController(fitnessService);

const fitnessManagementService = new FitnessManagementService(fitnessRepository);
export const fitnessManagementController = new FitnessManagementController(fitnessManagementService);

const sessionManagementService = new SessionManagementService(sportsSessionRepository, fitnessSessionRepository);
export const sessionManagementController = new SessionManagementController(sessionManagementService);

const paymentService = new PaymentService(paymentRepository, userRepository, sportsSessionRepository, fitnessSessionRepository,stripe);

export const redisClientService = new RedisClientService();
export const slotLockService = new SlotLockService(redisClientService);

const walletService = new WalletService(walletRepository);
const walletTransactionService = new WalletTransactionService(walletRepository, walletTransactionRepository);
export const walletController = new WalletController(walletService, walletTransactionService);
const penaltyLedgerRepository=new PenaltyLedgerRepository(PenaltyLedgerModel)
const penaltyService = new PenaltyService(penaltyRepository,penaltyLedgerRepository);

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
  trainerRepository,
  payoutLedgerRepository,
  settingsService,
  
);
export const paymentController = new PaymentController(paymentService, bookingService);
export const bookingController = new BookingController(bookingService);

export const webhookController = new WebhookController(bookingService, slotLockService,stripe);
const sportsSessionService = new SportsSessionService(sportsSessionRepository, trainerRepository, bookingService,penaltyService);
export const sportsSessionController = new SportsSessionController(sportsSessionService);
const fitnessSessionService = new FitnessSessionService(fitnessSessionRepository, trainerRepository, bookingService);
export const fitnessSessionController = new FitnessSessionController(fitnessSessionService);
export const sessionController = new SessionController(sportsSessionService, fitnessSessionService);
const bookingsManagementService = new BookingsManagementService(bookingRepository, bookingSessionRepository);
export const bookingsManagementController = new BookingsManagementController(bookingsManagementService);
const paymentsManagementService=new PaymentsManagementService(paymentRepository,walletTransactionRepository,payoutBatchRepository,payoutLedgerRepository);
export const paymentsManagementController=new PaymentsManagementController(paymentsManagementService)
const attendanceService = new AttendanceService(bookingSessionRepository,reviewService);
export const attendanceController = new AttendanceController(attendanceService);

const conversationRepository = new ConversationRepository(conversationModel);
const messageRepository = new MessageRepository(messageModel);

export const chatService = new ChatService(conversationRepository, messageRepository);
export const chatHandler = createChatHandler(chatService);
export const chatController = new ChatController(chatService);

export const videoCallHandler=createVideoCallHandler(bookingService);
export const settingsController=new SettingsController(settingsService);
export const payoutLedgerService=new PayoutLedgerService(payoutLedgerRepository);
const trainerEarningsService = new TrainerEarningsService(payoutLedgerRepository, penaltyLedgerRepository,payoutBatchRepository);
export const trainerEarningsController=new TrainerEarningsController(trainerEarningsService);
export const payoutService=new PayoutService(payoutLedgerRepository,penaltyLedgerRepository,payoutBatchRepository, trainerRepository,stripe )
const stripeConnectService=new StripeConnectService(trainerRepository,stripe)
export const stripeConnectController= new StripeConnectController(stripeConnectService)
