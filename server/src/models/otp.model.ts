import { timeStamp } from "console";
import  mongoose, { Schema ,Document, Types} from "mongoose";
import { object } from "zod";

export enum OtpType{
    VERIFICATION = 'VERIFICATION',
    PASSWORD_RESET = 'PASSWORD_RESET',
};

export interface IOtp extends Document{
    userId:Types.ObjectId,
    code:string,
    type:OtpType,
    expiresAt:Date,
    createdAt:Date,
};


const OtpSchema=new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code:{type:String,
        required:true
        },
    type:{type:String,
        enum:Object.values(OtpType),
        required:true,
    },
    expiresAt:{type:Date,
            required:true,
    }
},
    {timestamps:true},
);

//TTL index

OtpSchema.index({expiresAt:1},{expireAfterSeconds:0});


export default mongoose.model<IOtp>('OtpModel',OtpSchema)