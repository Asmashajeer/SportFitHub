import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { sessionService } from '@/features/session/service/sessionService';
import { reviewService } from '@/features/review/service/reviewService';
import type { FitnessData, SportData } from '@/features/admin/store/types';
import { PAYLOAD_MODEL, Review_Type } from '@/constants/constants';
import type { SessionPublicResponseData } from '../store/types';
import SessionGrid from './SessionGrid';
import { fitnessSessionService } from '../service/fitnessSessionService ';
import { sportSessionService } from '../service/sportSessionService';
import FilterPanel, { EmptyFilterState } from './FilterPanel';
import { LoadingScreen } from '@/components/reusable/LoadingScreen';

const SessionsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Session data
  const [allSessions, setAllSessions] = useState<SessionPublicResponseData[]>([]);
  const [sports, setSports] = useState<SportData[] | null>(null);
  const [programs, setPrograms] = useState<FitnessData[]>([]);

  const [ratingsMap, setRatingsMap] = useState<Record<string, { avgRating: number; reviewCount: number }>>({});
  const [loading, setLoading] = useState(false);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('');

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (sportFilter !== 'all') count++;
    if (programFilter !== 'all') count++;
    if (ageGroupFilter !== 'all') count++;
    if (sessionTypeFilter !== 'all') count++;
    if (ratingFilter !== '') count++;
    return count;
  }, [categoryFilter, sportFilter, programFilter, ageGroupFilter, sessionTypeFilter, ratingFilter]);

  // Reset all filters
  const resetAllFilters = () => {
    setCategoryFilter('all');
    setSportFilter('all');
    setProgramFilter('all');
    setAgeGroupFilter('all');
    setSessionTypeFilter('all');
    setRatingFilter('');
  };

  // Fetch sessions and related data
  useEffect(() => {
    fetchSessions();
  }, [query]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = query ? await sessionService.semanticSearch(query) : await sessionService.getAllSessions();

      setAllSessions(data.sessions);

      // Fetch sports and programs for filters
      const [sportsData, programsData] = await Promise.all([sportSessionService.getAvailableSports(), fitnessSessionService.getAvailableFitnessPgms()]);

      setSports(sportsData.sports);
      setPrograms(programsData.fitnessPgms);

      // Fetch ratings
      const fetchRatings = async (sessions: SessionPublicResponseData[]) => {
        const sportsIds = sessions.filter((s) => s.sessionModel === PAYLOAD_MODEL.SPORT_SESSION).map((s) => s.id);
        const fitnessIds = sessions.filter((s) => s.sessionModel === PAYLOAD_MODEL.FITNESS_SESSION).map((s) => s.id);

        const [sportsRatings, fitnessRatings] = await Promise.all([
          sportsIds.length ? reviewService.getBatchRatings(sportsIds, Review_Type.SPORTS_SESSION) : {},
          fitnessIds.length ? reviewService.getBatchRatings(fitnessIds, Review_Type.FITNESS_SESSION) : {},
        ]);

        setRatingsMap({ ...sportsRatings, ...fitnessRatings });
      };

      fetchRatings(data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next);
    setAllSessions([]);
  };

  // Apply filters to sessions
  const filteredSessions = useMemo(() => {
    return allSessions.filter((session: SessionPublicResponseData) => {
      // 1. Category Filter (Sport vs Fitness)
      if (categoryFilter !== 'all' && session.sessionModel !== categoryFilter) {
        return false;
      }

      // 2. Sport Filter (Applies when model is SportSession)
      if (sportFilter !== 'all' && session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION && (session as any).sportCategory !== sportFilter) {
        return false;
      }

      // 3. Program Filter (Applies when model is FitnessSession)
      if (programFilter !== 'all' && session.sessionModel === PAYLOAD_MODEL.FITNESS_SESSION && (session as any).fitnessCategory !== programFilter) {
        return false;
      }

      // 4. Age Group Filter
      if (ageGroupFilter !== 'all' && session.ageGroup !== ageGroupFilter) {
        return false;
      }

      // 5. Session Type Filter
      if (sessionTypeFilter !== 'all' && session.sessionType !== sessionTypeFilter) {
        return false;
      }

      // 6. Rating Filter
      if (ratingFilter !== '') {
        const avgRating = ratingsMap[session.id].avgRating || 0;
        if (avgRating < Number(ratingFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [allSessions, categoryFilter, sportFilter, programFilter, ageGroupFilter, sessionTypeFilter, ratingFilter, ratingsMap]);

  const searchSummary = useMemo(() => {
    const parts: string[] = [];

    if (query) parts.push(`"${query}"`);

    if (categoryFilter !== 'all') {
      parts.push(categoryFilter === PAYLOAD_MODEL.SPORT_SESSION ? 'Sports' : 'Fitness');
    }
    if (sportFilter !== 'all') {
      parts.push(sports?.find((s) => s.id === sportFilter)?.sportName ?? 'Sport');
    }
    if (programFilter !== 'all') {
      parts.push(programs.find((p) => p.id === programFilter)?.programName ?? 'Program');
    }
    if (ageGroupFilter !== 'all') parts.push(ageGroupFilter);
    if (sessionTypeFilter !== 'all') parts.push(sessionTypeFilter);
    if (ratingFilter !== '') parts.push(`${ratingFilter}★ & up`);

    return parts.join(' · ');
  }, [query, categoryFilter, sportFilter, programFilter, ageGroupFilter, sessionTypeFilter, ratingFilter, sports, programs]);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">Sessions & Classes</h1>
              <p className="text-sm text-muted-foreground mt-1">Explore sports and fitness sessions in your area</p>
            </div>

            {/* Search Result Info */}
            {query && (
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing results for <span className="font-semibold text-foreground">{searchSummary}</span>
                </p>
                <button onClick={clearSearch} className="text-primary hover:underline">
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <FilterPanel
              activeFilterCount={activeFilterCount}
              resetAllFilters={resetAllFilters}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sportFilter={sportFilter}
              setSportFilter={setSportFilter}
              programFilter={programFilter}
              setProgramFilter={setProgramFilter}
              ageGroupFilter={ageGroupFilter}
              setAgeGroupFilter={setAgeGroupFilter}
              sessionTypeFilter={sessionTypeFilter}
              setSessionTypeFilter={setSessionTypeFilter}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              sports={sports}
              programs={programs}
            />
          </aside>

          {/* Sessions Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingScreen />
            ) : filteredSessions.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredSessions.length}</span> result{filteredSessions.length !== 1 && 's'} found
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={resetAllFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Reset all filters
                    </button>
                  )}
                </div>

                <div className="">
                  <SessionGrid sessions={filteredSessions} ratingsMap={ratingsMap} />
                </div>
              </>
            ) : (
              allSessions.length > 0 && <EmptyFilterState resetAllFilters={resetAllFilters} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionsListing;
