import { STATUS_CODE } from "@/constants/messages";
import { ISettingsService } from "@/interfaces/services/admin/ISettings.service";
import {Request,Response, NextFunction } from "express";

export class SettingsController {
  private _settingsService: ISettingsService;
  constructor(settingsService: ISettingsService) {
    this._settingsService = settingsService;
  }

   getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this._settingsService.getSettings();
      res.status(STATUS_CODE.SUCCESS.OK).json(settings);
    } catch (err) {
      next(err);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    try {
      const updated = await this._settingsService.updateSettings(req.body);
      res.status(STATUS_CODE.SUCCESS.OK).json(updated);
    } catch (err) {
      next(err);
    }
  };
}