import { Route, Routes } from "react-router-dom"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../features/admin/component/UserManagement"

const AdminRoutes=()=>{
    return(
        <Routes>
             <Route path='/dashboard' element ={<AdminDashboard/>}/>
            <Route path='/user-management' element={<UserManagement/>}/>
           
        </Routes>
    )
}
export default AdminRoutes