
import { UnavailableDayResponseDto } from "@/dtos/response/trainer/trainer.unavailablity.dto";
import { IAvailabilityException } from "@/models/availabilityExceptions";


export const toUnavailableDayDto = (doc: IAvailabilityException): UnavailableDayResponseDto => {
  
  return {
    id: String(doc?._id),
    date: (doc.date).toISOString().slice(0, 10),   
    isFullDay:doc.isFullDay,
    slots:doc.slots ?? null , 
    reason: doc.reason,
    createdAt: doc.createdAt,
  }
}