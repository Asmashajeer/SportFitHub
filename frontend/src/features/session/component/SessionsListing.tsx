// pages/SessionsListingPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// import LoadingGrid from '@/features/sessions/components/LoadingGrid';
// import FilterBar from '@/features/sessions/components/FilterBar';
import { sessionService } from '@/features/session/service/sessionService';
import { reviewService } from '@/features/review/service/reviewService';
import EmptyState from '@/features/user/component/EmptyState';
import SessionGrid from '@/features/session/component/SessionGrid';
import type { SessionPublicResponseData } from '@/features/session/store/types';
import { PAYLOAD_MODEL, Review_Type } from '@/constants/constants';


const SessionsListing = () => {
   const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const category = searchParams.get('category') || '';
  const mode = searchParams.get('mode') || '';
  const priceMax = searchParams.get('priceMax') || '';

   const [sessions, setSessions] = useState<SessionPublicResponseData[]>([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [loading, setLoading] = useState(false);
  console.log('query:',query);
  useEffect(() => {
    fetchSessions();
  }, [query,category, mode, priceMax]);


  const fetchSessions = async () => {
    setLoading(true);
    try {
      
      const data = query
        ? await sessionService.semanticSearch(query)
        : await sessionService.getAllSessions();
      setSessions(data.sessions);

      const fetchRatings = async (sessions : SessionPublicResponseData[]) => {
        const sportsIds = sessions.filter(s => s.sessionModel === PAYLOAD_MODEL.SPORT_SESSION).map(s => s.id);
        const fitnessIds = sessions.filter(s => s.sessionModel === PAYLOAD_MODEL.FITNESS_SESSION).map(s => s.id);

        const [sportsRatings, fitnessRatings] = await Promise.all([
            sportsIds.length ? reviewService.getBatchRatings(sportsIds, Review_Type.SPORTS_SESSION) : {},
            fitnessIds.length ? reviewService.getBatchRatings(fitnessIds, Review_Type.FITNESS_SESSION) : {},
        ]);

        setRatingsMap({ ...sportsRatings, ...fitnessRatings });
    };
     fetchRatings (sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
   const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
  };
  return (
    <div className="section-container pt-24 px-4 pb-16">
      {query && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing results for <span className="font-semibold text-foreground">"{query}"</span>
          </p>
          <button
            onClick={clearSearch}
            className="text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )} 
      {loading ? (
        <div className="flex justify-center py-12 text-sm text-muted-foreground">
          Loading sessions...
        </div>
      ) : sessions.length > 0 ? (
        <SessionGrid sessions={sessions} ratingsMap={ratingsMap} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default SessionsListing;