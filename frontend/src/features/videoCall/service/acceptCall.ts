import { clearPendingOffer, createPeerConnection, getPendingOffer } from "@/lib/webrtc/peerConnection";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { socket } from "@/lib/socket";
import { VIDEO_CALL_STATUS } from "@/constants/constants";
import { getCurrentLocalStream} from "@/lib/webrtc/media";

export const acceptCall = async () => {
    const{ currentCallId, remoteUserId, setCallStatus, setRemoteStream}=useVideoCallStore.getState();

    const offer=getPendingOffer();
    if(!offer || !remoteUserId|| !currentCallId) return;

    const pc=createPeerConnection();     

    pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const { currentCallId } = useVideoCallStore.getState();
        if (!currentCallId) return; 
        socket.emit('ice-candidate', {
            targetUserId:remoteUserId,
            candidate: event.candidate,
            callId: currentCallId,
        });        
    };

    pc.ontrack = (e) => {
        setRemoteStream(e.streams[0])
    };


    await pc.setRemoteDescription(offer);

const localStream = await getCurrentLocalStream();
    // add local tracks
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const answer = await pc.createAnswer();
    // set local description
    await pc.setLocalDescription(answer);
     //sendOffer 
    socket.emit('call-answer', { targetUserId:remoteUserId, sdp: answer ,callId:currentCallId});
    clearPendingOffer();
    setCallStatus(VIDEO_CALL_STATUS.ACTIVE);

}