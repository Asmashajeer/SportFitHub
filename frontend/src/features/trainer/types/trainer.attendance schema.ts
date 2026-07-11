import z from "zod"

export const  AttendanceRecordSchema=z.object({
    bookingSessionId:z.string(),
    attendance:z.boolean()
})


export type AttendanceMarkingData=z.infer<typeof AttendanceRecordSchema>
 
