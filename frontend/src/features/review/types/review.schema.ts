import { Review_Type } from "@/constants/constants"
import z from "zod"

export const SessionReviewSchema=z.object({
    rating:z.number().min(1,"give rating"),                // 1-5
    review: z.string().optional(),         
    sessionModel: z.enum(Review_Type),
    sessionId: z.string() 
})
export type SessionReviewData=z.infer<typeof SessionReviewSchema>
