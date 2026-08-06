export interface SessionOccuranceRequestDTO {
  trainerId: string;

  sessionModel: string;  
  attendanceMarked:boolean
}

export interface AttendanceMarkingRequestDTO {
  sessionId: string;
  records: {
    bookingSessionId: string;
    attendance: boolean;
  }[];
}
