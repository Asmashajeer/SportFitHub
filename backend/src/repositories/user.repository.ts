import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IUser } from '../models/user.model';
import { UserRole } from '@/constants/enums';
import { BaseRepository } from './base.repository';
import { FilterQuery, Model, Types } from 'mongoose';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(model: Model<IUser>) {
    super(model);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new this.model(userData);
    return await user.save();
  }

  async findByEmail(email: string, isActive?: boolean, isBlocked?: boolean): Promise<IUser | null> {
    const query: FilterQuery<IUser> = { email };
    if (isActive !== undefined) query.isActive = isActive;
    if (isBlocked !== undefined) query.isBlocked = isBlocked;
    return await this.model.findOne(query).exec();
  }

  async findById(id: string, isActive?: boolean): Promise<IUser | null> {
    const query: FilterQuery<IUser> = { _id: id };
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    return await this.model.findOne(query).exec();
  }

  async findByRole(role: string): Promise<IUser[]> {
    const query: FilterQuery<IUser> = {
      role,
      isActive: true,
    };
    return await this.model.find(query).exec();
  }

  async findAll(
    filter: FilterQuery<IUser> = {},
    options: { skip: number; limit: number }
  ): Promise<IUser[]> {
    return await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
  }
  async countOfUsers(FilterQuery: object = {}): Promise<number> {
    const query: FilterQuery<IUser> = { ...FilterQuery, role: { $ne: 'admin' } };
    return await this.model.countDocuments(query);
  }

  async updateVerificationStatus(
    id: string | Types.ObjectId,
    status: boolean
  ): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(id, { $set: { isVerified: status } }, { new: true })
      .exec();
  }
  async blockUser(id: string | Types.ObjectId, isBlocked: boolean): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(id, { $set: { isBlocked: isBlocked } }, { new: true })
      .exec();
  }

  async updatePassword(id: string | Types.ObjectId, password: string): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(id, { $set: { password: password } }, { new: true })
      .exec();
  }
  async updateRole(id: string | Types.ObjectId, role: UserRole): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, { $set: { role: role } }, { new: true }).exec();
  }
  async softDeleteUser(id: string | Types.ObjectId): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(id, { $set: { isActive: false,isBlocked:true } }, { new: true })
      .exec();
  }


    async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
       await this.model.findByIdAndUpdate(userId, { fcmToken });
    }


    async findFcmTokenByUserId(userId: string): Promise<string | null> {
      const user = await this.model.findById(userId).select('fcmToken');
      return user?.fcmToken ?? null;
    }
}
