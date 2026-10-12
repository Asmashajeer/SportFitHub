import { PAYLOAD_MODEL } from "@/constants/enums";
import { IAttachment, MessageType } from "@/models/message.model";




export interface SendMessagePayload {
  conversationId?: string;
  recipientId?: string; // present only on first message (no conversationId yet)
  contextSessionId?: string; // optional,if conversation start from any session
  contextSessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  type: MessageType;
  text?: string;
  attachment?: IAttachment;
}

