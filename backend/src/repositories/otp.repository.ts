import { IOtp } from "@/models/otp.model";
import { OtpType } from "@/constants/enums";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { IOtpRepository } from "@/interfaces/repositories/IOtp.repository";

export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository{
    constructor(model:Model<IOtp>){
        super(model);
    }
    async createOtp(userId: string, code: string, type:OtpType): Promise<IOtp> {
            return await this.model.findOneAndUpdate(
           { userId, type }, // user and type specifies purpose
            { 
                $set: { 
                code, 
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
                } 
            }, 
            { 
                upsert: true, //  Create it if it doesn't exist
                new: true,    
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