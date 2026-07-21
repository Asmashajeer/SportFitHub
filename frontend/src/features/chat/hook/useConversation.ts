import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

export const useConversation = (conversationId: string | null) => {
  const { joinConversation, leaveConversation, markAsRead } = useChatStore();

  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);
    markAsRead(conversationId); // mark read the moment the message is opened/viewed

    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation, markAsRead]);
};