import type { GenderType, RelationType } from "@/constants/constants";

export interface ProfilePicResponse {
    success: true,
    profilePic:string, 
}
export interface ProfileResponse {
    fullName: string;
    DOB: Date;
    gender: GenderType;
    phone: string;
    relationship: RelationType;
    address?: {
    street?: string;
    city?: string;
    zip?: string;
    };
    location?: {   
    coordinates: [number, number];
    };
    profilePic: string;
    isPrimary: boolean;
    createdAt:Date;
    updatedAt:Date
}