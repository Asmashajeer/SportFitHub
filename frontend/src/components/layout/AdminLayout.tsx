

import { Outlet } from "react-router-dom"
import AdminSidebar from "../../features/admin/component/AdminSidebar"


function AdminMainLayout() {
  return (
    <div className="flex h-screen ">      
        <AdminSidebar activePage='dashboard'/>
        <main className="grow pl-64 ">
            <Outlet/>
        </main>
       
    </div>
  )
}



export default AdminMainLayout

