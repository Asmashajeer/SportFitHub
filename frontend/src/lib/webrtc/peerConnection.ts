import { stopLocalStream } from "./media";

const rtcConfig:RTCConfiguration={
    iceServers:[
        {urls:'stun:stun.l.google.com:19302'}
    ]
};


let peerConnection:RTCPeerConnection|null=null;
let pendingOffer: RTCSessionDescriptionInit | null = null; 


export const createPeerConnection=()=>{
  peerConnection=new RTCPeerConnection(rtcConfig);
//   peerConnection.ontrack = onTrack;
//   peerConnection.onicecandidate = onIceCandidate;
  return peerConnection
}
export const getPeerConnection = () => peerConnection;

export const closePeerConnection = () => {
  peerConnection?.close();
  stopLocalStream();
  peerConnection = null;
};




export const setPendingOffer = (sdp: RTCSessionDescriptionInit) => {
    pendingOffer = sdp;
};

export const getPendingOffer = () => pendingOffer;

export const clearPendingOffer = () => {
    pendingOffer = null;
};

