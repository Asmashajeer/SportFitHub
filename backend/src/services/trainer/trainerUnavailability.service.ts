import { DAYS_OF_WEEK, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { CancelAvailabilityDto } from '@/dtos/request/trainer/trainer.unavailability.request';
import { UnavailableDayResponseDto } from '@/dtos/response/trainer/trainer.unavailablity.dto';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ITrainerUnavailabilityRepository } from '@/interfaces/repositories/ITrainerUnavalability.repository';
import { ITrainerUnavailabilityService } from '@/interfaces/services/trainer/ITrainerUnavailability.service';
import { toUnavailableDayDto } from '@/mappers/trainer/trainer.unavailability.mappers';

import AppError from '@/utils/AppError';
import { isRealDate, toDateStr } from '@/utils/formatTo';
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

  async cancelAvailability(userId: string, payload: CancelAvailabilityDto) {
    const {date,selectedSlot,isFullDay,reason}=payload;
    if (!isRealDate(date)) throw new AppError('Date ' + ERROR_MESSAGES.GENERAL.INVALID, STATUS_CODE.ERROR.BAD_REQUEST);

    const trainer = await this.getTrainer(userId);
    const a = trainer.availability;
   

    if (date <= toDateStr(new Date())) throw new AppError('Cannot select a past date', STATUS_CODE.ERROR.BAD_REQUEST);
    if (a.effectiveFrom && date < toDateStr(a.effectiveFrom)) throw new AppError('Date is before your availability starts', STATUS_CODE.ERROR.BAD_REQUEST);
    if (a.effectiveTo && date > toDateStr(a.effectiveTo)) throw new AppError('Date is after your availability ends', STATUS_CODE.ERROR.BAD_REQUEST);

    const day = new Date(`${date}T00:00:00Z`).getUTCDay();
    if (!a.weeklySchedule[day]?.isAvailable) throw new AppError('This is not one of your working days', STATUS_CODE.ERROR.BAD_REQUEST);

    const utcDate = new Date(`${date}T00:00:00.000Z`);
    if(isFullDay){
      const bookingCount = await this._bookingSessionRepo.countActiveByTrainerAndDate(String(trainer._id), utcDate);
      if (bookingCount > 0) {
        throw new AppError(
          `You have ${bookingCount} booking(s) on this date. Cancel them first before marking the day unavailable.`,
          STATUS_CODE.ERROR.CONFLICT
        );
      }
      const canceledDay = await this._trainerUnavailabilityRepo.upsertFullDayUnavailability(trainer._id.toString(),utcDate,reason);
      
      return toUnavailableDayDto(canceledDay);
    }
    if (!isFullDay && selectedSlot) {
      const bookingCount = await this._bookingSessionRepo.countActiveByTrainerAndDate_slot(String(trainer._id), utcDate, selectedSlot);
      if (bookingCount > 0) {
        throw new AppError(
          `You have ${bookingCount} booking(s) on this selected slot of this date. Cancel them first before marking the day unavailable.`,
          STATUS_CODE.ERROR.CONFLICT
        );
      }

      try {
        // Fetch any existing exception record for this date
        const existingRecord = await this._trainerUnavailabilityRepo.findByTrainerAndDate(trainer._id.toString(), utcDate);

        // If the day is already marked fully blocked
        if (existingRecord?.isFullDay) {
          throw new AppError('This date is already marked fully unavailable', STATUS_CODE.ERROR.CONFLICT);
        }

        //  Gather existing blocked slots and check for duplicates 
        const existingSlots = existingRecord?.slots || [];  
        const isAlreadyBlocked = existingSlots.some(
          (s) => s.startTime === selectedSlot.startTime && s.endTime === selectedSlot.endTime
        );

        if (isAlreadyBlocked) {
          throw new AppError('This slot is already marked unavailable', STATUS_CODE.ERROR.CONFLICT);
        }

        const updatedSlots = [...existingSlots, selectedSlot];
        const day = new Date(`${date}T00:00:00Z`).getUTCDay();
        const totalWorkingSlotsCount = a.weeklySchedule[day]?.slots.length;
        
        let canceledDay;

        // . Check if all available slots for this day are now blocked
        if (updatedSlots.length >= totalWorkingSlotsCount) {
          // Auto-upgrade to Full Day!
          canceledDay = await this._trainerUnavailabilityRepo.upsertFullDayUnavailability(
            trainer._id.toString(), 
            utcDate, 
            reason
          );
        } else {
          // Save as individual slot update
          canceledDay = await this._trainerUnavailabilityRepo.upsertUnavailableSlot(
            trainer._id.toString(), 
            utcDate, 
            selectedSlot, 
            reason
          );
        }
       
        return toUnavailableDayDto(canceledDay);
      } catch (err) {
        if (err instanceof AppError) throw err;
        if (err?.code === 11000) {
          throw new AppError('This date or slot is already marked unavailable', STATUS_CODE.ERROR.CONFLICT);
        }
        throw err;
      }
    }
    
  }

  async restoreAvailability(userId: string, date: string) {
    if (!isRealDate(date)) throw new AppError('Invalid date', STATUS_CODE.ERROR.BAD_REQUEST);
    const trainer = await this.getTrainer(userId);
    const utcDate = new Date(`${date}T00:00:00.000Z`);
    const result = await this._trainerUnavailabilityRepo.deleteDate(trainer._id.toString(), utcDate);
   
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
