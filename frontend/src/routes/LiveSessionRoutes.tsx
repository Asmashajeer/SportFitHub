import LiveSessionScreen from "@/features/videoCall/page/LiveSessionScreen";

import { Route, Routes } from "react-router-dom";

function LiveSessionRoutes() {
  return (
    <Routes>
      <Route path="/join-session" element={< LiveSessionScreen/>} />
    </Routes>
  )
}


export default LiveSessionRoutes