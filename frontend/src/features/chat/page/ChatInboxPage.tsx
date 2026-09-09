import {  useState } from "react";
import { MessageCircle } from "lucide-react";
import { useConversation } from "../hook/useConversation";
import { ConversationList } from "../component/ConversationList";
import { AllMessages } from "../component/AllMessages";
import { MessageInput } from "../component/MessageInput";


const ChatInboxPage = () => {
 
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);  
  useConversation(activeConversationId);

  return (
    
    <div className="bg-card min-h-screen p-6">
        <h1 className="text-xl font-bold p-2">Inbox</h1>
      <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden">
        {/* Left pane — conversation list */}
          <div className="w-full  sm:w-80 border-r shrink-0">
            <ConversationList
              onSelect={setActiveConversationId}
              activeConversationId={activeConversationId}
            />
          </div>

        {/* Right pane — active conversation */}
          <div className="hidden sm:flex flex-col flex-1">
            {activeConversationId ? (
              <>
                <AllMessages conversationId={activeConversationId} />
                <MessageInput conversationId={activeConversationId} />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Select a conversation to start chatting</span>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

 export default ChatInboxPage;