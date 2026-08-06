import type { ReviewType } from "@/constants/constants";

export interface ReviewResponseData {
  id: string;
  rating: number;
  review?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  reviewableType: ReviewType;
  reviewableId: string;
  createdAt: string;
  updatedAt: string;
}
export interface AllSessionReviewData extends Omit<ReviewResponseData,'reviewableId'> {
   sessionId:string,  //reviewableId
    sessionName:string
}