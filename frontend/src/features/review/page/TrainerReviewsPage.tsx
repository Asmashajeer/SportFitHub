import { MessageSquare, Star,  } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reviewService } from "../service/reviewService";
import { useTrainerStore } from "@/features/trainer/store/useTrainerStore";
import type { AllSessionReviewData } from "../types/review.types";
import ReviewSessionCard from "../components/trainer/ReviewSessionCard";


export default function TrainerReviewsPage() {
  const [sortBy, setSortBy] = useState("rating-desc");
  const  {profile,fetchProfile}=useTrainerStore();
  const [reviews,setReviews] =useState< AllSessionReviewData []|null>(null);

  useEffect(()=>{
    fetchProfile();
  },[]);

  useEffect(()=>{
    const getReviews=async()=>{
        if(!profile)return;
        try{
          const Allreviews=await reviewService.getReviewsByTrainer(profile.id);
          setReviews(Allreviews);
        } catch (error) {
          console.error("Failed to load trainer reviews:", error);      
          setReviews([]);
        }
    }
    getReviews();
  },[profile]);

    const groupedSessions = useMemo(() => {
        if (!reviews || reviews.length === 0) return [];
        const reviewMap = new Map <string,
            {
                sessionId: string;
                sessionName: string;
                reviews: AllSessionReviewData[];
                averageRating: number;
                reviewsCount: number;
            }>();

       reviews?.forEach((r) => {
          const key = r.sessionId;
          if (!reviewMap.has(key)) 
            reviewMap.set(key,{
                    sessionId: key,
                    sessionName: r.sessionName || "Session",
                    reviews: [],
                    averageRating: 0,
                    reviewsCount: 0,
                    });
            const group = reviewMap.get(key)!;
            group.reviews.push(r);
        });

         // average ratings for each session group
        return Array.from(reviewMap.values()).map((group) => {
        const totalRating = group.reviews.reduce((sum, r) => sum + r.rating, 0);
        const reviewsCount = group.reviews.length;
            return {
                ...group,
                reviewsCount,
                averageRating: reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : 0,
            };
        });

    },[reviews]);
    
    //  overall statistics for the header
    const overallData = useMemo(() => {
        if (!reviews || reviews.length === 0) {
        return { averageRating: 0, reviewsCount: 0 };
        }
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        return {
        averageRating: Number((totalRating / reviews.length).toFixed(1)),
        reviewsCount: reviews.length,
        };
    }, [reviews]);
   
 
  const sortedSessions = useMemo(() => {
    const arr = [...groupedSessions];
    if (sortBy === "rating-desc") arr.sort((a, b) => b.averageRating - a.averageRating);
    if (sortBy === "rating-asc") arr.sort((a, b) => a.averageRating - b.averageRating);
    if (sortBy === "reviews-desc") arr.sort((a, b) => b.reviewsCount - a.reviewsCount);
    return arr;
  }, [sortBy, groupedSessions])
 
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium uppercase tracking-wide mb-1">
            <MessageSquare size={13} />
            Reviews &amp; Ratings
          </div>
          <h1 className="text-2xl font-semibold text-zinc-50">How is  your sessions </h1>
        </div>

        {/* Overall summary */}
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-900/40 px-5 py-5 mb-6 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-zinc-50">
              {overallData.averageRating.toFixed(1)}
            </div>
            <Stars value={overallData.averageRating} size={16} />
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-300">{overallData.reviewsCount} total reviews</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              across {groupedSessions.length} sessions
            </div>
          </div>
        </div>

        {/* Sort control */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            By session
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          >
            <option value="rating-desc">Highest rated</option>
            <option value="rating-asc">Lowest rated</option>
            <option value="reviews-desc">Most reviewed</option>
          </select>
        </div>

        {/* Session cards */}
        <div className="space-y-4">
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => (
              <ReviewSessionCard key={session.sessionId} session={session} />
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No reviews found for your sessions yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.5}
          className={n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-transparent text-zinc-700"}
        />
      ))}
    </div>
  );
}