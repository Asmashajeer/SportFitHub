import { useEffect, useRef } from "react";
import { useChatStore, type Message } from "../store/useChatStore";
import { chatService } from "../service/chatService";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { formatDateLabel, formatTo12Hour } from "@/utils/formatDate";
import { Check, CheckCheck } from "lucide-react";

interface MessageThreadProps {
  conversationId: string;
}

export const AllMessages = ({ conversationId }: MessageThreadProps) => {
  const { messages, setMessages,markAsRead } = useChatStore();
  const {user}= useAuthStore();
  const currentUserId=user?.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {   
   const fetchMessages=async()=>{
    const msgs=await chatService.getMessages(conversationId);
        setMessages(conversationId, msgs);
    }  
  
    fetchMessages();
    markAsRead(conversationId);
  }, [conversationId, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length]);


  interface GroupedMessages {
    label: string; // "Today", "Yesterday", or formatted date
    date: string;  
    messages: Message[];
  }
  function groupMessagesByDate( conversationMessages: Message[]): GroupedMessages[] {
    const groups = new Map<string, Message[]>();

    for (const msg of conversationMessages) {
      //  same-day messages group together
      const dateKey = new Date(msg.createdAt).toISOString().split("T")[0];
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(msg);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b)) 
      .map(([date, msgs]) => ({
        date,
        label: formatDateLabel(date),
        messages: msgs,
      }));
  }
  const grouped = groupMessagesByDate(conversationMessages);
  return (
    <ScrollArea className="flex-1 h-full p-4">
      {grouped.map((group) => (
        <div key={group.date}>
          <div className="date-divider text-[10px] text-gray-500">- {group.label} -</div>
          <div className="flex flex-col gap-2">
            {group.messages.map((msg) => {
              const isOwn = msg.sender === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={cn("flex flex-col max-w-[70%]", isOwn ? "self-end items-end" : "self-start items-start")}
                >
                  <div
                    className={cn(
                      " flex  rounded-md px-2 py-1 text-xs justify-between gap-2",
                      isOwn ? "bg-primary text-white" : "bg-muted border"
                    )}
                  >
                    {msg.text}   
                    <div className=" flex  items-end">
                      <p className="text-[6px] text-right text-gray-300 mt-1 ">                    
                          {formatTo12Hour (msg.createdAt)}
                     </p>
                     <p className=" px-0.7 text-green-300">{msg.readBy.length>1 ?<CheckCheck className=" w-2 h-2 text-green-500  " />:<Check className=" w-2 h-2 "/>}</p>
                    </div>          
                  
                  </div>
                </div>
              );
            })}       
            <div ref={bottomRef} />
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};