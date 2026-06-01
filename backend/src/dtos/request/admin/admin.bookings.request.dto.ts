export interface AdminBookingsFilterDTO{
   
  page: number;
  limit: number;
  search: string;
  status: string;
  sessionModel: string;
}
