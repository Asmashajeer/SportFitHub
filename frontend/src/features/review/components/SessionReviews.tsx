// components/reviews/SessionReviews.tsx
import { useEffect, useState } from 'react';
import type { ReviewResponseData } from '../types/review.types';
import type { ReviewType } from '@/constants/constants';
import { reviewService } from '../service/reviewService';


interface SessionReviewsProps {
  reviewableId: string;
  reviewableType: ReviewType;
}

export const SessionReviews = ({ reviewableId, reviewableType }: SessionReviewsProps) => {
  const [ratingReview, setRatingReview] = useState({ avgRating: 0, reviewCount: 0 });
  const [reviews, setReviews] = useState<ReviewResponseData[]>([]);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRating=async()=>{  
        try{     
            const data=await reviewService.getAvgRatingAndCount(reviewableId, reviewableType);
           setRatingReview({ avgRating: data.averageRating, reviewCount: data.totalReviews });
        }
        catch(err){
            console.error('Failed to load rating summary:', err);
            setLoading(false)
        } 
    }  
    
    const getReviews=async()=>{   
        setLoading(true);
        try{
            const res= await reviewService .getReviews(reviewableId, reviewableType )      
                setReviews(res);   
                   
        }
        catch(err){
            console.error('Failed to load reviews:', err)
            setLoading(false)
        }
    }  
    if (reviewableId) {
        getRating();
        getReviews();
         setLoading(false) 
    }
    
  }, [reviewableId, reviewableType]);

  

  return (
    <div className="mt-10 pt-4 w-full  border-t-zinc-100 border-e-zinc-600">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Reviews</h2>
        {ratingReview.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <span className="text-amber-400">★</span>
            <span className="font-medium text-zinc-200">{ratingReview.avgRating.toFixed(1)}</span>
            <span>
              ({ratingReview.reviewCount} review{ratingReview.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading reviews...</p>
      ) : reviews?.length === 0 ? (
        <p className="text-sm text-zinc-500">No reviews yet for this session.</p>
      ) : (
        <div className="flex flex-col gap-4 ">
          {reviews && reviews.map((r) => (
            <div key={r.id} className="border border-zinc-800 rounded-lg p-4 w-sm ">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-zinc-200">{r.user.name}</p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= r.rating ? 'text-amber-400' : 'text-zinc-700'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {r.review && (
                <p className="text-sm  text-zinc-200 leading-relaxed truncate hover:whitespace-normal hover:overflow-visible transition-all"
                    >{r.review}</p>
              )}

              <p className="text-xs text-zinc-600 mt-2">
                {new Date(r.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}

     
    </div>
  );
};