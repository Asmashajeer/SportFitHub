import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {  Edit, Eye, EyeOff, X } from 'lucide-react';
import ConfirmDialog from '@/components/reusable/ConfirmDialog';
import toast from 'react-hot-toast';
import type { FitnessSessionResponseData } from '../../../../session/store/fitness.session.types';
import type { PaginationResponseData } from '../../../../session/store/session.types';

import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';
import { trainerBookingsService } from '@/features/trainer/service/trainer.bookings.service';
import { useState } from 'react';
import { TrainerFitnessSessionService } from '@/features/trainer/service/sessionService/trainer.fitness.session.service';
import DeleteSessionDialog from '../DeleteSessionDialog';
import Pagination from '@/components/reusable/Pagination';

interface Props {
  sessions: FitnessSessionResponseData[];
  pagination: PaginationResponseData;
  onEdit: (session: FitnessSessionResponseData) => void;
  refresh: () => void;
}

export const FitnessSessionTable = ({ sessions, pagination, onEdit, refresh }: Props) => {
  // const [_, setSearchParams] = useSearchParams();
   const [currentPage, setCurrentPage] = useState(pagination.page||1);
  // const handlePageChange = (newPage: number) => {
  //   setSearchParams({ page: newPage.toString() });
  // };
  const [hasBookings, setHasBookings] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed bg-card rounded-xl">
        <h3 className="text-lg font-semibold text-slate-700">No sessions scheduled</h3>
        <p className="text-slate-500 mb-4">Start by creating your first sport session.</p>
      </div>
    );
  }
  const handleDeleteSession = async (id: string) => {
    try {
      const data = await trainerBookingsService.getBookedSessionsBySessionId(id);
      if (data.length === 0) {
        const data = await TrainerFitnessSessionService.deleteSession(id);
        toast.success(`${data.session.sessionName} deleted`);
        refresh();
      } else {
        setHasBookings(true);
        setDeleteTarget(id);
      }
    } catch (error) {
      toast.error(error?.toString() || 'failed to create session');
    }
  };
  //  Action handlers
  const handleSessionVisibility = async (sessionId: string, isActive: boolean) => {
    await TrainerFitnessSessionService.updateSessionVisibility(sessionId, isActive);
    toast.success('Session made inactive');
    setDeleteTarget(null);
    refresh();
  };

  const handleDeleteAnyway = async () => {
    await TrainerFitnessSessionService.deleteSession(deleteTarget!);
    toast.success('Session deleted, refund to users Wallet and notification sent to users');
    setDeleteTarget(null);
    refresh();
  };

  const handleCancel = () => {
    setDeleteTarget(null);
    setHasBookings(false);
  };
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-62.5 text-left text-slate-500 font-bold">Session Name</TableHead>
              <TableHead className=" text-slate-500 font-bold">Type</TableHead>
              <TableHead className="text-slate-500 font-bold  ">Duration</TableHead>
              <TableHead className="text-slate-500 font-bold  ">Level</TableHead>
              <TableHead className="text-slate-500 font-bold  ">Mode</TableHead>
              <TableHead className="text-slate-500 font-bold  ">Status</TableHead>
              <TableHead className="text-right text-slate-500 font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="group text-left">
                <TableCell className="font-medium text-left">
                  <div className="flex flex-col">
                    <span>{session.sessionName}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{session.sessionType.toLowerCase()}</TableCell>
                <TableCell>{session.duration} mins</TableCell>
                <TableCell>{session.intensityLevel}</TableCell>
                <TableCell>{session.mode} </TableCell>
                <TableCell>
                  {/* Using Shadcn Badge component */}
                  <Badge variant={session.isActive ? 'default' : 'secondary'} className={session.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                    {session.isActive ? 'Active' : 'Inactive'} <span className={`${session?.isApproved ?'text-green-600':'text-red-600'}`}> {session.isApproved?"":'Pending Approval' }</span>
                   
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={() => onEdit(session)}>
                    <Edit />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={() => {
                      handleSessionVisibility(session.id, !session.isActive);
                    }}
                  >
                    {session.isApproved &&(
                      session.isActive ? (
                        <>
                          <EyeOff size={12} />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye size={12} />
                          Show
                        </>
                      )
                    )}
                  </Button>
                  <ConfirmDialog
                    icon={<X className="h-4 w-4 text-red-400" />}
                    title={`Delete ${session.sessionName} ?`}
                    description={`this will remove ${session.sessionName} from sessions list `}
                    onConfirm={() => handleDeleteSession(session.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hasBookings && deleteTarget && <DeleteSessionDialog sessionId={deleteTarget} onCancel={handleCancel} sessionVisibility={handleSessionVisibility} onDeleteAnyway={handleDeleteAnyway} />}
      </div>
      {/* --- PAGINATION CONTROLS --- */}
       <Pagination
        totalPages={pagination.totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={pagination.total}
        setCurrentPage={setCurrentPage}
        label="Sessions"
      />
    </div>
  );
};
