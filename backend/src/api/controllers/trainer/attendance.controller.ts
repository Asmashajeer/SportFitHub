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

    const sessionModel = req.query.sessionModel as PAYLOAD_MODEL;
    
    // const status = req.query.status as string;
    const attendanceMarked=req.query.attendanceMarked ==='true';
    console.log("----",typeof req.query.attendanceMarked,typeof attendanceMarked,"----");
    try {
      const bookings = await this._attendanceService.getSessionOccurrences({ trainerId,  sessionModel, attendanceMarked });
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
