import { Routes,Route } from "react-router-dom";

import CompleteProfilePage from "@/features/user/page/CompleteProfilePage";
import UserDashboard from "@/features/user/page/UserDashboard";

function UserRoutes() {
  return (
    <Routes>
        <Route path='' element={<UserDashboard/>}/>
        <Route path ='/add-profile' element={ <CompleteProfilePage/>}/>
    </Routes>
  )
}



export default UserRoutes

