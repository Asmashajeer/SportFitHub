import { STATUS_CODE } from "@/constants/messages";
import { IStripeConnectService } from "@/interfaces/services/trainer/IStripeConnect.service";
import { AuthRequest } from "@/middleware/auth.middleware";
import { Request, Response,NextFunction } from "express";

export class StripeConnectController {
    private _stripeConnectService: IStripeConnectService
  constructor(stripeConnectService: IStripeConnectService) {
    this._stripeConnectService=stripeConnectService
  }

  connect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const trainerId = req.query.trainerId as string; // from auth middleware
      const email = req.user.email;
      await this._stripeConnectService.createConnectAccount(trainerId, email);
      const url = await this._stripeConnectService.generateOnboardingLink(trainerId);
      res.status(STATUS_CODE.SUCCESS.OK).json({ url });
    } catch (err) {
      next(err);
    }
  };

  status = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainerId = req.query.trainerId as string;
      const complete = await this._stripeConnectService.checkOnboardingStatus(trainerId);
      res.status(STATUS_CODE.SUCCESS.OK).json( complete );
    } catch (err) {
      next(err);
    }
  };

  regenerateLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainerId = req.query.trainerId as string;
      const url = await this._stripeConnectService.generateOnboardingLink(trainerId);
        res.status(STATUS_CODE.SUCCESS.OK).json({ url });
    } catch (err) {
      next(err);
    }
  };
}