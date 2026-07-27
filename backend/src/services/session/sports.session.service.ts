import { PAGINATION_LIMIT, UserRole } from '@/constants/enums';

import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import {
  GetSessionsResponseDTO,
  PaginatedSportsSessionsResponseDTO,
  SportSessionDetailedPublicDTO,
  SportSessionUpdateResponseDTO,
  SportsSessionResponseDTO,
} from '@/dtos/response/session/sports.session.response.dto';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ISportsSessionService } from '@/interfaces/services/session/ISports.session.service';
import { toSportSessionDetailedPublicDTO, toSportSessionPublicDTO, toSportsSessionResponseDTO, toSportsSessionUpdateResponseDTO } from '@/mappers/sports.session.mapper';

import { ISportsSession } from '@/models/sportsSession.model';

import AppError from '@/utils/AppError';
import { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { formatTo12Hour } from '@/utils/formatTo';

import { IBookingService } from '@/interfaces/services/booking/IBooking.service';

export class SportsSessionService implements ISportsSessionService {
  private _sportsSessionRepo: ISportsSessionRepository;
  private _trainerRepo: ITrainerRepository;
  private _bookingService: IBookingService;

  constructor(sportsSessionRepo: ISportsSessionRepository, trainerRepo: ITrainerRepository, bookingService: IBookingService) {
    this._sportsSessionRepo = sportsSessionRepo;
    this._trainerRepo = trainerRepo;
    this._bookingService = bookingService;
  }
  //----------create Session------------------
  async createSportSession(sessionData: Partial<ISportsSession>): Promise<SportsSessionResponseDTO> {
    //-----------check timeslots are within trainer working hours
    this.checkWithinWorkingHours(sessionData);

    //check for conflict with existing session's timeslots
    const newSlots = sessionData.timeSlots;
    const conflict = await this.checkConflicts(sessionData.trainerId, newSlots);
    if (conflict?.hasConflict) throw new AppError(conflict.message, STATUS_CODE.ERROR.CONFLICT);

    const data = await this._sportsSessionRepo.create(sessionData);
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.CREATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toSportsSessionResponseDTO(data);
    return session;
  }

  async getSessionsToUpdate(id: string): Promise<SportSessionUpdateResponseDTO> {
    const sessionData = await this._sportsSessionRepo.findBysessionId(id);

    const session = toSportsSessionUpdateResponseDTO(sessionData);

    return session;
  }
  //--------update session-----------
  async updateSportSession(id: string, sessionData: Partial<ISportsSession>): Promise<SportSessionUpdateResponseDTO> {
    //check timeslots are within trainer working hours
    this.checkWithinWorkingHours(sessionData);

    //check for conflict with existing session's timeslots
    const newSlots = sessionData.timeSlots;
    const conflict = await this.checkConflicts(sessionData.trainerId, newSlots, id);
    if (conflict?.hasConflict) throw new AppError(conflict.message, STATUS_CODE.ERROR.CONFLICT);

    const data = await this._sportsSessionRepo.updateSession(id, sessionData);
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toSportsSessionUpdateResponseDTO(data);
    return session;
  }

  //-------delete session---------
  async deleteSportSession(id: string, cancelledBy: UserRole): Promise<SportsSessionResponseDTO> {
    const bookingSessions = await this._bookingService.getBookedSessionsBySessionId(id);
    // ---no bookings
    if (bookingSessions.length === 0) {
      const data = await this._sportsSessionRepo.deleteASession(id);
      if (!data) {
        throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
      }
      const session = toSportsSessionResponseDTO(data);
      return session;
    }

    // ----with bookings
    const cancellationWindow = bookingSessions[0].session.cancellationWindow;
    const withinWindow = bookingSessions.some((bookingSession) =>
      this._bookingService.isWithinCancellationWindow(bookingSession.date.toString(), bookingSession.startTime, bookingSession.session.cancellationWindow)
    );

    if (withinWindow) {
      throw new AppError(`Cannot delete — one or more booked sessions are within the ${cancellationWindow}hr cancellation window`, STATUS_CODE.ERROR.BAD_REQUEST);
    }

    await Promise.all(
      bookingSessions.map(async (bookingSession) => {
        const sessionBookingId = bookingSession.id;
        const userId = bookingSession.userId.toString();
        const reason = 'Cancelled by trainer';

        await this._bookingService.cancelSession(sessionBookingId, reason, cancelledBy);
      })
    );
    const data = await this._sportsSessionRepo.deleteASession(id);
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }

    const session = toSportsSessionResponseDTO(data);
    return session;
  }

  //--------------make active/inactive session ----------
  async updateSessionVisibility(id: string | Types.ObjectId, isActive: boolean): Promise<SportsSessionResponseDTO> {
    const data = await this._sportsSessionRepo.findOneAndUpdate(id, { isActive: isActive });
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toSportsSessionResponseDTO(data);
    return session;
  }

  //-------------- get all sessions by a trianerId--------------
  async getSessionsByTrainer(userId: string | Types.ObjectId, filters: FilterQuery<ISportsSession>): Promise<PaginatedSportsSessionsResponseDTO> {
    const trainer = await this._trainerRepo.findByUserId(userId);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const { search, page, limit } = filters;
    const query: FilterQuery<ISportsSession> = { trainerId: trainer.id, isDeleted: false, page: page, limit: limit };
    if (search) {
      query.$or = [{ sessionName: { $regex: search, $options: 'i' } }, { sessionType: { $regex: search, $options: 'i' } }, { mode: { $regex: search, $options: 'i' } }];
    }
    // search by duration
    const isNumber = !isNaN(Number(search));
    if (isNumber && search !== '') {
      query.$or.push({ duration: Number(search) });
    }
    const result = await this._sportsSessionRepo.findByTrainer(query);
    const sessionData = result?.sessions || [];
    const sessions = sessionData.map((session) => toSportsSessionResponseDTO(session));
    return { sessions, pagination: result.pagination };
  }

  //--------------- get all sessions-----Public Listing---------
  async getAllSessions(filters: FilterQuery<ISportsSession>): Promise<GetSessionsResponseDTO> {
    const { page, limit, search, sport, sessionType, ageGroup, lat, lng, radius } = filters;

    const query: FilterQuery<ISportsSession> = { isDeleted: false, isApproved: true, isActive: true };

    if (search) {
      query.$or = [{ sessionName: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    }
    if (sport && sport !== 'all') query.sportCategory = sport;
    if (sessionType && sessionType !== 'all') query.sessionType = sessionType;
    if (ageGroup && ageGroup !== 'all') query.ageGroup = ageGroup;

    if (lat && lng && radius) {
      query['venue.location'] = {
        $geoWithin: {
          $centerSphere: [
            [Number(lat), Number(lng)], // [longitude, latitude]
            radius / 6371,
          ],
        },
      };
    }
    const result = await this._sportsSessionRepo.findAll(query, { page: Number(page) || 1, limit: Number(limit) || PAGINATION_LIMIT });
    const sessionData = result?.sessions || [];
    const sessions = sessionData.map((session) => toSportSessionPublicDTO(session));
    return { sessions, pagination: result.pagination };
  }

  // ---------------------get  a session by ID-public-------------
  async getASession(id: string | Types.ObjectId): Promise<SportSessionDetailedPublicDTO> {
    const sessionData = await this._sportsSessionRepo.findBysessionId(id);

    const session = toSportSessionDetailedPublicDTO(sessionData);
   
    return session;
  }

  // -------------Find any session belonging to this trainer that has an overlap---------------
  checkConflicts = async (trainerId, newTimeSlots, sessionId: string | null = null) => {
    for (const dayEntry of newTimeSlots) {
      const { day, slots } = dayEntry;
      for (const slot of slots) {
        const query: any = {
          trainerId,
          timeSlots: {
            $elemMatch: {
              day,
              slots: {
                $elemMatch: {
                  startTime: { $lt: slot.endTime },
                  endTime: { $gt: slot.startTime },
                },
              },
            },
          },
        };

        if (sessionId) {
          query._id = { $ne: new Types.ObjectId(sessionId) };
        }
        const conflict = await this._sportsSessionRepo.findOne(query);

        if (conflict) {
          return {
            hasConflict: true,
            message: `Time conflict on ${day} (${formatTo12Hour(slot.startTime)}-${formatTo12Hour(slot.endTime)}) with existing session: "${conflict.sessionName}"`,
          };
        }
      }
    }
    return { hasConflict: false };
  };

  //--------------- check session is within in trainer working hours-----------------
  checkWithinWorkingHours = async (sessionData) => {
    const trainerProfile = await this._trainerRepo.findById(sessionData.trainerId);
    const availability = trainerProfile.availability;

    sessionData.timeSlots.forEach((newDayEntry) => {
      const dayName = newDayEntry.day;
      const trainerDay = availability[dayName];

      // 1. Check if they even work that day
      if (!trainerDay || !trainerDay.available) {
        throw new AppError(`Trainer does not work on ${dayName}`, STATUS_CODE.ERROR.BAD_REQUEST);
      }

      // 2. Check every slot against working hours
      newDayEntry.slots.forEach((slot) => {
        const isOutsideHours = slot.startTime < trainerDay.startTime || slot.endTime > trainerDay.endTime;

        if (isOutsideHours) {
          throw new AppError(`Slot ${slot.startTime}-${slot.endTime} is outside working hours (${trainerDay.startTime}-${trainerDay.endTime})`, STATUS_CODE.ERROR.BAD_REQUEST);
        }
      });
    });
  };
}
