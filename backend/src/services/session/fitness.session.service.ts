import { PAGINATION_LIMIT, SESSION_MODE, UserRole } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { getTimezone } from '@/context/timezone.context';
import { FitnessSessionDetailedPublicDTO, FitnessSessionResponseDTO, GetFitnessSessionsResponseDTO, PaginatedFitnessSessionsResponseDTO } from '@/dtos/response/session/fitness.session.response.dto';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';

import { IBookingService } from '@/interfaces/services/booking/IBooking.service';
import { IFitnessSessionService } from '@/interfaces/services/session/IFitness.session.service ';
import { IPenaltyService } from '@/interfaces/services/trainer/IPenalty.service';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { toFitnessSessionDetailedPublicDTO, toFitnessSessionPublicDTO, toFitnessSessionResponseDTO } from '@/mappers/fitness.session.mapper';
import { IFitnessSession } from '@/models/fitnessSession.model';
import AppError from '@/utils/AppError';
import { formatTo12Hour } from '@/utils/formatTo';
import { groupByOccurrence } from '@/utils/sessionGrouping';
import { FilterQuery, Types } from 'mongoose';
import tz_lookup from 'tz-lookup';

export class FitnessSessionService implements IFitnessSessionService {
  private _fitnessSessionRepo: IFitnessSessionRepository;
  private _trainerService: ITrainerService;
  private _bookingService: IBookingService;
  private _penaltyService: IPenaltyService;
  constructor(fitnessSessionRepo: IFitnessSessionRepository, trainerService: ITrainerService, bookingService: IBookingService, penaltyService: IPenaltyService) {
    this._fitnessSessionRepo = fitnessSessionRepo;
    this._trainerService = trainerService;
    this._bookingService = bookingService;
    this._penaltyService = penaltyService;
  }

  //----------create Session------------------
  async createFitnessSession(sessionData: Partial<IFitnessSession>): Promise<FitnessSessionResponseDTO> {
    //-----------check timeslots are within trainer working hours
    this._trainerService.checkWithinWorkingHours(sessionData);

    //check for conflict with existing session's timeslots
    const newSlots = sessionData.timeSlots;
    const conflict = await this.checkConflicts(sessionData.trainerId, newSlots);
    if (conflict?.hasConflict) throw new AppError(conflict.message, STATUS_CODE.ERROR.CONFLICT);

    const requestTimezone = getTimezone(); //Trainer's current timezone)

    let sessionTimezone = requestTimezone;

    if (sessionData.mode === SESSION_MODE.OFFLINE && sessionData.venue?.location?.coordinates) {
      const [longitude, latitude] = sessionData.venue.location.coordinates;

      try {
        // Resolve timezone directly from lat/long coordinates
        sessionTimezone = tz_lookup(latitude, longitude);
      } catch (err) {
        console.warn('Failed to resolve venue timezone from coordinates, falling back to trainer timezone', err);
        sessionTimezone = requestTimezone;
      }
    }
    const data = await this._fitnessSessionRepo.create({
      ...sessionData,
      timezone: sessionTimezone,
    });
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.CREATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toFitnessSessionResponseDTO(data);
    return session;
  }

  //--------update session-----------
  async updateFitnessSession(id: string, sessionData: Partial<IFitnessSession>): Promise<FitnessSessionResponseDTO> {
    //check timeslots are within trainer working hours
    this._trainerService.checkWithinWorkingHours(sessionData);

    //check for conflict with existing session's timeslots
    const newSlots = sessionData.timeSlots;
    const conflict = await this.checkConflicts(sessionData.trainerId, newSlots, id);
    if (conflict?.hasConflict) throw new AppError(conflict.message, STATUS_CODE.ERROR.CONFLICT);
    const requestTimezone = getTimezone(); //(Trainer's current timezone)

    let sessionTimezone = requestTimezone;
    if (sessionData.venue?.location?.coordinates && sessionData.mode === SESSION_MODE.OFFLINE) {
      const [longitude, latitude] = sessionData.venue.location.coordinates;

      try {
        // Recalculate and update the timezone based on the new location
        sessionTimezone = tz_lookup(latitude, longitude);
      } catch (err) {
        console.warn('Failed to resolve timezone from new coordinates:', err);
      }
    }
    const data = await this._fitnessSessionRepo.updateSession(id, { ...sessionData, timeZone: sessionTimezone });
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }
    const session = toFitnessSessionResponseDTO(data);
    return session;
  }

  //-------delete session---------
  async deleteFitnessSession(id: string, cancelledBy: UserRole): Promise<FitnessSessionResponseDTO> {
    const bookingSessions = await this._bookingService.getBookedSessionsBySessionId(id);
    // ---no bookings
    if (bookingSessions.length === 0) {
      const data = await this._fitnessSessionRepo.deleteASession(id);

      if (!data) {
        throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
      }
      const session = toFitnessSessionResponseDTO(data);
      return session;
    }
    // ----with bookings
    const cancellationWindow = bookingSessions[0].session.cancellationWindow;
    const withinWindow = bookingSessions.some((bookingSession) =>
      this._bookingService.isWithinCancellationWindow(bookingSession.date.toString(), bookingSession.startTime, bookingSession.session.cancellationWindow, bookingSession.timezone)
    );
    if (withinWindow) {
      throw new AppError(`Cannot delete — one or more booked sessions are within the ${cancellationWindow}hr cancellation window`, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    await Promise.all(
      bookingSessions.map(async (bookingSession) => {
        const sessionBookingId = bookingSession.id;

        const reason = 'Cancelled by trainer';

        await this._bookingService.cancelSession(sessionBookingId, reason, cancelledBy);
      })
    );
    //  apply penalty once PER OCCURRENCE,
    if (cancelledBy === UserRole.TRAINER) {
      const occurrenceGroups = groupByOccurrence(bookingSessions); // group by slotId + startDateTime
      await Promise.all(
        occurrenceGroups.map((group) => {
          const sessionRevenue = group.bookings.reduce((sum, b) => sum + b.unitPrice, 0);
          return this._penaltyService.applyPenalty(
            group.trainerId,
            id, // sessionId (template)
            group.slotId,
            group.startDateTime,
            sessionRevenue
          );
        })
      );
    }

    const data = await this._fitnessSessionRepo.deleteASession(id);

    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toFitnessSessionResponseDTO(data);
    return session;
  }
  //--------------make active/inactive session ----------
  async updateSessionVisibility(id: string | Types.ObjectId, isActive: boolean): Promise<FitnessSessionResponseDTO> {
    const data = await this._fitnessSessionRepo.findOneAndUpdate(id, { isActive: isActive });
    if (!data) {
      throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.BAD_REQUEST);
    }
    const session = toFitnessSessionResponseDTO(data);
    return session;
  }

  //-------------- get all sessions by a trianerId--------------
  async getSessionsByTrainer(userId: string | Types.ObjectId, filters: FilterQuery<IFitnessSession>): Promise<PaginatedFitnessSessionsResponseDTO> {
    const trainer = await this._trainerService.getTrainerByUserId(userId.toString());
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const { search, page, limit } = filters;
    const query: FilterQuery<IFitnessSession> = { trainerId: trainer.id, isDeleted: false, page: page, limit: limit };
    if (search) {
      query.$or = [
        { sessionName: { $regex: search, $options: 'i' } },
        { sessionType: { $regex: search, $options: 'i' } },
        { intensityLevel: { $regex: search, $options: 'i' } },
        { mode: { $regex: search, $options: 'i' } },
      ];
    }
    const isNumber = !isNaN(Number(search));
    if (isNumber && search !== '') {
      query.$or.push({ duration: Number(search) });
    }
    const result = await this._fitnessSessionRepo.findByTrainer(query);
    const sessionData = result?.sessions || [];
    const sessions = sessionData.map((session) => toFitnessSessionResponseDTO(session));
    return { sessions, pagination: result.pagination };
  }

  //--------------- get all sessions--public------------
  async getAllSessions(filters: FilterQuery<IFitnessSession>): Promise<GetFitnessSessionsResponseDTO> {
    const { page, limit, search, program, sessionType, sessionMode, ageGroup, rating, lat, lng, radius } = filters;

    const query: FilterQuery<IFitnessSession> = { isDeleted: false, isApproved: true, isActive: true };

    if (search) {
      query.$or = [{ sessionName: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    }
    if (program && program !== 'all') query.fitnessCategory = program;
    if (sessionType && sessionType !== 'all') query.sessionType = sessionType;
    if (sessionMode && sessionMode !== 'all') query.mode = sessionMode;
    if (ageGroup && ageGroup !== 'all') query.ageGroup = ageGroup;
    if (rating && rating !== 'all') query.rating = { $gte: Number(rating) };

    if (lat && lng && radius) {
      query['venue.location'] = {
        $geoWithin: {
          $centerSphere: [
            [Number(lng), Number(lat)], // [longitude, latitude]
            radius / 6371,
          ],
        },
      };
    }
    const result = await this._fitnessSessionRepo.findAll(query, { page: Number(page) || 1, limit: Number(limit) || PAGINATION_LIMIT });
    const sessionData = result?.sessions || [];

    const sessions = sessionData.map((session) => toFitnessSessionPublicDTO(session));
    return { sessions, pagination: result.pagination };
  }

  // ---------------------get  a session by ID-public-------------
  async getASession(id: string | Types.ObjectId): Promise<FitnessSessionDetailedPublicDTO> {
    const sessionData = await this._fitnessSessionRepo.findBysessionId(id);

    const session = toFitnessSessionDetailedPublicDTO(sessionData);
    return session;
  }

  // -------------Find any session belonging to this trainer that has an overlap---------------
  checkConflicts = async (trainerId, newTimeSlots, sessionId: string | null = null) => {
    for (const dayEntry of newTimeSlots) {
      const { day, slots } = dayEntry;
      for (const slot of slots) {
        const query: FilterQuery<IFitnessSession> = {
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
        const conflict = await this._fitnessSessionRepo.findOne(query);

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
}
