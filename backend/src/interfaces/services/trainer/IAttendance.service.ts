import { AttendanceMarkingRequestDTO, SessionOccuranceRequestDTO } from '@/dtos/request/trainer/trainer.attendance.request';
import { MarkAttendanceResponseDTO, SessionOccuranceResponseDTO } from '@/dtos/response/booking/booking.response.dto';

export interface IAttendanceService {
  getSessionOccurrences(data: SessionOccuranceRequestDTO): Promise<SessionOccuranceResponseDTO[]>;
  markAttendance(data: AttendanceMarkingRequestDTO): Promise<MarkAttendanceResponseDTO[]>
}
