import {
  BOOKING_SESSION_STATUS,
  BOOKING_STATUS,
  BOOKING_TYPE,
  CURRENCY,
  PAYLOAD_MODEL,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TTLSECONDS,
  UserRole,
} from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { BookedSlot, BookingSessionRequestfilterDTO, CheckAvailabilityDTO, LockSlotDTO, PayloadDTO } from '@/dtos/request/booking/booking.request.dto';
import { IBookingRepository } from '@/interfaces/repositories/IBooking.repository';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { IBookingService } from '@/interfaces/services/booking/IBooking.service';
import AppError from '@/utils/AppError';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import mongoose, { Types } from 'mongoose';
import { ClientSession } from 'mongoose';
import Stripe from 'stripe';
import {
  BookedSessionTrainerResponseDTO,
  BookedSlotPublicResponseData,
  BookingConfirmResponseDTO,
  CancelBookedSessionResponseDTO,
  UserBookedSessionsResponseDTO,
  UserBookingResponseDTO,
  UserBookingResponseDTOwithStatusCount,
  UserSessionsResponseDTOwithPopulatedSession,
} from '@/dtos/response/booking/booking.response.dto';
import {
  toBookedSessionResponseDTOWithPopulatedUser,
  toBookedSlotPublicResponseData,
  toCancelBookedSessionResponseDTO,
  totoUserBookingResponseDTOwithStatusCount,
  toUserBookingResponseDTO,
  toUserSessionsResponseDTO,
  toUserSessionsResponseDTOwithPopulatedSession,
} from '@/mappers/booking/booking.mapper';
import { ISlotLockService } from '@/interfaces/services/booking/ISlotLock.service';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { IBookedSessionPopulate, IBookingSession } from '@/models/booking.session.model';

import { IWalletService } from '@/interfaces/services/wallet/IWallet.service';
import { IWalletTransactionService } from '@/interfaces/services/wallet/IWallet.transaction.service';
import { toUserPaymentResponseDTO } from '@/mappers/booking/payment.mappers';
import { FilterQuery } from 'mongoose';
import { getTimezone } from '@/context/timezone.context';
import { format, formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { formatDateTo, formatTo12Hour, toUTC_Date } from '@/utils/formatTo';
import { IBookedSlot } from '@/models/booking.model';

import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IPenaltyService } from '@/interfaces/services/trainer/IPenalty.service';
import { PushNotificationPayload, sendPushNotification } from '@/utils/push-notification.service';

import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';

export class BookingService implements IBookingService {
  private _bookingRepo: IBookingRepository;
  private _bookingSessionRepo: IBookingSessionRepository;
  private _paymentRepo: IPaymentRepository;
  private _fitnessSessionRepo: IFitnessSessionRepository;
  private _sportsSessionRepo: ISportsSessionRepository;
  private _slotLockService: ISlotLockService;
  private _walletService: IWalletService;
  private _walletTransactionService: IWalletTransactionService;
  private _penaltyService: IPenaltyService;
  private _userRepo: IUserRepository;
  private _trainerRepo: ITrainerRepository;
  constructor(
    bookingRepo: IBookingRepository,
    bookingSessionRepo: IBookingSessionRepository,
    paymentRepo: IPaymentRepository,
    sportsSessionRepo: ISportsSessionRepository,
    fitnessSessionRepo: IFitnessSessionRepository,
    slotLockService: ISlotLockService,
    walletService: IWalletService,
    walletTransactionService: IWalletTransactionService,
    penaltyService: IPenaltyService,
    userRepo: IUserRepository,
    trainerRepo: ITrainerRepository
  ) {
    this._bookingRepo = bookingRepo;
    this._bookingSessionRepo = bookingSessionRepo;
    this._paymentRepo = paymentRepo;
    this._sportsSessionRepo = sportsSessionRepo;
    this._fitnessSessionRepo = fitnessSessionRepo;
    this._slotLockService = slotLockService;
    this._walletService = walletService;
    this._walletTransactionService = walletTransactionService;
    this._penaltyService = penaltyService;
    this._userRepo = userRepo;
    this._trainerRepo = trainerRepo;
  }

  //--------------lock booking Slots------------------------
  async lockSessionSlots(lockSlotsData: LockSlotDTO[]): Promise<string[]> {
    const lockResults = await Promise.allSettled(lockSlotsData.map((lockData) => this.lockSlot(lockData)));

    const failedLocks = lockResults.map((result, index) => ({ result, slot: lockSlotsData[index] })).filter(({ result }) => result.status === 'rejected');
    if (failedLocks.length > 0) {
      // 4. Release all successfully locked slots — rollback
      const successfulLockKeys = lockResults.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map((r) => r.value);

      await Promise.allSettled(successfulLockKeys.map((lockKey) => this._slotLockService.releaseLock(lockKey)));

      const failedSummary = failedLocks.map(({ slot }) => `${formatDateTo(slot.date)} [${slot.slotId}]`).join(', ');
      console.log(`Failed to lock slots: ${failedSummary}. Please select new slots.`);
      throw new AppError(`Failed select slot . Please select new slots.`, STATUS_CODE.ERROR.CONFLICT);
    }

    // 5. All locked — collect lock keys
    const lockKeys = lockResults.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map((r) => r.value);

    return lockKeys;
  }

  //----------payment and -booking slot ---------------
  async confirmBooking(stripeSession: Stripe.Checkout.Session, paymentIntent: Stripe.PaymentIntent, invoiceId: string): Promise<BookingConfirmResponseDTO> {
    const metadata = stripeSession.metadata;
    if (!metadata) throw new Error('No metadata found in session');
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // 1. Extract  Metadata
      const sessionId = metadata.SessionId;
      const trainerId = metadata.trainerId;
      const sessionModel = metadata.sessionModel as PAYLOAD_MODEL; // sports or fitness
      const userId = metadata.userId;
      const userEmail = metadata.email;
      const userName = metadata.userName;
      const bookingType = metadata.bookingType as BOOKING_TYPE;
      const planId = metadata.planId;
      const numberOfSessions = Number(metadata.numberOfSessions);
      const amount = Number(metadata.amount);
      const timezone = metadata.userTimezone;

      // payment receipt and method
      const charge = paymentIntent.latest_charge as Stripe.Charge;
      const receiptUrl = charge?.receipt_url;
      const paymentMethod = charge.payment_method_details?.type || PAYMENT_METHOD.CARD;

      //   Fetch the Session data (Sport or Fitness)
      const sessionRepo = sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
      const session = await sessionRepo.findBysessionId(sessionId);
      if (!session) throw new AppError(ERROR_MESSAGES.SESSION.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

      const sessionsToBook = JSON.parse(metadata.sessionsToBook);
      if (!sessionsToBook) {
        console.log('Missing sessionToBook in metadata');
        throw new AppError('Missing sessions ToBook');
      }

      //check availability of slots
      const availabilityResults = await Promise.allSettled(
        sessionsToBook.map((slot) =>
          this.checkAvailability(
            {
              sessionId: slot.sessionId,
              slotId: slot.slotId,
              date: slot.date,
              maxCapacity: session.maxCapacity,
              timezone: timezone,
            },
            dbSession
          )
        )
      );
      const occupiedSlots = availabilityResults
        .map((result, index) => ({ result, slot: sessionsToBook[index] }))
        .filter(
          ({ result }) => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.isAvailable) // false = occupied
        )
        .map(({ slot, result }) => ({
          ...slot,
          remainingCount: result.status === 'fulfilled' ? result.value.remainingCount : 0,
        }));

      // 3. If any occupied — throw with summary
      if (occupiedSlots.length > 0) {
        const summary = occupiedSlots.map((slot) => `${slot.date} [${formatTo12Hour(slot.startTim)}- ${formatTo12Hour(slot.endTime)}]`).join(', ');
        console.log(`${occupiedSlots.length} slot(s) already booked or at max capacity: ${summary}`);
        throw new AppError(`${occupiedSlots.length} slot(s) already booked or at max capacity: ${summary}`);
      }

      //  1. Save Payment
      let payment = await this._paymentRepo.createPayment(
        {
          // bookingId: Types.ObjectId;
          userId: new Types.ObjectId(userId),
          transactionId: paymentIntent.id,
          invoiceId: invoiceId,
          amount: amount,
          currency: paymentIntent.currency,
          paymentMethod: paymentMethod,
          receiptUrl: receiptUrl,
          status: PAYMENT_STATUS.SUCCESS,
        },
        dbSession
      );

      // 2. Save Booking
      const booking = await this._bookingRepo.createBooking(
        {
          userId: new Types.ObjectId(userId),
          sessionId: new Types.ObjectId(sessionId),
          sessionModel: sessionModel,
          stripeSessionId: stripeSession.id,
          bookingType: bookingType,
          pricePlan: {
            planId: planId,
            totalSessions: numberOfSessions,
            pricePaid: amount,
            unitPrice: amount / numberOfSessions,
          },

          venue: session.venue,
          paymentId: payment._id,
          status: BOOKING_STATUS.CONFIRMED,
        },
        dbSession
      );

      const AllSessionsToBoook = await Promise.all(
        sessionsToBook.map(async (S) => {
          //convert to utc date
          const utcDate = toUTC_Date(S.date, S.startTime);
          const endDateTime = toUTC_Date(S.date, S.endTime);

          await this._bookingSessionRepo.createSessionBooking(
            {
              bookingId: booking._id,
              userId: new Types.ObjectId(userId),
              trainerId: new Types.ObjectId(trainerId),
              sessionId: new Types.ObjectId(sessionId),
              sessionModel: sessionModel,
              slotId: S.slotId,
              date: utcDate,
              startTime: S.startTime,
              endTime: S.endTime,
              endDateTime: endDateTime,
              status: BOOKING_SESSION_STATUS.SCHEDULED,
            },
            dbSession
          );
        })
      );

      // 3. Link Booking back to Payment
      payment = await this._paymentRepo.updatePayment(payment._id, { bookingId: booking._id, bookingUId: booking.bookingUId }, dbSession);

      await dbSession.commitTransaction();
      const bookingSummary = AllSessionsToBoook.map((slot) => `${slot.date} [${formatTo12Hour(slot.startTime)}- ${formatTo12Hour(slot.endTime)}]`).join(', ');

      // sending mail to user about confirmation
      await sendNotificationEmail({
        to: userEmail,
        title: 'Booking Confirmed!',
        description: 'Your coaching session has been successfully booked. Our coach is looking forward to seeing you on the field.',
        details: {
          userName: userName,
          sessionName: session.sessionName,
          bookingSummary: bookingSummary,
          numberOfSessions: numberOfSessions,
          amount: amount,
          venueAddress: session.venue,
        },
        closingLine: `Please arrive 10 minutes early to warm up. If you need to cancel, please do so at least ${session.bookingDeadline} hr  in advance.`,
      });

      // send push notification to user
      const user = await this._userRepo.findById(userId);
      if (user?.fcmToken) {
        await sendPushNotification(user.fcmToken, {
          title: 'Booking Confirmed',
          body: `You have successfully booked ${numberOfSessions} session(s) of ${session.sessionName}  : ${bookingSummary}`,
          data: {
            type: BOOKING_SESSION_STATUS.SCHEDULED,
            bookingId: booking._id.toString(),
          },
        });
      }
      //notification to trainer
      const trainerNotificationpayload = {
        title: 'Booking Received',
        body: `A client has booked  ${numberOfSessions} session(s) of ${session.sessionName}  : ${bookingSummary}`,
        data: {
          type: BOOKING_SESSION_STATUS.SCHEDULED,
          bookingId: booking._id.toString(),
        },
      };
      this.notifyTrainer(session.trainerId, trainerNotificationpayload);

      const bookingData = toUserBookingResponseDTO(booking);
      const paymentData = toUserPaymentResponseDTO(payment);

      return { booking: bookingData, payment: paymentData };
    } catch (error) {
      await dbSession.abortTransaction();

      throw error;
    } finally {
      dbSession.endSession();
    }
  }

  // ------------------find by stripe sessionId-------------
  async findBySessionId(stripeSessionId: string): Promise<UserBookingResponseDTO> {
    const bookingData = await this._bookingRepo.findBySessionId(stripeSessionId);
    if (!bookingData) {
      throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }
    const booking = toUserBookingResponseDTO(bookingData);

    return booking;
  }

  // -----------check availability on a specific date and slot------------------
  async checkAvailability(bookingData: CheckAvailabilityDTO, session?: ClientSession) {
    const date = new Date(bookingData.date);

    const dateInZone = formatInTimeZone(date, bookingData.timezone, 'yyyy-MM-dd');

    const dateOnly = format(dateInZone, 'yyyy-MM-dd', { timeZone: bookingData.timezone });

    const startDay = fromZonedTime(`${dateOnly}T00:00:00`, bookingData.timezone);
    const endOfDay = fromZonedTime(`${dateOnly}T23:59:59`, bookingData.timezone);

    const currentBookings = await this._bookingSessionRepo.enrolledCount({
      sessionId: bookingData.sessionId,
      date: { $gte: startDay, $lte: endOfDay },
      slotId: bookingData.slotId,
      status: BOOKING_SESSION_STATUS.SCHEDULED,
    });

    const remainingCount = bookingData.maxCapacity - currentBookings;
    return {
      isAvailable: remainingCount > 0,
      remainingCount: Math.max(0, remainingCount),
    };
  }

  //--------------------check duplicate booking-------------
  checkDuplicateBooking = async (userId: string | Types.ObjectId, sessionId: string | Types.ObjectId, bookingSlots: IBookedSlot[]): Promise<string | null> => {
    const timezone = getTimezone();
    console.log(timezone);
    const duplicateChecks = bookingSlots.map(async (slot) => {
      const utcDate = toUTC_Date(slot.date, slot.startTime);

      const res = await this._bookingSessionRepo.findOne({
        sessionId: new Types.ObjectId(sessionId),
        userId: new Types.ObjectId(userId),
        date: utcDate, // UTC converted date
        slotId: slot.slotId,
        status: BOOKING_SESSION_STATUS.SCHEDULED,
      });

      return { slot, isDuplicate: res !== null };
    });

    const results = await Promise.all(duplicateChecks);

    const duplicates = results.filter((r) => r.isDuplicate);
    if (duplicates.length > 0) {
      const duplicateDetails = duplicates.map((dup) => `Date:${formatDateTo(dup.slot.date)}, Time: (${formatTo12Hour(dup.slot.startTime)} - (${formatTo12Hour(dup.slot.endTime)})`).join(' | ');
      return `You have already booked the following slots: ${duplicateDetails}`;
    }

    return null;
  };

  //-----------find user bookings------
  async getUserBookings(userId: string | Types.ObjectId): Promise<UserBookingResponseDTOwithStatusCount[]> {
    const bookings = await this._bookingRepo.find({ userId: userId });
    if (!bookings) {
      throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }
    const bookingIds = bookings.map((b) => b._id.toString());

    const counts = await this._bookingSessionRepo.bookingsessionsStatusInfo(bookingIds);

    const userBookings = bookings.map((booking) => totoUserBookingResponseDTOwithStatusCount(booking, counts));

    return userBookings;
  }

  //-----------find user booked sessions------
  async getUserSessions(userId: string | Types.ObjectId): Promise<UserSessionsResponseDTOwithPopulatedSession[]> {
    const sessions = await this._bookingSessionRepo.findUserSessions({ userId: userId });

    if (!sessions) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const userSessions = sessions.map((session) => toUserSessionsResponseDTOwithPopulatedSession(session as unknown as IBookedSessionPopulate));

    return userSessions;
  }

  //----------------reschedule booked session-------------------

  async rescheduleSession(sessionBookingId: string, newSlot: BookedSlot): Promise<UserBookedSessionsResponseDTO> {
    const bookedSession = await this._bookingSessionRepo.findByBookingSessionId(sessionBookingId);
    if (!bookedSession) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const { userId, trainerId, sessionId, sessionModel, bookingId } = bookedSession;
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
      const utcDate = toUTC_Date(newSlot.date, newSlot.startTime);
      // Create new session booking
      const newBookingData = await this._bookingSessionRepo.createSessionBooking(
        {
          bookingId: new Types.ObjectId(bookingId),
          userId: new Types.ObjectId(userId),
          trainerId: new Types.ObjectId(trainerId),
          sessionId: new Types.ObjectId(sessionId),
          sessionModel,
          slotId: newSlot.slotId,
          date: utcDate,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          status: BOOKING_SESSION_STATUS.SCHEDULED,
        },
        dbSession
      );
      //  Mark old session as rescheduled
      await this._bookingSessionRepo.updateSessionBookingStatus(sessionBookingId, { status: BOOKING_SESSION_STATUS.RESCHEDULED, rescheduledTo: newBookingData._id }, dbSession);

      await dbSession.commitTransaction();

      const newBooking = toUserSessionsResponseDTO(newBookingData);

      // sending mail to user about rescheduling
      const timezone = getTimezone();
      const user = await this._userRepo.findById(userId.toString());
      await sendNotificationEmail({
        to: user?.email,
        title: 'Booking Rescheduled!',
        description: `Your booking on ${formatInTimeZone(bookedSession.date, timezone, 'yyyy-MM-dd')}-${formatTo12Hour(bookedSession.startTime)} session has been successfully rescheduled to ${formatDateTo(newSlot.date)}-${formatTo12Hour(newSlot.startTime)}`,
        details: {
          userName: user.name,
          bookingId: bookedSession.bookingId,
          date: formatDateTo(newSlot.date),
          time: `${formatTo12Hour(newSlot.startTime)}-${formatTo12Hour(newSlot.endTime)}`,
        },
        closingLine: `Please arrive 10 minutes early to warm up. If you need to cancel, please do so at least 24 hr  in advance.`,
      });

      // sending notification to user
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, {
          title: 'Booking Rescheduled',
          body: `Your booking on ${formatDateTo(bookedSession.date.toString())}-${formatTo12Hour(bookedSession.startTime)} session has been successfully rescheduled to ${formatDateTo(newSlot.date)}-${formatTo12Hour(newSlot.startTime)}`,
          data: {
            type: BOOKING_SESSION_STATUS.RESCHEDULED,
            bookingId: bookedSession.bookingId.toString(),
            newDate: `${formatDateTo(newSlot.date)}-${formatTo12Hour(newSlot.startTime)}`,
          },
        });
      }

      // notification to trainer
      const trainerNotificationpayload = {
        title: 'Booking Rescheduled by client',
        body: ` booking of session: ${bookedSession.sessionId.sessionName} on ${formatDateTo(bookedSession.date.toString())}-${formatTo12Hour(bookedSession.startTime)} session has been successfully rescheduled to ${formatDateTo(newSlot.date)}-${formatTo12Hour(newSlot.startTime)}`,
        data: {
          type: BOOKING_SESSION_STATUS.RESCHEDULED,
          bookingId: bookedSession.bookingId.toString(),
          sessionId: bookedSession.sessionId._id,
          session: bookedSession.sessionId.sessionName,
          newDate: `${formatDateTo(newSlot.date)}-${formatTo12Hour(newSlot.startTime)}`,
        },
      };
      this.notifyTrainer(bookedSession.sessionId.trainerId, trainerNotificationpayload);
      return newBooking;
    } catch (error) {
      throw new Error(error);
    } finally {
      dbSession.endSession();
    }
  }

  // ---------------------- cancellation of a booked session-------------------
  async cancelSession(sessionBookingId: string, reason: string, cancelledBy: UserRole): Promise<CancelBookedSessionResponseDTO> {
    const bookedSessions = await this._bookingSessionRepo.findBookedSessionsPopulatedUser({ _id: sessionBookingId }, { skip: 0, limit: 1 });
    if (bookedSessions.length === 0) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    // const refundBooking = await this._bookingRepo.findById( bookedSession.bookingId );
    const bookedSession = bookedSessions[0];
    console.log('bookedSession ', bookedSession);

    const refundAmount = bookedSession.bookingId.pricePlan?.unitPrice;
    const within = this.isWithinCancellationWindow(bookedSession.date.toString(), bookedSession.startTime, bookedSession.sessionId.cancellationWindow);
    if (within) throw new AppError(`Cannot delete session within ${bookedSession.sessionId.cancellationWindow} hours of start time`, STATUS_CODE.ERROR.BAD_REQUEST);

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
      // update status of bookingSession
      await this._bookingSessionRepo.updateSessionBookingStatus(
        sessionBookingId,
        {
          status: BOOKING_SESSION_STATUS.CANCELLED,
          cancellationReason: reason,
          refundedToWallet: true,
          refundAmount: refundAmount,
        },
        dbSession
      );
      //add  refund amount  to wallet
      const wallet = await this._walletService.addToWallet(bookedSession.userId._id.toString(), refundAmount, dbSession);
      console.log(wallet);
      // add corresponding wallet transaction
      await this._walletTransactionService.addTransaction(
        {
          userId: bookedSession.userId._id,
          transactionType: TRANSACTION_TYPE.CREDIT,
          amount: refundAmount,
          walletTransactionReason: TRANSACTION_REASON.CANCELLATION_FUND,
          status: TRANSACTION_STATUS.COMPLETED,
          description: `Refund ${refundAmount} to wallet by cancelling session with bookingId ${bookedSession.bookingId} on ${bookedSession.date} (${bookedSession.startTime}-${bookedSession.endTime})`,
          balanceAfter: wallet.balance,
          bookingId: bookedSession.bookingId,
          bookingSessionId: bookedSession._id,
        },
        dbSession
      );

      await dbSession.commitTransaction();

      if (cancelledBy === UserRole.TRAINER) {
        await this._penaltyService.applyPenalty(bookedSession.sessionId.trainerId.toString(), refundAmount);
      }

      const bookingSummary = ` Your Booking Summary was ${bookedSession.sessionId.sessionname} was scheduled on ${bookedSession.date} (${bookedSession.startTime}-${bookedSession.endTime}) at ${bookedSession.bookingId.venue.address}. `;

      // sending mail to user about cancellation
      const emailContent =
        cancelledBy === UserRole.TRAINER
          ? {
              title: 'Session Cancelled by Trainer',
              description: 'Your session has been cancelled by the trainer. A full refund has been processed to your wallet.',
              closingLine: `We apologize for the inconvenience caused by the trainer. Your refund of ${refundAmount} has been credited to your wallet and is available immediately.`,
            }
          : {
              title: 'Session Cancellation Confirmed',
              description: 'Your session has been successfully cancelled as requested. Your refund has been processed to your wallet.',
              closingLine: `Your refund of ${refundAmount} has been credited to your wallet and is available immediately.`,
            };
      await sendNotificationEmail({
        to: bookedSession.userId.email,
        ...emailContent,
        details: {
          userName: bookedSession.userId.name,
          sessionName: bookedSession.sessionId.sessionName,
          session: bookedSession.sessionModel,
          summary: bookingSummary,
          numberOfSessions: 1,
          amount: refundAmount,
        },
      });
      // notification to user
      if (bookedSession.userId.fcmToken) {
        await sendPushNotification(bookedSession.userId.fcmToken, {
          title: 'Session Cancelled',
          body: `Your session has been cancelled. ${CURRENCY} ${refundAmount} refunded to your wallet.`,
          data: {
            type: 'SESSION_CANCELLED',
            bookingId: bookedSession.bookingId._id.toString(),
            ...emailContent,
          },
        });
      }

      ///notification to trainer
      const trainerNotificationPayload = {
        title: 'Session Cancelled',
        body: `session  cancelled. ${CURRENCY} ${refundAmount} refunded to user wallet.`,
        data: {
          type: 'SESSION_CANCELLED',
          bookingId: bookedSession.bookingId._id.toString(),
          cancelledBy: cancelledBy === UserRole.TRAINER ? 'cancelled by You' : 'client ',
        },
      };

      this.notifyTrainer(bookedSession.sessionId.trainerId, trainerNotificationPayload);

      const cancellationResponse = {
        sessionBookingId,
        bookingId: bookedSession.bookingId,
        refundAmount,
        walletBalance: wallet.balance,
        cancelledAt: new Date(),
      };
      const data = toCancelBookedSessionResponseDTO(cancellationResponse);
      return data;
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  }

  // ------------------find booked slots for a session by  sessionId
  async getPublicBookedSlots(sessionId: string): Promise<BookedSlotPublicResponseData[]> {
    const bookedSessionData = await this._bookingSessionRepo.find({ sessionId: sessionId });
    if (!bookedSessionData) {
      throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }
    const bookings = bookedSessionData.map((booking) => toBookedSlotPublicResponseData(booking));
    return bookings;
  }

  //--------------get trainer's session booked-----------------
  async getBookedSessionByTrainerId(trainerId: string, timezone: string, filter: BookingSessionRequestfilterDTO): Promise<BookedSessionTrainerResponseDTO> {
    const { page, sessionModel, date, status, limit } = filter;
    const skip = (page - 1) * limit;
    const query: FilterQuery<IBookingSession> = {};
    // get trainer's session IDs
    // const [sportsSessions, fitnessSessions] = await Promise.all([
    //   this._sportsSessionRepo.find({ trainerId }),
    //   this._fitnessSessionRepo.find({ trainerId }),
    // ]);

    //   const sessionIds = [...sportsSessions,... fitnessSessions].map(s => s._id);
    query.trainerId = trainerId;

    if (sessionModel) query.sessionModel = sessionModel;
    if (status) {
      const statuses = status.split(',');
      query.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
    }

    if (date) {
      //  const start = new Date(date);
      //convert to utc date
      const startDay = fromZonedTime(`${date}T00:00:00`, timezone);
      const endofDay = fromZonedTime(`${date}T23:59:59`, timezone);
      query.date = { $gte: startDay, $lte: endofDay };
    }

    const [sessions, totalCount] = await Promise.all([this._bookingSessionRepo.findBookedSessionsPopulatedUser(query, { skip, limit }), this._bookingSessionRepo.count(query)]);
    if (!sessions) {
      console.log('no booked trainer session');
      throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }

    const bookedSessions = sessions.map((session) => toBookedSessionResponseDTOWithPopulatedUser(session));
    return {
      sessions: bookedSessions,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async createBookingWithWallet(userId: string, payload: PayloadDTO): Promise<BookingConfirmResponseDTO> {
    const timezone = getTimezone();
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
      const wallet = await this._walletService.findWallet(userId);
      if (wallet.balance < payload.amount) throw new AppError(' there is no enough balance');
      const lockSlotsData = payload.sessionsToBook.map((slot) => ({
        userId: userId,
        sessionId: payload.sessionId,
        date: slot.date,
        slotId: slot.slotId,
        startTime: slot.startTime,
      }));
      const lockKeys = await this.lockSessionSlots(lockSlotsData);

      //   Fetch the Session data (Sport or Fitness)
      const sessionRepo = payload.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
      const session = await sessionRepo.findBysessionId(payload.sessionId);
      if (!session) throw new AppError(ERROR_MESSAGES.SESSION.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
      if (!payload.sessionsToBook) {
        throw new AppError('Missing sessions ToBook ');
      }

      //check availability of slots
      const availabilityResults = await Promise.allSettled(
        payload.sessionsToBook.map((slot) =>
          this.checkAvailability(
            {
              sessionId: session.id,
              slotId: slot.slotId,
              date: slot.date,
              maxCapacity: session.maxCapacity,
              timezone: timezone,
            },
            dbSession
          )
        )
      );
      const occupiedSlots = availabilityResults
        .map((result, index) => ({ result, slot: payload.sessionsToBook[index] }))
        .filter(
          ({ result }) => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.isAvailable) // false = occupied
        )
        .map(({ slot, result }) => ({
          ...slot,
          remainingCount: result.status === 'fulfilled' ? result.value.remainingCount : 0,
        }));

      // 3. If any occupied — throw with summary
      if (occupiedSlots.length > 0) {
        const summary = occupiedSlots.map((slot) => `${slot.date} [${formatTo12Hour(slot.startTime)}- ${formatTo12Hour(slot.endTime)}]`).join(', ');
        console.log(`${occupiedSlots.length} slot(s) already booked or at max capacity: ${summary}`);
        throw new AppError(`${occupiedSlots.length} slot(s) already booked or at max capacity: ${summary}`);
      }

      // 5. Deduct from wallet
      const newWallet = await this._walletService.deductFromWallet(userId, payload.amount, dbSession);

      //  1. Save Payment
      let payment = await this._paymentRepo.createPayment(
        {
          // bookingId: Types.ObjectId;
          userId: new Types.ObjectId(userId),
          // transactionId: paymentIntent.id,
          // invoiceId:invoiceId,
          amount: payload.amount,
          currency: 'inr',
          paymentMethod: PAYMENT_METHOD.WALLET,
          receiptUrl: '',
          status: PAYMENT_STATUS.SUCCESS,
        },
        dbSession
      );

      // 2. Save Booking
      const booking = await this._bookingRepo.createBooking(
        {
          userId: new Types.ObjectId(userId),
          sessionId: new Types.ObjectId(payload.sessionId),
          sessionModel: payload.sessionModel,
          pricePlan: {
            planId: payload.planId,
            totalSessions: payload.numberOfSessions,
            pricePaid: payload.amount,
            unitPrice: payload.amount / payload.numberOfSessions,
          },
          venue: session.venue,
          paymentId: payment._id,
          status: BOOKING_STATUS.CONFIRMED,
        },
        dbSession
      );

      //-wallet transaction
      const walletTransaction = await this._walletTransactionService.addTransaction(
        {
          userId: new Types.ObjectId(userId),
          transactionType: TRANSACTION_TYPE.DEBIT,
          amount: payload.amount,
          walletTransactionReason: TRANSACTION_REASON.BOOKING_PAYMENT,
          status: TRANSACTION_STATUS.COMPLETED,
          description: `Booked session with  ${payload.amount}  with booking Id ${booking._id} and payment Id ${payment._id} )`,
          balanceAfter: newWallet.balance,
          bookingId: booking._id,
        },
        dbSession
      );

      const AllSessionsToBoook = await Promise.all(
        payload.sessionsToBook.map(async (S) => {
          //convert to utc date
          const utcDate = toUTC_Date(S.date, S.startTime);
          const endDateTime = toUTC_Date(S.date, S.endTime);
          return await this._bookingSessionRepo.createSessionBooking(
            {
              bookingId: booking._id,
              userId: new Types.ObjectId(userId),
              sessionId: new Types.ObjectId(payload.sessionId),
              sessionModel: payload.sessionModel,
              slotId: S.slotId,
              date: utcDate,
              startTime: S.startTime,
              endTime: S.endTime,
              endDateTime: endDateTime,
              status: BOOKING_SESSION_STATUS.SCHEDULED,
            },
            dbSession
          );
        })
      );

      // 3. Link Booking back to Payment
      payment = await this._paymentRepo.updatePayment(payment._id, { bookingId: booking._id, transactionId: walletTransaction.id }, dbSession);

      await dbSession.commitTransaction();
      const keys = JSON.stringify(lockKeys);
      const locks = keys.split(',');
      for (const lock of locks) {
        await this._slotLockService.releaseLock(lock);
      }
      const bookingSummary = AllSessionsToBoook.map((slot) => `${slot.date} [${formatTo12Hour(slot.startTime)}- ${formatTo12Hour(slot.endTime)}]`).join(', ');

      // sending mail to user about confirmation
      await sendNotificationEmail({
        to: payload.user.email,
        title: 'Booking Confirmed!',
        description: 'Your coaching session has been successfully booked. Our coach is looking forward to seeing you on the field.',
        details: {
          userName: payload.user.name,
          sessionName: session.sessionName,
          bookingSummary: bookingSummary,
          numberOfSessions: payload.numberOfSessions,
          amount: payload.amount,
          venueAddress: session.venue,
        },
        closingLine: `Please arrive 10 minutes early to warm up. If you need to cancel, please do so at least ${session.bookingDeadline} hr  in advance.`,
      });
      const bookingData = toUserBookingResponseDTO(booking);
      const paymentData = toUserPaymentResponseDTO(payment);
      return { booking: bookingData, payment: paymentData };
    } catch (error) {
      await dbSession.abortTransaction();

      throw error;
    } finally {
      dbSession.endSession();
    }
  }

  async getBookedSessionsBySessionId(sessionId: string): Promise<UserSessionsResponseDTOwithPopulatedSession[]> {
    const sessions = await this._bookingSessionRepo.findUserSessions({ sessionId: sessionId, status: BOOKING_SESSION_STATUS.SCHEDULED });
    if (!sessions) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const bookedSessions = sessions.map((session) => toUserSessionsResponseDTOwithPopulatedSession(session as unknown as IBookedSessionPopulate));

    return bookedSessions;
  }

  async autoCompleteSessions() {
    const result = await this._bookingSessionRepo.autoCompleteExpiredSessions();
    if (result.modifiedCount > 0) console.log(`Auto-completed ${result.modifiedCount} sessions`);
    return result;
  }

  //  ----------- function to lock a slot--------------
  lockSlot = async (lockSlotData: LockSlotDTO) => {
    const { userId, sessionId, date, slotId, startTime } = lockSlotData;
    console.log('userId :', userId);
    const utcDate = toUTC_Date(date, startTime); // convert to UTC Date
    const lockKey = `lock_slot_${sessionId}_${utcDate}_${slotId}`;
    const existingOwner = await this._slotLockService.getLockOwner(lockKey);
    if (existingOwner) {
      if (existingOwner === userId) {
        await this._slotLockService.releaseLock(lockKey);
      } else {
        throw new AppError(`Slot is already locked by another user`, STATUS_CODE.ERROR.CONFLICT);
      }
    }
    const locked = await this._slotLockService.lockSlot(lockKey, userId, TTLSECONDS);
    console.log('locked  :', locked);
    if (!locked) {
      throw new AppError(`Failed to lock slot`, STATUS_CODE.ERROR.CONFLICT);
    }
    return lockKey;
  };

  //  ----------- function to check isWithinCancellationWindow--------------
  isWithinCancellationWindow(date: string, time: string, cancellationWindow: number): boolean {
    const sessionDateTime = toUTC_Date(date, time);
    const now = new Date();
    const diffMs = sessionDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Within window = session is less than 24hrs away
    return diffHours <= cancellationWindow;
  }

  // ─── to notify trainer  ───
  private async notifyTrainer(trainerId: string, payload: PushNotificationPayload): Promise<void> {
    const userId = await this._trainerRepo.findUserIdByTrainerId(trainerId);
    if (!userId) return;

    const fcmToken = await this._userRepo.findFcmTokenByUserId(userId);
    if (!fcmToken) return;

    await sendPushNotification(fcmToken, payload);
  }
}
