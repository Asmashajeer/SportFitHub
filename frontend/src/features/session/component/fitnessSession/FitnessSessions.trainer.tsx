import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';

import { TableSkeleton } from '@/components/reusable/SkeletonTable';

import type { FitnessSessionResponseData } from '../../store/fitness.session.types';

import CreateFitnessSessionModal from './CreateFitnessSession';
import { useFitnessSessions } from '../../hook/useFitnessSessions';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';

import { FitnessSessionTable } from './FitnessSessionTable';
import SearchBar from '@/components/reusable/SearchBar';

const FitnessSessions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<FitnessSessionResponseData | null>(null);

  const [search, setSearch] = useState('');
  const [searchParams, _] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const debouncedSearch = useDebounce(search, 500);

  const { sessions, loading, refresh, pagination } = useFitnessSessions(
    true,
    currentPage,
    debouncedSearch
  );

  useEffect(() => {
    if (!isModalOpen) {
      refresh();
    }
  }, [isModalOpen, refresh]);

  const handleEditing = (session: FitnessSessionResponseData) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedSession(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className=" flex justify-end p-1">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder=" by sessionName,type or mode.."
        />

        <Button onClick={() => setIsModalOpen(true)}>Create Session +</Button>
        {}
        <CreateFitnessSessionModal
          isOpen={isModalOpen}
          isEditing={!!selectedSession}
          sessionToEdit={selectedSession}
          onSuccess={refresh}
          onClose={handleClose}
        />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : sessions.length !== 0 ? (
        <FitnessSessionTable
          sessions={sessions}
          pagination={pagination}
          refresh={refresh}
          onEdit={handleEditing}
        />
      ) : (
        <div className="bg-card border border-dashed border-slate-200 rounded-xl p-12 text-center">
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

export default FitnessSessions;
