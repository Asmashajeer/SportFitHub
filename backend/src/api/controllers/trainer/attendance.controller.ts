import { PAYLOAD_MODEL } from '@/constants/enums';
import { STATUS_CODE } from '@/constants/messages';
import { IAttendanceService } from '@/interfaces/services/trainer/IAttendance.service';
import { AuthRequest } from '@/middleware/auth.middleware';

import { Response, NextFunction } from 'express';

export class AttendanceController {
  private _attendanceService: IAttendanceService;
  constructor(attendanceService: IAttendanceService) {
    this._attendanceService = attendanceService;
  }

  getBookedSessionsOccurance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const trainerId = req.query.trainerId as string;
    const page = parseInt(req.query.page as string) || 1;
    const sessionModel = req.query.sessionModel as PAYLOAD_MODEL;
    const date = req.query.date ? (req.query.date as string) : '';
    const status = req.query.status as string;

    try {
      const bookings = await this._attendanceService.getSessionOccurrences({ trainerId, page, sessionModel, date, status });
      res.status(STATUS_CODE.SUCCESS.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  markAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const sessionId = req.params.sessionId as string;
    const records = req.body.records as { bookingSessionId: string; attendance: boolean }[];
    console.log('records:', records);

    try {
      const bookings = await this._attendanceService.markAttendance({ sessionId, records });
      res.status(STATUS_CODE.SUCCESS.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  };
}
