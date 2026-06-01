import { useState, useCallback, useEffect } from 'react';
import { sportSessionService } from '../service/sportSessionService';

export const useSession = (sessionId: string) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sportSessionService.getSessionById(sessionId);
      setSession(data.session);

      return data.session;
    } catch (err) {
      const msg = err?.toString() || 'Failed to load session';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch on mount
  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [loadSession]);

  return { session, loading, error, loadSession };
};
