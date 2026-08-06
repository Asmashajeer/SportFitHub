import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { VIDEO_CALL_STATUS } from "@/constants/constants";
import { closePeerConnection, getPeerConnection, setPendingOffer } from "@/lib/webrtc/peerConnection";
import { startCall } from "../service/startCall";
import toast from "react-hot-toast";
import { stopLocalStream } from "@/lib/webrtc/media";

export const useVideoCallSocketListeners=()=>{
  
    const{setCurrentCallId,setCallStatus,setRemoteUserId,setRemoteEmail,resetCall}=useVideoCallStore();

    useEffect(() => {        

     const handleCallOffer=({ sdp, callId,callerId,callerEmail}:{ sdp: RTCSessionDescriptionInit; callId: string; callerId: string; callerEmail: string })=>{
         const{callStatus}=useVideoCallStore.getState();         
        if(callStatus===VIDEO_CALL_STATUS.ACTIVE||callStatus===VIDEO_CALL_STATUS.RINGING) return
        setCurrentCallId(callId);
        setCallStatus(VIDEO_CALL_STATUS.RINGING);
        setRemoteUserId(callerId);
        setRemoteEmail(callerEmail);  
        setPendingOffer(sdp)    ; 
     }


     const  handleCallInitiated=({callId,targetUserId }:{callId:string,targetUserId:string})=>{
        setCurrentCallId(callId);

        setRemoteUserId(targetUserId );
        setCallStatus(VIDEO_CALL_STATUS.OUTGOING);
     }

     const handleCallAnswer=({sdp,callId,calleeId}:{ sdp: RTCSessionDescriptionInit; callId: string; calleeId: string })=>{
        const pc=getPeerConnection();
        setCurrentCallId(callId);
        pc?.setRemoteDescription  (sdp);
        setRemoteUserId(calleeId) ;  

         setCallStatus(VIDEO_CALL_STATUS.ACTIVE);  
     }

     const handleIceCandidate=({senderId,candidate,callId}:{senderId:string,candidate:RTCIceCandidateInit,callId:string})=>{
        const{currentCallId,remoteUserId}=useVideoCallStore.getState();;
        const pc=getPeerConnection();
        if (callId !== currentCallId ||remoteUserId!==senderId) return;
        pc?.addIceCandidate(candidate);
     }

     const handleCallBusy=({targetUserId}:{targetUserId:string})=>{
        const{remoteUserId}=useVideoCallStore.getState();;
        if(targetUserId===remoteUserId){
            resetCall();
        }
     }
     const handleCallReject=({from,callId}:{from:string,callId:string})=>{
        const{currentCallId,remoteUserId}=useVideoCallStore.getState();;
        if(from!==remoteUserId || callId!==currentCallId) return;
        resetCall();
     }

     const handleCallEnd=({from,callId}:{from:string,callId :string})=>{
        const{currentCallId,remoteUserId}=useVideoCallStore.getState();;
        if(from!==remoteUserId || callId!==currentCallId) return;        
        resetCall();
        stopLocalStream()
        closePeerConnection();
     }


   const handleWaitingForParticipant = () => {
        setCallStatus(VIDEO_CALL_STATUS.WAITING);
        console.log("waiting for other participant");
    };

    const handleParticipantJoined = ({ shouldCreateOffer, otherUserId, otherUserEmail }: {
        shouldCreateOffer: boolean;
        otherUserId: string;
        otherUserEmail: string;
    }) => {
        setRemoteUserId(otherUserId);
        setRemoteEmail(otherUserEmail);
         console.log(" other participant joined");
        if (shouldCreateOffer) {
            startCall(otherUserId);
        }
    };

    const handleJoinSessionError = ({ message }: { message: string }) => {
        toast.error(message);
        setCallStatus(VIDEO_CALL_STATUS.IDLE);
    };

    
    socket.on('call-offer', handleCallOffer);
    socket.on('call-initiated', handleCallInitiated);
    socket.on('call-answer', handleCallAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-busy', handleCallBusy);
    socket.on('call-reject', handleCallReject);
    socket.on('call-end', handleCallEnd);
    socket.on('waiting-for-participant', handleWaitingForParticipant);
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('join-session-error', handleJoinSessionError);

    return () => {
        socket.off('call-offer', handleCallOffer);
        socket.off('call-initiated', handleCallInitiated);
        socket.off('call-answer', handleCallAnswer);
        socket.off('ice-candidate', handleIceCandidate);
        socket.off('call-busy', handleCallBusy);
        socket.off('call-reject', handleCallReject);
        socket.off('call-end', handleCallEnd);
        socket.off('waiting-for-participant', handleWaitingForParticipant);
        socket.off('participant-joined', handleParticipantJoined);
        socket.off('join-session-error', handleJoinSessionError);
    };
}, []);
}