
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '../service/reviewService';
import type { PAYLOAD_MODEL } from '@/constants/constants';


interface PendingReview {
  sessionId: string;
  sessionName: string;
  sessionModel:typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL],
  trainerName: string;
  trainerId: string;
  date: string;
}
  
export const PendingReviewsBanner = () => {
  const [pending, setPending] = useState<PendingReview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPendingReview=async()=>{
       const pendingReview= await  reviewService.getPendingReviews();
       setPending(pendingReview)
    }
    // .then(setPending).catch(() => setPending([]));
    getPendingReview();
  }, []);

  if (pending.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 m-2 mb-6">
      {pending.map((item) => (
        <div
          key={item.sessionId}
          className="flex items-center border border-amber-300 justify-between px-4 py-3 rounded-lg  bg-zinc-800/40"
        >
          <p className="text-sm text-zinc-200">
            How was <span className="font-medium text-green-500 px-3">{item.sessionName}</span> 
            <span className="font-medium ">{item.trainerName}</span>?
          </p>
          <button
            onClick={() => navigate(`/user/review/${item.sessionModel}/${item.sessionId}`)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 text-zinc-900 hover:bg-amber-200"
          >
            Leave a review
          </button>
        </div>
      ))}
    </div>
  );
};