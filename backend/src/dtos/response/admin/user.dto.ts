import { UserRole } from "@/models/user.model";

export interface usersResposeDTO{
    id:string,
    name:string,
    email: string, 
   
    role: UserRole,
    googleId?: string,
    isVerified:boolean,
    isBlocked: boolean,
    isActive: boolean,
    createdAt: string
}
export interface userResposeDTO extends  usersResposeDTO{
     password:string,
}


export interface getAllusersResponseDTO {
        users:usersResposeDTO[],
        total:number
        totalPages: number,
        currentPage:number
}
       

export interface userStatsResponseDTO{  
  totalUsers?:number,
  activeUsers?:number,
  blockedUsers?:number
}