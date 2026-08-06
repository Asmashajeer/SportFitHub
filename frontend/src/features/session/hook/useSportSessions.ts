import { useState, useCallback, useEffect } from 'react';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';
import { TrainerSportSessionService } from '@/features/trainer/service/sessionService/trainer.sports.session.service';

export const useSportSessions = (
  initialFetch = true,
  page = 1,
  search = ''
) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION_DEFAULT_LIMIT || 10,
    total: 0, //total session
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TrainerSportSessionService.getTrainerSessions({
        page,
        search,
      });

      setSessions(data.sessions);
      setPagination(data.pagination);
      return data; // Return data so callers can use .then()
    } catch (err) {
      const msg = err?.toString() || 'Failed to load sessions';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Initial fetch on mount
  useEffect(() => {
    if (initialFetch) {
      loadSessions();
    }
  }, [loadSessions, initialFetch]);

  return { sessions, pagination, loading, error, refresh: loadSessions };
};
