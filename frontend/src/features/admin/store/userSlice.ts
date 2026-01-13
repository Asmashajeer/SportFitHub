
import type { UserRole } from "../../../constants/constants";


import type { StateCreator } from "zustand";
import { adminService } from "../service/adminService";

export interface Users{
  id:string,
  email: string, 
  role: UserRole,
  googleId?: string,
  isVerified:boolean,
  isBlocked: boolean,
  isActive: boolean,
  createdAt: Date
}
export interface UserStats{
  totalUsers:number|0,
  activeUsers:number|0,
  blockedUsers:number|0
}
export interface UserSlice {

    users:Users[],
    userStats:UserStats |null,
    setUsers:(users:Users[])=>void,
    fetchStats:()=>Promise<UserStats | undefined>,
    updateUser:(user:Users)=>void
    removeUser:(id:string)=>void,
    resetUserSlice:()=>void
}


export const createUserSlice:StateCreator<UserSlice>=(set)=>({
    users:[],
    userStats:null,
       
    setUsers:(users:Users[])=>set({users}),
    fetchStats: async () => {
        try {
            const stats = await adminService.getStats();           
            set({ userStats: stats.userStats });
         
            return stats.userStats;
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    },
    setUserStats:(userStats:UserStats)=>set({userStats}),
    updateUser:(updatedUser:Users)=>set((state)=>({
        users:state.users.map(user=>user.id === updatedUser.id ? updatedUser : user)
    })),
    removeUser:(id:string)=>set((state)=>({
        users:state.users.filter((user=>user.id!==id))
     })),

    resetUserSlice:()=>set({
        users:[],
        userStats:null

     })
     
    

})