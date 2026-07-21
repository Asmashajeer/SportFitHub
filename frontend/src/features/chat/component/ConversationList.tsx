import { useEffect } from "react";
import { chatService } from "../service/chatService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useConversation } from "../hook/useConversation";

interface ConversationListProps {
  onSelect: (conversationId: string) => void;
  activeConversationId: string | null;
}

export const ConversationList = ({ onSelect, activeConversationId }: ConversationListProps) => {
  const { conversations, setConversations } = useChatStore();
  const currentUserId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await chatService.getConversations();
      setConversations(data);
    };

    fetchConversations();
  }, []);
  useConversation(activeConversationId);
   return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {conversations.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 text-center">No conversations yet</p>
        )}

        {conversations.map((conv) => {
          const otherParticipant = conv.participants.find((p) => p._id !== currentUserId);
          otherParticipant && console.log(otherParticipant);
          const isActive = conv.id === activeConversationId;

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "flex items-center gap-3 p-3 bg-zinc-800 text-left hover:bg-muted transition-colors border-b",
                isActive && "bg-green-800"
              )}
            >
              <Avatar className=" bg-red-300 h-10 w-10 shrink-0">
               
                <AvatarFallback className=" bg-zinc-500">{otherParticipant?.name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{otherParticipant?.name}</p>
                  {conv.lastMessage?.createdAt && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
  }
