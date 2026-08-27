import { STATUS_CODE } from '@/constants/messages';
import { getTimezone } from '@/context/timezone.context';
import { IPaymentsManagementService } from '@/interfaces/services/admin/IPaymentsManagement.service';
import { Request, Response, NextFunction } from 'express';

export class PaymentsManagementController {
  private _paymentsManagementService: IPaymentsManagementService;
  constructor(paymentsManagementService: IPaymentsManagementService) {
    this._paymentsManagementService = paymentsManagementService;
  }


  getpaymentsStats=async (req: Request, res: Response, next: NextFunction) => {    
   const dateRange = req.query.dateRange? JSON.parse(req.query.dateRange as string) as {
     startDate: Date;
     endDate: Date;
   }:null;
   try {
      const paymentsStats = await this._paymentsManagementService.getPaymentsOverview(dateRange);

      res.status(STATUS_CODE.SUCCESS.OK).json(paymentsStats);
    } catch (err) {
      next(err);
    }
  }


  //--------------get user payments- by admin---------
  getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const search = req.query.search as string;
    const date=req.query.date as string;
    const status = req.query.status as string;

    const timezone = getTimezone();
    try {
      const paymentsData = await this._paymentsManagementService.getAllPayments(timezone,{ page, limit, search, status, date });

      res.status(STATUS_CODE.SUCCESS.OK).json(paymentsData);
    } catch (err) {
      next(err);
    }
  };
}
