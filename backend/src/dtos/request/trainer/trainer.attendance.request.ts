export interface SessionOccuranceRequestDTO{
    trainerId:string,
    page:number,
    sessionModel:string,
    date:string,
    status:string,

}

export interface AttendanceMarkingRequestDTO{
    sessionId:string,
    records:{
        bookingSessionId:string,
        attendance:boolean
    }[]    ;
}
