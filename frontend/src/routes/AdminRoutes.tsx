import { Route, Routes } from "react-router-dom"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../features/admin/component/user-management/UserManagement"
import AdminMainLayout from "../components/layout/AdminLayout"
import Approvals from "@/features/admin/component/trainer-management/Approvals"
import Categories from "@/features/admin/component/category-management/Categories"

const AdminRoutes=()=>{
    return(
        <Routes>
            <Route element={<AdminMainLayout/>}>
                <Route path='/dashboard' element ={<AdminDashboard/>}/>
                <Route path='/user-management' element={<UserManagement/>}/>
                <Route path='/trainer-management' element={<Approvals/>}/>
                <Route path='/category-management' element={<Categories/>}/>
           </Route>
        </Routes>
    )
}
export default AdminRoutes