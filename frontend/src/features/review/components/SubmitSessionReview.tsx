import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewService } from '../service/reviewService';
import type { ReviewType } from '@/constants/constants';

import toast from 'react-hot-toast';



interface ReviewableSession {
  sessionId: string;
  sessionName: string;
  sessionModel:ReviewType
  trainerId: string;
  trainerName: string;
  date: string;
}

const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const SubmitSessionReview = () => {
  const { sessionId } = useParams<{ sessionId: string,sessionModel:ReviewType }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<ReviewableSession | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sessionId ) return;

    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await reviewService.getSessionForReview(sessionId);
     
        setSession(data);
      } catch (err) {
        setError('This session could not be found, or you may have already reviewed it.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmit = async () => {
    if (!session || rating === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      await reviewService.submitReview({
        sessionId:session.sessionId,
        sessionModel:session.sessionModel,        
        rating,                // 1-5
        review: review.trim() || undefined,        
      
      });
      setSubmitted(true);
    } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong submitting your review. Please try again.')
        setError('Something went wrong submitting your review. Please try again.' );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card p-6">
        <div className="text-center">
          <p className="text-sm text-zinc-400">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-xs font-medium px-4 py-2 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card p-6">
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-semibold text-zinc-100">Thanks for your feedback!</h2>
          <p className="text-sm text-zinc-500 mt-2">
            Your review helps {session?.trainerName} and other members.
          </p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="mt-5 text-xs font-medium px-4 py-2 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-800/70 border border-zinc-700 rounded-xl p-6">
        <h1 className="text-lg font-semibold text-zinc-100">How was your session?</h1>
        <p className="text-s text-green-400 mt-1">
        <strong> {session?.sessionName}</strong> with  <strong>{session?.trainerName}</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">
          {session && new Date(session.date).toLocaleDateString()}
        </p>

        {/* Star rating */}
        <div className="mt-6">
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl leading-none transition-colors"
                aria-label={`Rate ${star} stars`}
              >
                <span
                  className={
                    star <= (hoverRating || rating) ? 'text-amber-400' : 'text-zinc-500'
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-2 h-4">
            {(hoverRating || rating) > 0 ? STAR_LABELS[(hoverRating || rating) - 1] : ''}
          </p>
        </div>

        {/* Review */}
        <div className="mt-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share more about your experience (optional)"
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/40 text-sm text-zinc-200 placeholder:text-zinc-500 p-3 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <p className="text-right text-xs text-zinc-500 mt-1">{review.length}/500</p>
        </div>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full mt-5 text-sm font-medium px-4 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default SubmitSessionReview ;