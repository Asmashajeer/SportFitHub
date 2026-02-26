import { UserRole } from '@/constants/enums';
import { getAllusersResponseDTO, usersResposeDTO, userStatsResponseDTO } from '../../dtos/response/admin/user.dto';
import { IUserRepository } from '../../interfaces/repositories/IUser.repository';
import { IUserManagementService } from '../../interfaces/services/admin/IUserManagement.service';
import { toUsersResponseData } from '../../mappers/user.mapper';
import AppError from '../../utils/AppError';
import { ERROR_MESSAGES, STATUS_CODE } from '../../constants/messages';
import { getAllUsersRequestDTO } from '@/dtos/request/admin/admin.user.request.dto';
import { FilterQuery } from 'mongoose';
import { IUser } from '@/models/user.model';

export class UserManagementService implements IUserManagementService {
  private _userRepo: IUserRepository;
  constructor(userRepo: IUserRepository) {
    this._userRepo = userRepo;
  }
  getUsers = async (filters: getAllUsersRequestDTO): Promise<getAllusersResponseDTO> => {
    const { page, limit, search, status, role } = filters;

    const skip = (page - 1) * limit;
    const query:  FilterQuery<IUser> = {};
    if (search) {
      query.$or=[
       { email : { $regex: search, $options: 'i' }},
       { name:{ $regex: search, $options: 'i' }}
      ];
      
    }
    if (status === 'blocked') {
      query.isBlocked = true;
      query.isActive = true;
    } else if (status === 'active') {
      query.isBlocked = false;
      query.isActive = true;
    } else if (status === 'deleted') {
      query.isBlocked = true;
      query.isActive = false;
    }
    if (!role || role === 'all') {
      query.role = { $ne: 'admin' };
    } else {
      query.role = role;
    }
   
      const [usersData, totalCount] = await Promise.all([
        this._userRepo.findAll(query, { skip, limit }),
        this._userRepo.countOfUsers(query) 
    ]);

      const users: usersResposeDTO[] = usersData.map(user => toUsersResponseData(user));     

        return {
            users,
            total:totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        };    
   
  };
  getStats = async (): Promise<userStatsResponseDTO> => {
 
      const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
        this._userRepo.countOfUsers(),
        this._userRepo.countOfUsers({isActive: true, isBlocked: false }),
        this._userRepo.countOfUsers({isBlocked: true }),
      ]);

      const userStats: userStatsResponseDTO = { totalUsers, activeUsers, blockedUsers };
      return userStats;
   
  };

  toggleBlock = async (id: string): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const isBlocked = !user.isBlocked;
    const data = await this._userRepo.blockUser(user._id, isBlocked);
    const userData = toUsersResponseData(data);
    return userData;
  };
  deleteUser = async (id: string): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const data = await this._userRepo.softDeleteUser(user._id);
    const userData = toUsersResponseData(data);
    return userData;
  };
  updateRole = async (id: string, role: UserRole): Promise<usersResposeDTO> => {
    const user = await this._userRepo.findById(id);
    if (!user) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const data = await this._userRepo.updateRole(user._id, role);
    const userData = toUsersResponseData(data);
    return userData;
  };
}
