import { UserRole } from '@/constants/enums';
import { IUser } from '@/models/user.model';
import { BaseRepository } from '@/repositories/base.repository';
import { FilterQuery, Types } from 'mongoose';

export interface IUserRepository extends BaseRepository<IUser> {
  create(userData: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string, isActive?: boolean, isBlocked?: boolean): Promise<IUser | null>;
  findById(id: string, isActive?: boolean): Promise<IUser | null>;
  findByRole(role: string): Promise<IUser[]>;
  findAll(filter: FilterQuery<IUser>, options: { skip: number; limit: number }): Promise<IUser[]>;
  countOfUsers(FilterQuery?: object): Promise<number>;
  updateVerificationStatus(id: string | Types.ObjectId, status: boolean): Promise<IUser | null>;
  updatePassword(id: string | Types.ObjectId, password: string): Promise<IUser | null>;
  blockUser(id: string | Types.ObjectId, isBlocked: boolean): Promise<IUser | null>;
  updateRole(id: string | Types.ObjectId, role: UserRole): Promise<IUser | null>;
  softDeleteUser(id: string | Types.ObjectId): Promise<IUser | null>;
   updateFcmToken(userId: string, fcmToken: string): Promise<void>
   findFcmTokenByUserId(userId: string): Promise<string | null> 
}
