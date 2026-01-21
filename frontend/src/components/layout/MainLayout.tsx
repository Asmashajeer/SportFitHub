import Sidebar  from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"


function MainLayout() {
  return (
    <div >
        <Header/>
    
          <Sidebar activePage="dashboard" />
      
        <main className="grow pl-64 p-8">
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}



export default MainLayout

