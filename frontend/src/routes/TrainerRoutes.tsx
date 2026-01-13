
import { Routes,Route } from "react-router-dom";
import TrainerProfileForm from "../features/trainer/component/TrainerProfileForm";
const TrainerRoutes=() =>{
  return (
    <Routes>
            {/* <Route path='' element={<TrainerDashboard/>}/> */}
            <Route path ='/add-Profile' element={ <TrainerProfileForm/>}/>
    </Routes>
  )
}


export default TrainerRoutes

