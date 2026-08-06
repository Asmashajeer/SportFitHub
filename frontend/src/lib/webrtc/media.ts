
let localStream:MediaStream|null;

export const getLocalStream = async () => {
   localStream= await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
   return localStream;
};

export const getCurrentLocalStream=()=>{
    if(!localStream)return getLocalStream();
    return localStream
};


export const stopLocalStream= ()=>{
    localStream?.getTracks().forEach((track)=>track.stop);
    localStream=null;
}

