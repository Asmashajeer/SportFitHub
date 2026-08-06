import { socket } from "@/lib/socket";
import { createPeerConnection } from "@/lib/webrtc/peerConnection"
import { useVideoCallStore } from "../store/useVideoCallStore";
import { VIDEO_CALL_STATUS } from "@/constants/constants";
import { getCurrentLocalStream } from "@/lib/webrtc/media";

export const startCall = async (targetUserId: string) => {
    const{ setRemoteUserId,setCallStatus,setRemoteStream}=useVideoCallStore.getState();

    const pc=createPeerConnection();
   
    const localStream = await getCurrentLocalStream();

    pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const { currentCallId } = useVideoCallStore.getState();
        if (!currentCallId) return; 
        socket.emit('ice-candidate', {
            targetUserId,
            candidate: event.candidate,
            callId: currentCallId,
        });
        
    };


    pc.ontrack = (e) => {
        setRemoteStream(e.streams[0])
    };
    // add local tracks
    localStream?.getTracks()?.forEach((track) => pc.addTrack(track, localStream));

    //create offfer
    const offer = await pc.createOffer();
    // setLocalDesrition
    await pc.setLocalDescription(offer);


    setRemoteUserId(targetUserId);
    setCallStatus(VIDEO_CALL_STATUS.OUTGOING);

    //sendOffer 
    socket.emit('call-offer', { targetUserId, sdp: offer });
}