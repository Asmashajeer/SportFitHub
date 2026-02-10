import { create } from "zustand"
import { createUserSlice, type UserSlice } from "./userSlice";
import { createTrainerSlice, type TrainerSlice } from "./trainerSlice";


export type  AdminState=   UserSlice & TrainerSlice & { clearAdminData:()=>void}


export const UseAdminStore=create<AdminState>()((set,get,...a)=>({
    ...createUserSlice(set,get,...a),
    ...createTrainerSlice(set,get,...a),
   clearAdminData:()=>(
        get().resetUserSlice()
   )

}));

