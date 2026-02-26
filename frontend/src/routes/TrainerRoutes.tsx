
import { Routes,Route } from "react-router-dom";
import TrainerProfileForm from "../features/trainer/page/TrainerOnboarding";
import TrainerDashboard from "@/features/trainer/page/TrainerDashboard";
import ProfileView from "@/features/trainer/component/ProfileView";
const TrainerRoutes=() =>{
  return (
    <Routes>
            <Route path='/dashboard' element={<TrainerDashboard/>}/>
            <Route path ='/add-Profile' element={ <TrainerProfileForm/>}/>
            <Route path='/profile' element={<ProfileView/>} />
    </Routes>
  )
}


export default TrainerRoutes

