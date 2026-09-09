import { NextFunction, Request, Response } from 'express';
import { IDashboardService } from '@/interfaces/services/admin/IDashboardService';
import { STATUS_CODE } from '@/constants/messages';

export class AdminDashboardController {
  private _dashboardService: IDashboardService;
  constructor(dashboardService: IDashboardService) {
    this._dashboardService = dashboardService;
  }

  //stats
  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this._dashboardService.getStats();
      res.status(STATUS_CODE.SUCCESS.OK).json(stats);
    } catch (err) {
      next(err);
    }
  };

  //revennue
  getWeeklyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._dashboardService.getWeeklyRevenue();
      res.status(STATUS_CODE.SUCCESS.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  //recent booking
  getRecentBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._dashboardService.getRecentBookings();
      res.status(STATUS_CODE.SUCCESS.OK).json(data);
    } catch (err) {
      next(err);
    }
  };

  getBookingCategoryMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
     
      const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
      const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

      const bookingMetrics = await this._dashboardService.getBookingCategoryMetrics(parsedStartDate, parsedEndDate);
      res.status(STATUS_CODE.SUCCESS.OK).json(bookingMetrics);
    } catch (err) {
      next(err);
    }
  };
}
