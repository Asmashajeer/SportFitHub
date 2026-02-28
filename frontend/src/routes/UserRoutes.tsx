import { Routes,Route } from "react-router-dom";

import CompleteProfilePage from "@/features/user/page/CompleteProfilePage";
import UserDashboard from "@/features/user/page/UserDashboard";
import { UserProfile } from "@/features/user/component/UserProfile";


function UserRoutes() {
  return (
    <Routes>
        <Route path='' element={<UserDashboard/>}/>
        <Route path ='/add-profile' element={ <CompleteProfilePage/>}/>
        <Route path ='/profile' element={ <UserProfile/>}/>
    </Routes>
  )
}



export default UserRoutes

