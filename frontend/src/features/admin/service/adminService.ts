import api from '../../../api/axiosInstance'
import type { UserRole } from '../../../constants/constants';
export const adminService={

    
    getUsers:async (page:number)=>{
        const response= await api.get('/admin/users/allUsers',{params: { page }});        
        return response.data;
        },
    getStats:async ()=>{
        const response= await api.get('/admin/users/getStats');        
        return response.data;
    },
    toggleBlock:async(id:string)=>{
        const response=await api.patch('/admin/users/toggleBlock',{id});
        return response.data;
        },
    deleteUser:async(id:string)=>{
        const response=await api.delete(`/admin/users/deleteUser/${id}`);
        return response.data;
        },
    updateUserRole:async (id:string,selectedRole:UserRole)=>{
        const response = await api.patch('/admin/users/updateRole', {id, selectedRole });
        return response.data;  
   },  
 
}