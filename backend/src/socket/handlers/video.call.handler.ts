import { Server } from "socket.io"
import { AuthenticatedSocket } from "../socket.types"
import { v4 as uuidv4 } from 'uuid';

import { IBookingService } from "@/interfaces/services/booking/IBooking.service";
import { VIDEO_CALL_STATUS } from "@/constants/enums";
const activeCalls = new Map<string, { callerId: string; calleeId: string; status: string }>();
const sessionRooms = new Map<string, Map<string,string>>(); // roomId -> map of userIds and emails


export const createVideoCallHandler=(bookingService:IBookingService)=>{
    return(io:Server,socket:AuthenticatedSocket,)=>{

        socket.on('join-session',async({sessionId,sessionStartUTC}:{sessionId:string,sessionStartUTC:string})=>{
           
            const userId=socket.user.id;
            
             console.log("sessionId:",sessionId,"date:",sessionStartUTC );
            const roomId=`${sessionId}:${sessionStartUTC}`;
            console.log("roomID  :- ",roomId);
            const isAuthorized=await checkSessionAccess(userId, sessionId, sessionStartUTC);
            if (isAuthorized===false) {
                socket.emit('join-session-error', { message: 'You are not authorized to join this session' });
                return;
            }
            socket.join(roomId);
            console.log(userId,"joined in room ",roomId)
            if (!sessionRooms.has(roomId)) {
                sessionRooms.set(roomId, new Map());
            }

            const participants=sessionRooms.get(roomId);
            participants.set(userId,socket.user.email);
            if (participants.size === 1) {
                socket.emit('waiting-for-participant');
            }
            else if (participants.size === 2) {
                const [otherUserId, otherUserEmail] =[...participants].find(([id])=>id!==userId)
                socket.to(roomId).emit('participant-joined',{
                    shouldCreateOffer: true,
                    otherUserId: userId,
                    otherUserEmail: socket.user.email,
                });

                socket.emit('participant-joined',{
                    shouldCreateOffer: false,
                    otherUserId, 
                    otherUserEmail,
                });
            }


        })
        //caller initiate a call
        socket.on('call-offer',({targetUserId,sdp})=>{
            if(isBusy(targetUserId)){
            socket.emit('call-busy',({targetUserId}));
            return;  
            }
            const callId=uuidv4();
            activeCalls.set(callId, {
                callerId: socket.user.id,
                calleeId: targetUserId,
                status: 'ringing',
            });

            io.to(targetUserId).emit('call-offer',{
                sdp,
                callId,
                callerId:socket.user.id,
                callerEmail:socket.user.email,
            });
            socket.emit('call-initiated', { callId, targetUserId });
        });
        //  answer the call
        socket.on('call-answer',({targetUserId,sdp,callId})=>{           
            const call = activeCalls.get(callId);
            if (call) {
                call.status = 'active';
            }
            io.to(targetUserId).emit('call-answer',{
                sdp,
                callId,
                calleeId:socket.user.id,            
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        });

        socket.on('ice-candidate',({targetUserId,candidate,callId})=>{
            io.to(targetUserId).emit('ice-candidate',{
                callId,
                candidate,
                senderId:socket.user.id,
            });
        });


        socket.on('call-reject',({targetUserId,callId})=>{
            io.to(targetUserId).emit('call-reject',{from:socket.user.id,callId})
            activeCalls.delete(callId)
        });

        socket.on('call-end',({targetUserId,callId})=>{
            io.to(targetUserId).emit('call-end',{from:socket.user.id,callId})
            activeCalls.delete(callId)
        });
        
        socket.on('disconnect',()=>{
            const userId=socket.user.id;
            for(const [callId,call] of activeCalls.entries()){
                if(call.callerId===userId  || call.calleeId===userId){
                    const otherUser=call.callerId===userId?call.calleeId:call.callerId;
                    io.to(otherUser).emit('call-end',{from:userId,callId,reason:'peer Disconnect'});
                    activeCalls.delete(callId);
                }
            }

            // clean up sessionRooms
            for (const [roomId, participants] of sessionRooms.entries()) {
                if (participants.has(userId)) {
                    participants.delete(userId);
                    socket.to(roomId).emit('call-end', { from: userId, reason: 'peer Disconnect' });
                    if (participants.size === 0) {
                        sessionRooms.delete(roomId);
                    }
                }
            }
        })
        

        const isBusy =(userId:string)=>{
            for(const call of activeCalls.values()){
                if((userId===call.callerId || userId===call.calleeId) && (call.status===VIDEO_CALL_STATUS.ACTIVE|| call.status===VIDEO_CALL_STATUS.RINGING) ){
                return true;
                }        
            }
            return false
        }

        const checkSessionAccess=async(userId:string, sessionId:string, sessionStartUTC:string)=>    {
            const isAuthorized=await bookingService.checkSessionAccess(userId,sessionId,sessionStartUTC);
            console.log("isAuthorized  - ",isAuthorized);
           return isAuthorized;
        }
    }
}