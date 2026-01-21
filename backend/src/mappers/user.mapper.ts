import { usersResposeDTO } from "@/dtos/response/admin/user.dto";
import { AdminIUserView, IUser } from "@/models/user.model";

export const toUsersResponseData= (user:IUser):usersResposeDTO=>{
    return{
            id: user._id.toString(),
            email: user.email, 
            password:user.password,
            role: user.role,
            googleId: user.googleId||" ",
            isVerified:user.isVerified,
            isBlocked:user.isBlocked,
            isActive: user.isActive,
            createdAt: user.createdAt.toString(),
    
    }
}