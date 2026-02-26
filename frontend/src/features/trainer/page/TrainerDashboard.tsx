import TrainerNotificationBanner from "../component/TrainerNotificationBanner";

const TrainerDashboard=()=> {
  return (
    <div className=" max-w-6xl ">
      <div className=" flex flex-start left-0 py-2 my-4">
        <h1 className=" font-bold "> Dashboard</h1>
      </div>
      <div>
       <TrainerNotificationBanner/>
      </div>
    </div>

  )
}
export default TrainerDashboard;