import { ISports } from "@/models/sports.model"

export const toSportsResponseDTO=(sport:ISports)=>{
    return{
        id:sport._id.toString(),
        sportName: sport.sportName , 
        slug :sport .slug,       
        icon:sport.icon,
        description:sport.description,
        isActive:sport.isActive,
    }
}