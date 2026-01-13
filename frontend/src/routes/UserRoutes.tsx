import { Routes,Route } from "react-router-dom";

import CompleteProfilePage from "../pages/user/CompleteProfilePage";

function UserRoutes() {
  return (
    <Routes>
        {/* <Route path='' element={<UserDashboard/>}/> */}
        <Route path ='/add-Profile' element={ <CompleteProfilePage/>}/>
    </Routes>
  )
}



export default UserRoutes

