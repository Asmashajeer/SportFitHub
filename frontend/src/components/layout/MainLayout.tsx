import Sidebar  from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"


function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">  
      <Header/>  
      <div className="flex flex-1">
        <Sidebar activePage="dashboard" />        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex-1">
            <Outlet/>   
          </div>
          <Footer/>
        </main>
      </div>
       
    </div>
  )
}



export default MainLayout

