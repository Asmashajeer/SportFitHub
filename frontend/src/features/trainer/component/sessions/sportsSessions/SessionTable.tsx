import { Button } from '@/components/ui/Button';
import type {
  PaginationResponseData,
  SportsSessionResponseData,
} from '../../../../session/store/session.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronLeft, ChevronsRight, Edit, Eye, EyeOff, X } from 'lucide-react';
import ConfirmDialog from '@/components/reusable/ConfirmDialog';

import toast from 'react-hot-toast';

import { useSearchParams } from 'react-router-dom';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

import { trainerBookingsService } from '@/features/trainer/service/trainer.bookings.service';

import { useState } from 'react';
import DeleteSessionDialog from '../DeleteSessionDialog';
import { TrainerSportSessionService } from '@/features/trainer/service/sessionService/trainer.sports.session.service';

interface Props {
  sessions: SportsSessionResponseData[];
  pagination: PaginationResponseData;
  onEdit: (sessionId: string) => void;
  refresh: () => void;
}

export const SessionTable = ({
  sessions,
  pagination,
  onEdit,
  refresh,
}: Props) => {
  const [_, setSearchParams] = useSearchParams();
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };
  const [hasBookings, setHasBookings] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed bg-card rounded-xl">
        <h3 className="text-lg font-semibold text-slate-700">
          No sessions scheduled
        </h3>
        <p className="text-slate-500 mb-4">
          Start by creating your first sport session.
        </p>
      </div>
    );
  }
  const handleDeleteSession = async (id: string) => {
    try {
      const data= await trainerBookingsService.getBookedSessionsBySessionId(id);
      if(data.length===0){
          const data = await TrainerSportSessionService.deleteSession(id);
          toast.success(`${data.session.sessionName} deleted`);
          refresh();
      }
      else{
       setHasBookings(true);
       setDeleteTarget(id);
      }
    } catch (error) {
      console.log(error);
      toast.error( 'failed to create session');
    }
  };
//  Action handlers
const handleSessionVisibility = async (sessionId:string,isActive:boolean) => {
  await  TrainerSportSessionService.updateSessionVisibility(sessionId,isActive);
  toast.success('Session made inactive');
  setDeleteTarget(null);
  refresh();
};

const handleDeleteAnyway = async () => {
  await  TrainerSportSessionService.deleteSession(deleteTarget!);
 toast.success('Session deleted. Users have been refunded and notified.');
 toast.custom(<div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-amber-400 text-amber-950 border-amber-800 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span> 'A penalty strike has been applied to your account.',</span>
              </div> ,
            {duration: 6000 }
              );
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
              <TableHead className="w-62.5 text-left text-slate-500 font-bold">
                Session Name
              </TableHead>
              <TableHead className=" text-slate-500 font-bold">Type</TableHead>
              <TableHead className="text-slate-500 font-bold  ">
                Duration
              </TableHead>
         
              <TableHead className="text-slate-500 font-bold  ">
                Status
              </TableHead>
              <TableHead className="text-right text-slate-500 font-bold">
                Actions
              </TableHead>
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
                <TableCell className="capitalize">
                  {session.sessionType.toLowerCase()}
                </TableCell>
                <TableCell>{session.duration} mins</TableCell>
            
                <TableCell>
                  {/* Using Shadcn Badge component */}
                  {!session.isApproved ?
                    <Badge
                      variant= 'outline'
                      className= ' text-amber-600 hover:border-amber-900'                      
                    >
                     Pending Approval                   
                    </Badge>
                  :
                  <Badge
                    variant={session.isActive ? 'default' : 'secondary'}
                    className={
                      session.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : ''
                    }
                  >
                    {session.isActive ? 'Active' : 'Inactive'}
                    
                  </Badge>
                }  
                </TableCell>
                <TableCell className="text-right space-x-2">

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={() => onEdit(session.id)}
                  >
                    <Edit />
                  </Button>
                   <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={() =>{                                         
                      handleSessionVisibility(session.id,!session.isActive)}
                    } 
                  >
                    {session.isActive ? (
                      <>
                        <EyeOff size={12} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye size={12}  />
                        Show
                      </>
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
        
        {hasBookings && deleteTarget && (
          <DeleteSessionDialog
            sessionId={deleteTarget}
            onCancel={handleCancel}
            sessionVisibility={handleSessionVisibility}
            onDeleteAnyway={handleDeleteAnyway}
          />
        )}
      </div>
      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-between px-2 py-4 border-t border-zinc-800">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          Showing{' '}
          <span className="text-white">
            {(pagination.page - 1) * PAGINATION_DEFAULT_LIMIT + 1}
          </span>{' '}
          to{' '}
          <span className="text-white">
            {Math.min(
              pagination.page * PAGINATION_DEFAULT_LIMIT,
              pagination.total
            )}
          </span>{' '}
          of <span className="text-white">{pagination.total}</span> entries
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={16} className="mr-1" /> Prev
          </Button>

          <div className="flex items-center gap-1 mx-2">
            <span className="text-xs font-black text-white">
              {pagination.page}
            </span>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-600">
              {pagination.totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
          >
            Next <ChevronsRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
