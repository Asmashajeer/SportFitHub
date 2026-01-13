import Sidebar  from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"


function MainLayout() {
  return (
    <div>
        <Header/>
        <Sidebar />
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}



export default MainLayout

