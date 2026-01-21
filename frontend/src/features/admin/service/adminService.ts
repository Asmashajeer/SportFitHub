import api from '../../../api/axiosInstance'
import type { UserRole } from '../../../constants/constants';
import { ADMIN_ROUTES } from './admin.Api';


export const adminService={
    
    getUsers:async (page:number)=>{
        const response= await api.get(ADMIN_ROUTES.GET_USERS,{params: { page }});        
        return response.data;
        },
    getStats:async ()=>{
        const response= await api.get(ADMIN_ROUTES.GET_STATS);        
        return response.data;
    },
    toggleBlock:async(id:string)=>{
        const response=await api.patch(ADMIN_ROUTES.TOGGLE_BLOCK,{id});
        return response.data;
        },
    deleteUser:async(id:string)=>{
        const response=await api.delete(ADMIN_ROUTES.DELETE_USER+`/${id}`);
        return response.data;
        },
    updateUserRole:async (id:string,selectedRole:UserRole)=>{
        const response = await api.patch(ADMIN_ROUTES.UPDATE_USER_ROLE, {id, selectedRole });
        return response.data;  
   },  
 
}