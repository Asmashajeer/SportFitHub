import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { IDashboardService } from '@/interfaces/services/admin/IDashboardService';
import { BookingDataMetricDTO, DashboardStats, RecentBookingDTO, RevenuePoint } from '@/dtos/response/admin/dashboard.dto';
import { toRecentBookingsDTO } from '@/mappers/admin/admin.dashboard.mappers';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';

export class DashboardService implements IDashboardService {
  private _userRepo: IUserRepository;
  private _trainerRepo: ITrainerRepository;
  private _sportsSessionRepo: ISportsSessionRepository;
  private _fitnessSessionRepo: IFitnessSessionRepository;
  private _paymentRepo: IPaymentRepository;
  private _bookingSessionRepo: IBookingSessionRepository;
  constructor(
    userRepo: IUserRepository,
    trainerRepo: ITrainerRepository,
    sportsSessionRepo: ISportsSessionRepository,
    fitnessSessionRepo: IFitnessSessionRepository,
    paymentRepo: IPaymentRepository,
    bookingSessionRepo: IBookingSessionRepository
  ) {
    this._userRepo = userRepo;
    this._trainerRepo = trainerRepo;
    this._sportsSessionRepo = sportsSessionRepo;
    this._fitnessSessionRepo = fitnessSessionRepo;
    this._paymentRepo = paymentRepo;
    this._bookingSessionRepo = bookingSessionRepo;
  }
  // stats
  async getStats(): Promise<DashboardStats> {
    const [totalUsers, activeTrainers, sportsSessions, fitnessSessions, revenue] = await Promise.all([
      this._userRepo.countOfUsers(),
      this._trainerRepo.countActiveTrainers(),
      this._sportsSessionRepo.countActiveSessions(),
      this._fitnessSessionRepo.countActiveSessions(),
      this._paymentRepo.sumRevenue(),
    ]);
    const totalSessions = sportsSessions + fitnessSessions;
    return { totalUsers, activeTrainers, totalSessions, revenue };
  }

  //weekly revenue
  async getWeeklyRevenue(): Promise<RevenuePoint[]> {
    return this._paymentRepo.getWeeklyRevenue();
  }


  // recent bookings
  async getRecentBookings(): Promise<RecentBookingDTO[]> {
    const limit = 5;
    const bookings = await this._bookingSessionRepo.getRecentBookings(limit);   
    return bookings.map((b) => toRecentBookingsDTO(b));
  }


  //booking category  metrics
  async getBookingCategoryMetrics(startDate?: Date, endDate?: Date): Promise<BookingDataMetricDTO[]> {
    const bookingMetrics = await this._bookingSessionRepo.getBookingCategoryMetrics(startDate, endDate);
    console.log(bookingMetrics);
    return bookingMetrics;
  }
}
