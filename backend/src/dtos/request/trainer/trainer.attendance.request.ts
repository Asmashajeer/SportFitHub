export interface SessionOccuranceRequestDTO {
  trainerId: string;

  sessionModel: string;  
  attendanceMarked:boolean
  date:string
}

export interface AttendanceMarkingRequestDTO {
  sessionId: string;
  records: {
    bookingSessionId: string;
    attendance: boolean;
    
  }[];
}
