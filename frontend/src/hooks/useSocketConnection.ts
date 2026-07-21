import { socket } from "@/socket";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useEffect } from "react";

export const  useSocketConnection=()=>{
 const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
 const isLoading = useAuthStore((s) => s.isLoading);

 useEffect(()=>{
    if(isLoading) return;
    if(isAuthenticated){
        if(!socket.connected){
            socket.connect();
            console.log("socket connected)");
        }        
    }
    else{
        if(socket.connected){
            socket.disconnect();
            console.log("socket Disconnected)");
        }
    }
 },[isAuthenticated, isLoading]);
 

 useEffect(() => {
  const onConnect = () => console.log('✅ socket connected:', socket.id);
  const onConnectError = (err: Error) => console.error('❌ socket connect_error:', err.message);
  const onDisconnect = (reason: string) => console.log('socket disconnected:', reason);

  socket.on('connect', onConnect);
  socket.on('connect_error', onConnectError);
  socket.on('disconnect', onDisconnect);

  return () => {
    socket.off('connect', onConnect);
    socket.off('connect_error', onConnectError);
    socket.off('disconnect', onDisconnect);
  };
}, []);
}