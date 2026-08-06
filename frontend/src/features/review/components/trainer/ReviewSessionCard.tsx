import { oneDay } from "@/constants/constants";
import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import { Stars } from "../../page/TrainerReviewsPage";
import type { AllSessionReviewData } from "../../types/review.types";
interface groupedSession{
 reviewsCount: number;
 averageRating: number;
 sessionId: string;
 sessionName: string;
 reviews: AllSessionReviewData[];
}
const ReviewSessionCard=({ session }:{session:groupedSession})=> {
  const [open, setOpen] = useState(false);
  const visibleReviews = open ? session.reviews : session.reviews.slice(0, 1);

  const  timeAgo=(dateStr:string)=> {
        const days = Math.floor((new Date().getTime()- new Date(dateStr).getTime()) / oneDay);
        if (days < 1) return "today";
        if (days === 1) return "1 day ago";
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        return `${months} mo ago`;
    }
 
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-800">
        <div className=" min-w-0">
          <h3 className="text-sm font-semibold text-green-300  truncate">{session.sessionName}
          <span className="text-sm text-gray-500 ps-2">{session.reviews[0].reviewableType}</span> </h3>
          <div className="mt-1 flex items-center gap-2">
            <Stars value={session.averageRating} />
            <span className="text-xs text-zinc-500">
              {session.averageRating.toFixed(1)} · {session.reviewsCount} reviews
            </span>
          </div>
        </div>
        {/* <TrendBadge trend={session.trend} /> */}
      </div>
 
      <div className="divide-y divide-zinc-800/70">
        {visibleReviews.map((r) => (
          <div key={r.id} className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-zinc-300">
                  {r.user.name.charAt(0)}
                </div>
                <span className="text-sm text-zinc-200">{r.user.name}</span>
              </div>
              <span className="text-xs text-zinc-500">{timeAgo(r.createdAt)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={r.rating} size={12} />
            </div>
            {r.review && <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{r.review}</p>}
          </div>
        ))}
      </div>
 
      {session.reviews.length > 1 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors border-t border-zinc-800"
        >
          {open ? "Show less" : `Show all ${session.reviews.length} reviews`}
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

export default ReviewSessionCard;


