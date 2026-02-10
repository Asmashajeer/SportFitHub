import { Route, Routes } from "react-router-dom"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../features/admin/component/user-management/UserManagement"
import AdminMainLayout from "../components/layout/AdminLayout"
import Approvals from "@/features/admin/component/approvals/Approvals"

const AdminRoutes=()=>{
    return(
        <Routes>
            <Route element={<AdminMainLayout/>}>
                <Route path='/dashboard' element ={<AdminDashboard/>}/>
                <Route path='/user-management' element={<UserManagement/>}/>
                <Route path='/approvals' element={<Approvals/>}/>
           </Route>
        </Routes>
    )
}
export default AdminRoutes