import api from "@/api/axiosInstance"
import { CHAT_ROUTE } from "./chat.api"
import type { Attachment, Conversation, Message } from "../store/useChatStore";

export const chatService={
    getConversation:async(conversationId:string)=>{
        
        const res=await api.get(CHAT_ROUTE.GET_CONVERSATION,{params:conversationId});
        console.log('after fetching');
        return res.data;                                                                               
    },
     getConversations:async():Promise<Conversation[]>=>{
        console.log('before fetching');
        const res=await api.get(CHAT_ROUTE.GET_CONVERSATIONS);
          console.log('after fetching');
        return res.data;                                                                               
    },
    getMessages:async (conversationId:string):Promise<Message[]>=>{
        const res=await api.get(CHAT_ROUTE.GET_MESSAGES,{params:{conversationId}});
        return res.data; 
    },
    getUnreadMessageCount:async():Promise<number>=>{
        const res=await api.get(CHAT_ROUTE.GET_MESSAGES_UNREAD_COUNT);
        return res.data; 
    },
    getAttachment: async(attachment:Attachment,conversationId:string)=>{
        const res=await api.get(CHAT_ROUTE.GET_ATTACHMENT,{params:{conversationId,...attachment},
            responseType: 'blob',
    });
        return res.data;
    }
}