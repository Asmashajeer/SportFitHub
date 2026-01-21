import { UserRole } from "@/models/user.model";

export interface usersResposeDTO{
    id:string,
    email: string, 
    password:string,
    role: UserRole,
    googleId?: string,
    isVerified:boolean,
    isBlocked: boolean,
    isActive: boolean,
    createdAt: string
}
export interface userStatsResponseDTO{  
  totalUsers?:number,
  activeUsers?:number,
  blockedUsers?:number
}