import { BOOKING_SESSION_STATUS, PAYLOAD_MODEL } from "@/constants/enums";

interface participants {
  bookingSessionId: string;
  userId: string;
  name: string;
  email: string;
  attendance: boolean;
}

export interface SessionOccuranceResponseDTO {
  sessionId: string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  sessionName: string;
  sessionType: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  isbookedSessionGroup: boolean;
  participants: participants[];
}

export interface MarkAttendanceResponseDTO{
  id: string;
  bookingId: string;
  userId: string;
  trainerId: string;
  sessionId: string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  status: BOOKING_SESSION_STATUS;
  attendance: boolean;
}