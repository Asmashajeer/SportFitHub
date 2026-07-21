import { PAYLOAD_MODEL } from '@/constants/enums';
import { IConversation } from '@/models/conversation.model';
import { Types } from 'mongoose';

export interface IconversationPopulatedParticipants extends Omit<IConversation, 'participants' | 'contextSessionId'> {
  participants: {
    _id: Types.ObjectId;
    name: string;
    roles: string[];
  }[];
  contextSessionId: {
    _id: Types.ObjectId;
    sessionName: string;
  } | null;
}

export interface createConversationRequestDTO {
  participants: string[];
  contextSessionId?: string;
  contextSessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
}

export interface sendMessageRequestDTO {
  conversationId: string;
  sender: string;
  //   receiver: Types.ObjectId;
  text: string;
  readBy: string[];
}
