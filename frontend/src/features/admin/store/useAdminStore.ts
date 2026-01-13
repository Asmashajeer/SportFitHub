import { create } from "zustand"
import { createUserSlice, type UserSlice } from "./userSlice";


export type  AdminState=   UserSlice & { clearAdminData:()=>void}


export const UseAdminStore=create<AdminState>()((set,get,...a)=>({
    ...createUserSlice(set,get,...a),
   clearAdminData:()=>(
        get().resetUserSlice()
   )

}));

