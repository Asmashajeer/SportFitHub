import { SessionTable } from './SessionTable';
import { Button } from '@/components/ui/Button';

import CreateSportSessionModal from './CreateSportSession';
import { useEffect, useState } from 'react';
import { useSportSessions } from '../../../../session/hook/useSportSessions';
import { TableSkeleton } from '@/components/reusable/SkeletonTable';
import type { SportsSessionResponseData } from '../../../../session/store/session.types';

import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/reusable/SearchBar';

const SportsSessions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedSession, setSelectedSession] =
    useState<string | null>(null);

  // const [selectedSession, setSelectedSession] =
  //   useState<SportsSessionResponseData | null>(null);

  const [search, setSearch] = useState('');
  const [searchParams, _] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const debouncedSearch = useDebounce(search, 500);

  const { sessions, loading, refresh, pagination } = useSportSessions(
    true,
    currentPage,
    debouncedSearch
  );

  useEffect(() => {
    if (!isModalOpen) {
      refresh();
    }
  }, [isModalOpen, refresh]);

  const handleEditing = (sessionId:string) => {
    setSelectedSession(sessionId);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedSession(null);
    setIsModalOpen(false);
  };
  return (
    <div className="">
      <div className=" flex justify-end p-1">
        {sessions.length > 0 && (
          <>
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder=" by sessionName,type or mode.."
            />

            <Button onClick={() => setIsModalOpen(true)}>
              Create Session +
            </Button>
          </>
        )}
        <CreateSportSessionModal
          isOpen={isModalOpen}
          isEditing={!!selectedSession}
          sessionIdToEdit={selectedSession?selectedSession:""}
          onSuccess={refresh}
          onClose={handleClose}
        />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : sessions.length > 0 ? (
        <SessionTable
          sessions={sessions}
          pagination={pagination}
          refresh={refresh}
          onEdit={handleEditing}
        />
      ) : (
        <div className=" border border-dashed bg-transparent border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-600 mb-4">
            You haven't created any sessions yet.
          </p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Create your first session
          </Button>
        </div>
      )}
    </div>
  );
};

export default SportsSessions;
