import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { PAYLOAD_MODEL } from "@/constants/constants";

interface MessageInputProps {
  conversationId: string | null;
  recipientId?: string;
  contextSessionId?: string;
  contextSessionModel?: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL];
  onConversationCreated?: (conversationId: string) => void;
}

export const MessageInput = ({
  conversationId,
  recipientId,
  contextSessionId,
  contextSessionModel,
  onConversationCreated,
}: MessageInputProps) => {
  const [text, setText] = useState("");
    const lastCreatedConversationId = useChatStore((s) => s.lastCreatedConversationId);

  const sendMessage = useChatStore((s) => s.sendMessage);
  const [isSending,setIsSending]=useState(false);
  useEffect(() => {
      if (lastCreatedConversationId && onConversationCreated) {
          onConversationCreated(lastCreatedConversationId);
      }
    }, [lastCreatedConversationId, onConversationCreated]);
    
  const handleSend = () => {
    if (!text.trim()||isSending) return;
      setIsSending(true);
      const newMessage={
      conversationId: conversationId ?? undefined,   // present if conversation already exists
      recipientId: conversationId ? undefined : recipientId, // only needed for first message
      contextSessionId: conversationId ? undefined : contextSessionId,
      contextSessionModel: conversationId
        ? undefined
        : (contextSessionModel as typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL] | undefined),
      text: text.trim(),
    }
    sendMessage( newMessage);  
    setIsSending(false);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button size="icon" onClick={handleSend} disabled={!text.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};