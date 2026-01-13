
import { IUser } from '@/models/user.model';
import { BaseRepository } from '@/repositories/base.repository';
import { Types } from 'mongoose';

export interface IUserRepository extends BaseRepository<IUser> {
  create(userData: Partial<IUser>): Promise<IUser>;
  
  findByEmail(email: string,isActive?:boolean,isBlocked?:boolean): Promise<IUser | null>;
 findById(id: string, isActive?: boolean): Promise<IUser | null>
  findByRole(role: string,isActive:boolean): Promise<IUser[]>
 findAll( page: number, limit: number): Promise<IUser[]>;
 updateVerificationStatus(id:string | Types.ObjectId,status:boolean): Promise<IUser | null>;
 updatePassword(id:string | Types.ObjectId,password:string): Promise<IUser | null>;
  blockUser(id: string|Types.ObjectId, isBlocked: boolean): Promise<IUser | null>;
  deleteUser(id: string): Promise<IUser | null>;
}
