import { IOtp } from '@/models/otp.model';
import { OtpType } from '@/constants/enums';
import { IBaseRepository } from './IBase.repository';

export interface IOtpRepository extends IBaseRepository<IOtp> {
  createOtp(userId: string, code: string, type: OtpType): Promise<IOtp>;

  findOtp(userId: string, type: OtpType): Promise<IOtp | null>;

  deleteOtp(userId: string, type: OtpType): Promise<void>;
}
