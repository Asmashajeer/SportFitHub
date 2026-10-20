import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useConversation } from "../hook/useConversation";
import { ConversationList } from "../component/ConversationList";
import { AllMessages } from "../component/AllMessages";
import { MessageInput } from "../component/MessageInput";

const ChatInboxPage = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  useConversation(activeConversationId);
  const [partner,setPartner]=useState("");

  return (
    <div className="bg-card flex h-dvh flex-col p-2 sm:p-6">
      <h1 className="text-xl font-bold p-2 shrink-0">Inbox</h1>

      <div className="flex flex-1 min-h-0 border rounded-lg overflow-hidden">
        {/* Left pane — conversation list
            Mobile: visible only when no conversation is selected
            sm+: always visible */}
        <div
          className={`${
            activeConversationId ? "hidden" : "flex"
          } sm:flex flex-col w-full sm:w-80 border-r shrink-0 min-h-0 overflow-y-auto`}
        >
          <ConversationList
            setPartner={setPartner}
            onSelect={setActiveConversationId}
            activeConversationId={activeConversationId}
          />
        </div>

        {/* Right pane — active conversation
            Mobile: visible only when a conversation is selected
            sm+: always visible */}
        <div
          className={`${
            activeConversationId ? "flex" : "hidden"
          } sm:flex flex-col flex-1 min-w-0 min-h-0`}
        >
          {activeConversationId ? (
            <>
              {/* Back button — mobile only */}
              
              <button
                type="button"
                onClick={() => setActiveConversationId(null)}
                className="sm:hidden flex items-center gap-2 border-b p-3 text-sm font-medium shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <AllMessages conversationId={activeConversationId} partner={partner} />
              </div>
              <div className="shrink-0">
                <MessageInput conversationId={activeConversationId} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>No messages yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInboxPage;