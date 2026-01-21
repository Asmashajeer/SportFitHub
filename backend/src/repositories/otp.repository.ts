import { IOtp, OtpType } from "@/models/otp.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { IOtpRepository } from "@/interfaces/repositories/IOtp.repository";

export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository{
    constructor(model:Model<IOtp>){
        super(model);
    }
    async createOtp(userId: string, code: string, type:OtpType): Promise<IOtp> {
            return await this.model.findOneAndUpdate(
           { userId, type }, // 1. Find the OTP for this user and this specific purpose
            { 
                $set: { 
                code, 
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
                } 
            }, // 2. Explicitly set the new code and time
            { 
                upsert: true, // 3. Create it if it doesn't exist
                new: true,    // 4. Return the updated document
                runValidators: true 
            }
            ) as IOtp;
    }

    async findOtp(userId: string, type: OtpType): Promise<IOtp | null> {
        return await this.model.findOne({ userId, type });
    }

    async deleteOtp(userId: string, type: OtpType): Promise<void> {
        await this.model.deleteOne({ userId, type });
    }
}