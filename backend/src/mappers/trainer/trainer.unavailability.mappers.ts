
import { UnavailableDayResponseDto } from "@/dtos/response/trainer/trainer.unavailablity.dto";
import { IAvailabilityException } from "@/models/availabilityExceptions";


export const toUnavailableDayDto = (doc: IAvailabilityException): UnavailableDayResponseDto => {
  
  return {
  id: String(doc._id),
  date: new Date(doc.date).toISOString().slice(0, 10), 
  reason: doc.reason,
  createdAt: doc.createdAt,
}}