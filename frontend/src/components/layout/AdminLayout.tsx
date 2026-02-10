

import { Outlet } from "react-router-dom"
import AdminSidebar from "../../features/admin/component/AdminSidebar"
import Header from "@/features/admin/component/Header"


function AdminMainLayout() {
  return (
    <div className="flex  h-screen "> 
        <AdminSidebar activePage='dashboard'/>
        <Header/>    
        
        <main className="grow  ">
            <Outlet/>
        </main>
       
    </div>
  )
}



export default AdminMainLayout

