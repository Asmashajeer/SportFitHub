

export interface statsDTO{
    total: number  ,

    pending: number,
    active: number,
    inactive: number,
    rejected: number
}

export interface SessionStatsResponseDTO{
    sportsStats: statsDTO,
   fitnessStats: statsDTO,
   
}
export interface  AdminSessionFilterDTO{
    page:number   ,
    limit:number  ,
    search: string
    status:string  ,
    sessionType:string  ,
    mode:string  ,
     
}




