import { getAllUsersRequestDTO } from "@/dtos/request/admin.user.request.dto";
import { getAllusersResponseDTO, usersResposeDTO, userStatsResponseDTO } from "@/dtos/response/admin/user.dto";
import { UserRole } from "@/models/user.model";

export interface IUserService{
    getUsers(filters:getAllUsersRequestDTO):Promise<getAllusersResponseDTO>
    getStats():Promise<userStatsResponseDTO>;
    toggleBlock(id:string):Promise<usersResposeDTO>;
    deleteUser(id:string):Promise<usersResposeDTO>;
    updateRole(id:string,role:UserRole):Promise<usersResposeDTO>
}