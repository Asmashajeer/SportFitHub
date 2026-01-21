import { usersResposeDTO, userStatsResponseDTO } from "@/dtos/response/admin/user.dto";
import { UserRole } from "@/models/user.model";

export interface IUserService{
    getUsers(page:number,limit:number):Promise<usersResposeDTO[]>
    getStats():Promise<userStatsResponseDTO>;
    toggleBlock(id:string):Promise<usersResposeDTO>;
    deleteUser(id:string):Promise<usersResposeDTO>;
    updateRole(id:string,role:UserRole):Promise<usersResposeDTO>
}