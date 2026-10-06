import { DAYS_OF_WEEK, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { CancelAvailabilityDto } from '@/dtos/request/trainer/trainer.unavailability.request';
import { UnavailableDayResponseDto } from '@/dtos/response/trainer/trainer.unavailablity.dto';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ITrainerUnavailabilityRepository } from '@/interfaces/repositories/ITrainerUnavalability.repository';
import { ITrainerUnavailabilityService } from '@/interfaces/services/trainer/ITrainerUnavailability.service';
import { toUnavailableDayDto } from '@/mappers/trainer/trainr.unavailability.mappers';

import AppError from '@/utils/AppError';
import { isRealDate, toDateStr, toUTC_Date } from '@/utils/formatTo';
import { formatInTimeZone } from 'date-fns-tz';

export class TrainerUnavailabilityService implements ITrainerUnavailabilityService {
  private _trainerUnavailabilityRepo: ITrainerUnavailabilityRepository;
  private _trainerRepo: ITrainerRepository;
  private _bookingSessionRepo:IBookingSessionRepository
  constructor(trainerUnavailabilityRepo: ITrainerUnavailabilityRepository, trainerRepo: ITrainerRepository,bookingSessionRepo:IBookingSessionRepository) {
    this._trainerUnavailabilityRepo = trainerUnavailabilityRepo;
    this._trainerRepo = trainerRepo;
    this._bookingSessionRepo=bookingSessionRepo;
  }

  async getTrainer(userId: string) {
    const trainer = await this._trainerRepo.findByUserId(userId);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    if (trainer.status !== TRAINER_STATUS.APPROVED || trainer.isDeleted) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    return trainer;
  }

  async cancelAvailability(userId: string, { date, reason }: CancelAvailabilityDto) {
    if (!isRealDate(date)) throw new AppError('Date ' + ERROR_MESSAGES.GENERAL.INVALID, STATUS_CODE.ERROR.BAD_REQUEST);

    const trainer = await this.getTrainer(userId);
    const a = trainer.availability;
    const tz = a.timezone || 'UTC';

    if (date <= toDateStr(new Date())) throw new AppError('Cannot select a past date', STATUS_CODE.ERROR.BAD_REQUEST);
    if (!a.isAvailable) throw new AppError('Your availability is turned off', STATUS_CODE.ERROR.BAD_REQUEST);
    if (a.effectiveFrom && date < toDateStr(a.effectiveFrom)) throw new AppError('Date is before your availability starts', STATUS_CODE.ERROR.BAD_REQUEST);
    if (a.effectiveTo && date > toDateStr(a.effectiveTo)) throw new AppError('Date is after your availability ends', STATUS_CODE.ERROR.BAD_REQUEST);

    const dayName = DAYS_OF_WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()];
    if (!a[dayName]?.available) throw new AppError('This is not one of your working days', STATUS_CODE.ERROR.BAD_REQUEST);

    const utcDate = new Date(`${date}T00:00:00.000Z`);
    const bookingCount = await this._bookingSessionRepo.countActiveByTrainerAndDate(String(trainer._id), utcDate);
    if (bookingCount > 0) {
      throw new AppError(
        `You have ${bookingCount} booking(s) on this date. Cancel them first before marking the day unavailable.`,
        STATUS_CODE.ERROR.CONFLICT
      );
    }
    try {
      const canceledDay = await this._trainerUnavailabilityRepo.createUnavailableDate(trainer._id.toString(), utcDate, reason);
      return toUnavailableDayDto(canceledDay);
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new AppError('This date is already marked unavailable', STATUS_CODE.ERROR.CONFLICT);
      }
      throw err;
    }
  }

  async restoreAvailability(userId: string, date: string) {
    if (!isRealDate(date)) throw new AppError('Invalid date', STATUS_CODE.ERROR.BAD_REQUEST);
    const trainer = await this.getTrainer(userId);
    const utcDate = new Date(`${date}T00:00:00.000Z`);
    const result = await this._trainerUnavailabilityRepo.deleteDate(trainer._id.toString(), utcDate);
    console.log('utcDate', utcDate);
    if (result.deletedCount === 0) throw new AppError('That date was not marked unavailable', STATUS_CODE.ERROR.NOT_FOUND);
  }

  async getUnavailability(userId: string): Promise<UnavailableDayResponseDto[]> {
    const trainer = await this.getTrainer(userId);
    const today = formatInTimeZone(new Date(), trainer.availability.timezone || 'UTC', 'yyyy-MM-dd');
    const UnavailableDays = await this._trainerUnavailabilityRepo.findUpcoming(String(trainer._id), new Date(today));
    return UnavailableDays.map((d) => toUnavailableDayDto(d));
  }

  // public
  async getPublicUnavailableDates(trainerId: string): Promise<string[]> {
    const trainer = await this._trainerRepo.findById(trainerId);
    if (!trainer || trainer.isDeleted || trainer.status !== TRAINER_STATUS.APPROVED) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const tz = trainer.availability.timezone || 'UTC';
    const todayStr = formatInTimeZone(new Date(), tz, 'yyyy-MM-dd');
    const days = await this._trainerUnavailabilityRepo.findUpcoming(String(trainer._id), new Date(`${todayStr}T00:00:00.000Z`));
    return days.map((d) => new Date(d.date).toISOString().slice(0, 10)); 
  }
}
