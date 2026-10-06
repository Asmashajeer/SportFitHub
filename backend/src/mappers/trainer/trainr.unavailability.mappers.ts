import { getTimezone } from "@/context/timezone.context";
import { UnavailableDayResponseDto } from "@/dtos/response/trainer/trainer.unavailablity.dto";
import { formatInTimeZone } from "date-fns-tz";

export const toUnavailableDayDto = (doc: any): UnavailableDayResponseDto => {
   const timezone = getTimezone()
  return {
  id: String(doc._id),
  date: new Date(doc.date).toISOString().slice(0, 10), 
  reason: doc.reason,
  createdAt: doc.createdAt,
}}