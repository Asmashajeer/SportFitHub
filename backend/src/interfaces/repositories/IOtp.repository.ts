import { IOtp, OtpType } from '@/models/otp.model';
import { BaseRepository } from '@/repositories/base.repository';

export interface IOtpRepository extends BaseRepository<IOtp> {
  createOtp(userId: string, code: string, type: OtpType): Promise<IOtp>;

  findOtp(userId: string, type: OtpType): Promise<IOtp | null>;

  deleteOtp(userId: string, type: OtpType): Promise<void>;
}
