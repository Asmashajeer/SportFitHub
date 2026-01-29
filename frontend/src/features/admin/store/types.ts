

export interface DashboardStats{
    totalusers:number,
    ActiveUsers:number,
   
}


export interface queryParamsOptions {
  page: number;
  search?: string;
  status?: string;
  role?: string;
}
export interface getAllusersParams extends queryParamsOptions{
  limit:number
}