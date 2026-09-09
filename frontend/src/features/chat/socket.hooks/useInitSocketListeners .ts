
import { useChatStore, type Message } from "@/features/chat/store/useChatStore"
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useInitSocketListeners =()=>{
    const {addMessage,updateConversationsPreview,markAsRead,joinConversation,setLastCreatedConversation}=useChatStore();

    useEffect(()=>{
        const handleConversationCreated=({conversationId}:{conversationId:string})=>{
            joinConversation(conversationId);
             setLastCreatedConversation(conversationId);
        }
        const handleNewConversation=({conversationId,message}:{conversationId:string,message:Message})=>{
             console.log(` newMessage received on client:`, message);
            joinConversation(conversationId);
            addMessage(message);
            updateConversationsPreview(message);           
        }
       
        const handleNewMessage = ({message}:{message:Message,conversationId:string}) => {
            addMessage(message);           
            updateConversationsPreview(message);
        };

        const handleMessagesRead = ({ conversationId }: { conversationId: string}) => {
            markAsRead(conversationId)
        };

        const handleError = (msg: string) => {
            console.error('Chat socket error:', msg);
            toast.error(msg);
        };
        socket.on('conversationCreated',handleConversationCreated);
        socket.on('newConversation',handleNewConversation);
        socket.on('newMessage', handleNewMessage);
        socket.on('messagesRead', handleMessagesRead);
        socket.on('errorMessage', handleError);

        return () => {
            socket.off('conversationCreated', handleConversationCreated);
            socket.off('newConversation',handleNewConversation);
            socket.off('newMessage', handleNewMessage);
            socket.off('messagesRead', handleMessagesRead);
            socket.off('errorMessage', handleError);
        };
    },[addMessage, updateConversationsPreview, markAsRead, joinConversation]);
}