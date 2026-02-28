import { TRAINER_STATUS } from "@/constants/constants";
import TrainerNotificationBanner from "../component/TrainerNotificationBanner";
import { useTrainerStore } from "../store/useTrainerStore";

const TrainerDashboard=()=> {
  const profile=useTrainerStore(state=>state.profile);
  return (
    <div className=" max-w-6xl ">
      <div className=" flex flex-start left-0 py-2 my-4">
        <h1 className=" font-bold "> Dashboard</h1>
      </div>
      <div>
      {(profile?.status===TRAINER_STATUS.REJECTED ||profile?.status===TRAINER_STATUS.SUSPENDED) &&
       <TrainerNotificationBanner/>
      }
      </div>
    </div>

  )
}
export default TrainerDashboard;