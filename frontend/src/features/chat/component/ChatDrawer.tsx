import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useConversation } from "../hook/useConversation";
import type { PAYLOAD_MODEL } from "@/constants/constants";
import { AllMessages } from "./AllMessages";
import { MessageInput } from "./MessageInput";

interface ChatDrawerProps {
  userId: string;
  trainerName: string;
  contextSessionId?: string;
  contextSessionModel?:typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL];
}

export const ChatDrawer = ({ userId, trainerName, contextSessionId, contextSessionModel }: ChatDrawerProps) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  

  // only joins a room / marks read once a real conversationId exists — no-ops while null
  useConversation(conversationId);
  

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat with Trainer
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{trainerName}</SheetTitle>
        </SheetHeader>

        {conversationId ? (
          <AllMessages conversationId={conversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
            Send a message to start the conversation
          </div>
        )}

        <MessageInput
          conversationId={conversationId}
          recipientId={userId}
          contextSessionId={contextSessionId}
          contextSessionModel={contextSessionModel}
          onConversationCreated={setConversationId}
        />
      </SheetContent>
    </Sheet>
  );
};