import { STATUS_CODE } from '@/constants/messages';
import { IBookingsManagementService } from '@/interfaces/services/admin/IBookingsManagement.service';
import { NextFunction, Request, Response } from 'express';

export class BookingsManagementController {
  private _bookingsManagementService: IBookingsManagementService;
  constructor(bookingsManagementService: IBookingsManagementService) {
    this._bookingsManagementService = bookingsManagementService;
  }

  //---------------get bookings Stats---------
  getBookingsStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingsStats = await this._bookingsManagementService.getBookingstats();

      res.status(STATUS_CODE.SUCCESS.OK).json(bookingsStats);
    } catch (error) {
      next(error);
    }
  };

  //---------------get Bookings---------
  getBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sessionModel = req.query.sessionModel as string;

    try {
      const bookingsData = await this._bookingsManagementService.getBookings({ page, limit, search, status, sessionModel });

      res.status(STATUS_CODE.SUCCESS.OK).json({ bookingsData });
    } catch (error) {
      next(error);
    }
  };

  //-------------Booking Details by Id-----------------
  getBookingDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id as string;
    console.log();

    try {
      const booking = await this._bookingsManagementService.getBookingDetails(id);

      res.status(STATUS_CODE.SUCCESS.OK).json({ booking });
    } catch (error) {
      next(error);
    }
  };
}
