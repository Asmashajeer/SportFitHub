import { socket } from "@/lib/socket";
import { useVideoCallStore } from "../store/useVideoCallStore"
import { closePeerConnection } from "@/lib/webrtc/peerConnection";
import { stopLocalStream } from "@/lib/webrtc/media";

export const endCall=()=>{
    const{remoteUserId,currentCallId,resetCall}=useVideoCallStore.getState();
    socket.emit('call-end',{targetUserId:remoteUserId,callId:currentCallId});
    stopLocalStream()
    closePeerConnection();
    resetCall();  
}

export const rejectCall=()=>{
     const{remoteUserId,currentCallId,resetCall}=useVideoCallStore.getState();
    socket.emit('call-reject',{targetUserId:remoteUserId,callId:currentCallId});  
    resetCall();
    stopLocalStream()
}