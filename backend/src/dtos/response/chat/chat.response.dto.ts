import { PAYLOAD_MODEL } from '@/constants/enums';

interface LastMessage {
  text: string;
  sender?: string;
  createdAt?: string;
}

export interface ConversationResponseDTO {
  id: string;
  participants: string[];
  contextSessionId: string;
  contextSessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  lastMessage?: LastMessage;
}
export interface ConversationPopulatedResponseDTO extends Omit<ConversationResponseDTO, 'participants' | 'contextSessionId'> {
  participants: {
    id: string;
    name: string;
    roles: string[];
  }[];
  contextSession: {
    id: string;
    name: string;
  } | null;
}

export interface MessageResponseDTO {
  conversationId: string;
  sender: string;
  //   receiver: string;
  text: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}
