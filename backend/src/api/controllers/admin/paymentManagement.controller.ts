import { STATUS_CODE } from '@/constants/messages';
import { IPaymentsManagementService } from '@/interfaces/services/admin/IPaymentsManagement.service';
import { Request, Response, NextFunction } from 'express';

export class PaymentsManagementController {
  private _paymentsManagementService: IPaymentsManagementService;
  constructor(paymentsManagementService: IPaymentsManagementService) {
    this._paymentsManagementService = paymentsManagementService;
  }

  
  //--------------get user payments- by admin---------
  getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      const payments = await this._paymentsManagementService.getAllPayments();

      res.status(STATUS_CODE.SUCCESS.OK).json(payments);
    } catch (err) {
      next(err);
    }
  };
}
