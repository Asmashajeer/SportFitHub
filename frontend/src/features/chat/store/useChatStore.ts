import type { PAYLOAD_MODEL } from "@/constants/constants";

import { socket } from "@/socket";

import { create } from "zustand";

export interface Message {
  id?: string;
  conversationId: string;
  sender: string;
  text: string;
  readBy: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: { _id: string; name: string; role: string }[];
  lastMessage?: { text: string; sender: string; createdAt: string };
  contextSessionId?: { _id: string; sessionName: string,
  contextSessionModel:typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL]} | null;
}
export interface Message_Payload{
    conversationId?: string;
    recipientId?: string;
    contextSessionId?: string;
    contextSessionModel?: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL];
    text: string;
    
}


interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // by conversationId
  activeConversationId: string | null;
  unreadMessageCountInbox:number;

  setConversations: (conversations: Conversation[]) => void;
//   updateConversations:(conversation:Conversation) => void;
  updateConversationsPreview:(message:Message)=>void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setActiveConversation: (conversationId: string | null) => void;

  sendMessage: (payload: Message_Payload) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  setUnreadMessageCountInbox:(count:number) => void,
}

export const useChatStore=create<ChatState>((set)=>({
    conversations:[],
     messages: {},
    activeConversationId:null,
    unreadMessageCountInbox:0,

    setConversations: (conversations) => set( {conversations}),
  
    updateConversationsPreview:(message)=>
        set ((state)=>({
           conversations:state.conversations.map((conv)=>conv.id===message.conversationId ? 
           {...conv,lastMessage: { text: message.text, sender: message.sender, createdAt: message.createdAt } }
            :conv)
        })),
    setMessages: (conversationId, messages) => 
        set((state)=>({
            messages:{...state.messages,[conversationId]:messages}
        })),

   
    addMessage: (message) => 
        set((state)=>{
            const existing=state.messages[message.conversationId] || [];
            return{
                messages:{
                    ...state.messages,
                    [message.conversationId]:[...existing,message]
                }
            }
        }),
    
    setActiveConversation:(conversationId)=> set({activeConversationId:conversationId}),
    sendMessage: (payload) => {
        console.log('sendMessage Sending .....');
       
         socket.emit('sendMessage', payload)
    },
 
    joinConversation: (conversationId) => {
        socket.emit('joinConversation',conversationId)
    },
    leaveConversation: (conversationId) => {
        socket.emit('leaveConversation',conversationId)
    },
    markAsRead: (conversationId) => {
        socket.emit('markAsRead',conversationId)
    },
    setUnreadMessageCountInbox:(count)=>set({unreadMessageCountInbox:count})
}));