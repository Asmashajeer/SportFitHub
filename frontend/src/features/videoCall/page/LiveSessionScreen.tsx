

import { VIDEO_CALL_STATUS } from "@/constants/constants";
import { useVideoCallStore } from "../store/useVideoCallStore"
import { useEffect, useState } from "react";
import ConnectingScreen from "../components/ConnectingScreen";
import { getLocalStream } from "@/lib/webrtc/media";
import toast from "react-hot-toast";
import { WaitingScreen } from "../components/WaitingScreen";
import { ConnectingCallScreen } from "../components/ConnectingCallScreen";
import { ActiveCallScreen } from "../components/ActiveCallScreen";
import { useLocation } from "react-router-dom";

const  LiveSessionScreen=()=> {
    const location=useLocation();
    const { callStatus} = useVideoCallStore();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const from=location.state.from;
    useEffect(()=>{
        let stream: MediaStream | null = null;
      const getStream=async()=>{
          try{
            stream=await getLocalStream();
            setLocalStream(stream);
          }
          catch(err){
            toast.error("Camera/mic permission is required to join.");
            console.log(err);
          }
      }
      getStream();
      return () => {
        stream?.getTracks().forEach(track => track.stop()); //  release camera/mic             
        setLocalStream(null);   
      };
    },[]);

    if (callStatus === VIDEO_CALL_STATUS.IDLE) {
        return <ConnectingScreen  from={from}/>; // "Joining session..." — brief, in-flight state
    }
    if (callStatus === VIDEO_CALL_STATUS.WAITING) {
        return <WaitingScreen localStream={localStream} from={from}/>;
    }
    if (callStatus === VIDEO_CALL_STATUS.OUTGOING || callStatus === VIDEO_CALL_STATUS.RINGING) {
        return <ConnectingCallScreen />; // offer/answer in progress
    }
    if (callStatus === VIDEO_CALL_STATUS.ACTIVE) {
        return <ActiveCallScreen localStream={localStream} from={from}/>;
    }
    return null;

}


export default  LiveSessionScreen

