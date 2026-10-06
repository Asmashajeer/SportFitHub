import { CancelAvailabilityDto } from "@/dtos/request/trainer/trainer.unavailability.request";
import { UnavailableDayResponseDto } from "@/dtos/response/trainer/trainer.unavailablity.dto";

export interface ITrainerUnavailabilityService{
    cancelAvailability(userId: string, {date,reason}: CancelAvailabilityDto ) ;
    restoreAvailability(userId: string, date: string);
    getUnavailability(userId: string):Promise<UnavailableDayResponseDto[]>
    getPublicUnavailableDates(trainerId: string): Promise<string[]>
}