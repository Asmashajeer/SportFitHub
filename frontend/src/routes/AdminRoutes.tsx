import { Route, Routes } from "react-router-dom"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../features/admin/component/UserManagement"
import AdminMainLayout from "../components/layout/AdminLayout"

const AdminRoutes=()=>{
    return(
        <Routes>
            <Route element={<AdminMainLayout/>}>
                <Route path='/dashboard' element ={<AdminDashboard/>}/>
                <Route path='/user-management' element={<UserManagement/>}/>
           </Route>
        </Routes>
    )
}
export default AdminRoutes