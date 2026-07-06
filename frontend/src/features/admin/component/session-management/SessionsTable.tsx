import {
  PAGINATION_DEFAULT_LIMIT,
  PAYLOAD_MODEL,
  SESSION_MODE,
  SESSION_TYPE,
} from '@/constants/constants';
import {
  CheckCircle2,
  Eye,
  Power,
  PowerOff,
  Search,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { SessionManagementService } from '../../service/sessionManagementService';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Pagination from '@/components/reusable/Pagination';
import { useNavigate } from 'react-router-dom';
import SessionDetailModal from './sessionView/SessionDetailModal';
import type { AdminFitnessSessionDetails, AdminSportSessionDetails, FitnessSessionDetailsData, SportsSessionDetailsData } from '../../store/types/session.types';

export interface AdminSessionRow {
  id: string;
  sessionName: string;
  trainer: { displayName: string };
  category: string | { sportName?: string; programName?: string };
  sessionType: string;
  mode: string;
  ageGroup: string;
  enrolledCount: number;
  maxCapacity: number;
  pricing: { sessionCount: number; price: number }[];
  isActive: boolean;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
}
interface SessionsDataProps {
  sessions: AdminSessionRow[] | [];
  totalPages: number;
  total: number;
  page: number;
}

const SessionsTable = ({
  sessionModel,
}: {
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
}) => {
  const [sessionsData, setSessionsData] = useState<SessionsDataProps>({
    sessions: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });
 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState< AdminSportSessionDetails | AdminFitnessSessionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  type SessionStatus = 'pending' | 'active' | 'inactive' | 'rejected';
  const STATUS_BADGE: Record<SessionStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    inactive: 'bg-zinc-500/10 text-zinc-400 ring-1 ring-zinc-500/20',
    rejected: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

  const MODE_BADGE: Record<string, string> = {
    offline: 'bg-zinc-700/50 text-zinc-400',
    online: 'bg-blue-500/10 text-blue-400',
  };

  useEffect(() => {
    const getSessions = async () => {
      try {
        const { sessionsData } = await SessionManagementService.getSessions(
          sessionModel,
          {
            page: currentPage,
            limit: PAGINATION_DEFAULT_LIMIT,
            search: search,
            status: statusFilter,
            type: typeFilter,
            mode: modeFilter,
          }
        );
        setSessionsData(sessionsData);
        setCurrentPage(sessionsData.page);
      } catch (err) {
        toast.error(err?.toString() || 'failed to fetch sesssions');
      }
    };
    getSessions();
  }, [currentPage, search, statusFilter, typeFilter, modeFilter, refreshKey]);


  const handleView = async (sessionId: string, sessionModel:(typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL]) => {
      setLoading(true);
      try {
        const data = await SessionManagementService.getSessionById(sessionId, sessionModel);
        setSelectedSession(data);
      } finally {
        setLoading(false);
      }
  };



 const handleAction = async (id: string, action: 'approve' | 'reject' | 'activate' | 'deactivate') => {
  switch (action) {
    case 'approve':
      await SessionManagementService.approveSession(id, sessionModel, true);
      toast.success('Session Approved');
      break;
    case 'reject':
      await SessionManagementService.approveSession(id, sessionModel, false);
      toast.success('Session Rejected');
      break;
    case 'activate':
      await SessionManagementService.activateSession(id, sessionModel, true);
      toast.success('Session Activated');
      break;
    case 'deactivate':
      await SessionManagementService.activateSession(id, sessionModel, false);
      toast.success('Session Deactivated');
      break;
  }
  setRefreshKey((k) => k + 1);
};

  const pending = sessionsData.sessions.filter(
    (s) => !s.isApproved && !s.isDeleted
  ).length;

  const getStatus = (s: AdminSessionRow): SessionStatus => {
    if (s.isDeleted) return 'rejected';
    if (!s.isApproved) return 'pending';
    if (!s.isActive) return 'inactive';
    return 'active';
  };

  const minPrice = (pricing: { price: number }[]) =>
    pricing.length ? Math.min(...pricing.map((p) => p.price)) : 0;

  const filterBtn = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
      active
        ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
        : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
    }`;

  const thCls =
    'px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap';
  const tdCls = 'px-4 py-3 text-sm whitespace-nowrap';

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search sessions, trainers..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
            />
          </div>
          {(['all', 'pending', 'active', 'inactive', 'rejected'] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={filterBtn(statusFilter === s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                {s === 'pending' && (
                  <span className="text-red-500 mx-1 px-1 bg-white rounded-full">
                    {pending}{' '}
                  </span>
                )}
              </button>
            )
          )}
        </div>
        <div className="flex gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-30 border-zinc-700 bg-zinc-800/40 text-zinc-400">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {Object.values(SESSION_TYPE).map((type) => (
                <SelectItem value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={modeFilter}
            onValueChange={(value) => {
              setModeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-32.5 border-zinc-700 bg-zinc-800/40 text-zinc-400">
              <SelectValue placeholder="All modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              {Object.values(SESSION_MODE).map((m) => (
                <SelectItem value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-800/60">
              <tr>
                {/* <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-zinc-100 cursor-pointer"
                  />
                </th> */}
                <th className={thCls}>Session</th>
                <th className={thCls}>Trainer</th>
                <th className={thCls}>Category</th>
                <th className={thCls}>Type · Mode</th>
                <th className={thCls}>Age group</th>
                <th className={thCls}>
                  Enrolled
                  {/* <SortIcon col="enrolled" sort={sort} /> */}
                </th>
                <th className={thCls}>
                  Price from
                  {/* <SortIcon col="price" sort={sort} /> */}
                </th>
                <th className={thCls}>Status</th>
                <th className={thCls}>
                  Created
                  {/* <SortIcon col="createdAt" sort={sort} /> */}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/40">
              {sessionsData.sessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-16 text-center text-zinc-600 text-sm"
                  >
                    No sessions found
                  </td>
                </tr>
              ) : (
                sessionsData.sessions.map((session) => {
                  const status = getStatus(session);
                  const categoryName =
                    typeof session.category === 'object'
                      ? (session.category?.sportName ??
                        session.category?.programName)
                      : session.category;
                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Session */}
                      <td className={tdCls}>
                        <p className="font-medium text-zinc-100">
                          {session.sessionName}
                        </p>
                      </td>

                      {/* Trainer */}
                      <td className={tdCls}>
                        <div className="flex items-center gap-2 text-blue-500">
                          {session.trainer.displayName}
                        </div>
                      </td>

                      {/* Category */}
                      <td className={tdCls}>
                        <span className="text-zinc-400">
                          {categoryName ?? 'N/A'}
                        </span>
                        {/* <span className="text-zinc-400">{session.category.sportName ?? session.category?.programName ?? 'N/A'}</span> */}
                      </td>

                      {/* Type + Mode */}
                      <td className={tdCls}>
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-400 capitalize">
                            {session.sessionType}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full w-fit capitalize ${MODE_BADGE[session.mode] ?? 'bg-zinc-700/50 text-zinc-400'}`}
                          >
                            {session.mode}
                          </span>
                        </div>
                      </td>

                      {/* Age group */}
                      <td className={tdCls}>
                        <span className="text-zinc-400 capitalize">
                          {session.ageGroup}
                        </span>
                      </td>

                      {/* Enrolled */}
                      <td className={tdCls}>
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-300">
                            {session.enrolledCount} / {session.maxCapacity}
                          </span>
                          <div className="w-16 h-1 bg-zinc-700 rounded-full">
                            <div
                              className="h-full rounded-full bg-blue-400"
                              style={{
                                width: `${Math.min((session.enrolledCount / session.maxCapacity) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className={tdCls}>
                        <span className="text-emerald-400 font-medium">
                          ₹ {minPrice(session.pricing)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={tdCls}>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[status]}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className={tdCls}>
                        <span className="text-zinc-500">
                          {new Date(session.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                         
                          <button onClick={() =>handleView(session.id,sessionModel)}
                            className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {status === 'pending' ?(
                            <>
                              <button
                                onClick={() => {   handleAction( session.id, 'approve') }}
                                title="Approve"
                                className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>                          
                              <button
                                onClick={() => { handleAction(session.id,'reject' ) }}
                                title="Reject"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                           </>
                          ):(
                            <>
                              {status === 'active' ? (
                                <button
                                  onClick={() => {handleAction(session.id, 'deactivate')}}
                                  title="Deactivate"
                                  className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <PowerOff className="w-3.5 h-3.5" />
                                </button>
                              ):(                          
                              <button
                                onClick={() => {handleAction(session.id, 'activate')}}
                                title="Activate"
                                className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                              )}
                            </>  
                         )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {selectedSession &&
            <SessionDetailModal
              session={selectedSession}
              sessionModel="sports"
              open={!!selectedSession}
              onClose={() => setSelectedSession(null)}
              onAction={handleAction}
            />
          } 
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={sessionsData.totalPages}
          ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
          currentPage={sessionsData.page}
          totalCount={sessionsData.total}
          setCurrentPage={setCurrentPage}
          label="Sessions"
        />
      
      </div>
    </div>
  );
};
export default SessionsTable;
