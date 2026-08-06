import { VIDEO_CALL_STATUS, type Video_Call_Status_Type } from "@/constants/constants";
import { create } from "zustand";

interface VideoCallState{
    currentCallId:string |null,
    callStatus:Video_Call_Status_Type,
    remoteUserId:string| null,
    remoteEmail:string| null,
    remoteStream: MediaStream | null ,

    setCurrentCallId:(callId:string)=>void,
    setCallStatus:(callStatus:Video_Call_Status_Type)=>void,
    setRemoteUserId:(remoteUserId:string)=>void,
    setRemoteEmail:(remoteEmail:string)=>void
    resetCall:()=>void,   
    setRemoteStream : (stream: MediaStream) =>void;
    
}

export const useVideoCallStore=create<VideoCallState>((set)=>({
    currentCallId:null,
    callStatus:VIDEO_CALL_STATUS.IDLE,
    remoteUserId:null,
    remoteEmail:null,
    remoteStream:null,
    setCurrentCallId:(currentCallId:string)=>set({currentCallId}),
    setCallStatus:(callStatus:Video_Call_Status_Type)=>set({callStatus}),
    setRemoteUserId:(remoteUserId:string)=>set({remoteUserId}),
    setRemoteEmail:(remoteEmail:string)=>set({remoteEmail}),
    resetCall:()=>set({
        currentCallId:null,
        callStatus:VIDEO_CALL_STATUS.IDLE,
        remoteUserId:null,
        remoteEmail:null,
        remoteStream: null, 
    }),
    setRemoteStream : (stream: MediaStream) =>set( { remoteStream : stream }),
    

}))

