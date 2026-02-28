import { IUserManagementService } from '../../../interfaces/services/admin/IUserManagement.service';
import { STATUS_CODE, SUCCESS_MESSAGES } from '../../../constants/messages';
import { Request, Response, NextFunction } from 'express';
import Logger from '@/utils/logger';

export class UserManagementController {
  private _userManagementService: IUserManagementService;
  constructor(userManagementService: IUserManagementService) {
    this._userManagementService = userManagementService;
  }

  // --fetch all users
  getAllusers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const role = req.query.role as string;

      const limit = parseInt(req.query.limit as string) || 5;
      const usersData = await this._userManagementService.getUsers({
        page,
        limit,
        search,
        status,
        role,
      });
      res.status(STATUS_CODE.SUCCESS.OK).json(usersData);
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userStats = await this._userManagementService.getStats();
      res.status(STATUS_CODE.SUCCESS.OK).json({ userStats });
    } catch (error) {
      next(error);
    }
  };
  // block or unblock user
  toggleBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.body.id;
      const user = await this._userManagementService.toggleBlock(id);
      if (user.isBlocked) Logger.warn(`admin Blocked the user${user.email} `);
      else {
        Logger.info(`Admin released the block successfully for user ${user.email} status `, {
          Blocked: user.isBlocked,
        });
      }
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USER.USER_BLOCKED,
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  };

  //  delete a user
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const user = await this._userManagementService.deleteUser(id);
      Logger.info(`Admin deleted the  user ${user.role} `, {
        userId: id,
        name: user.name,
        email: user.email,
      });
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USER.USER_DELETED,
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  };
  updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, selectedRole } = req.body;
      console.log(id, selectedRole);
      const user = await this._userManagementService.updateRole(id, selectedRole);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.AUTH.ROLE_UPDATED,
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
