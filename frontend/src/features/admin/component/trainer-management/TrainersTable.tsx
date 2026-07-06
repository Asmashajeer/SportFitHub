import {
  PAGINATION_DEFAULT_LIMIT,
  TRAINER_CATEGORY,
  TRAINER_STATUS,
} from '@/constants/constants';
import {
  Eye,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/reusable/Pagination';
import { formatDateDDMMYY } from '@/utils/formatDate';
import { trainerManagementService } from '../../service/trainerManagementService';
import type { AdminTrainersData } from '../../store/types/trainer.types';
import TrainerDetailModal from './TrainerDetailModal';



interface TrainersDataState {
  trainers: AdminTrainersData[];
  totalPages: number;
  total: number;
  page: number;
}

const TrainersTable = () => {
  const [trainersData, setTrainersData] = useState<TrainersDataState>({
   trainers: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const  [selectedTrainer,setSelectedTrainer]= useState< string|null>(null);
 

  type trainerStatusKey = 'confirmed' | 'cancelled' | 'completed' | 'pending';

  const STATUS_BADGE: Record<trainerStatusKey, string> = {
    pending:   'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

  useEffect(() => {
    const getTrainers = async () => {
      try {
        const  trainersData  = await trainerManagementService.getTrainers(         
          {
            page: currentPage,
            limit: PAGINATION_DEFAULT_LIMIT,
            search,
            status: statusFilter,
            category:category,
          }
        );
        setTrainersData(trainersData);
        setCurrentPage(trainersData.page);
      } catch (err) {
        toast.error(err?.toString() || 'Failed to fetch bookings');
      }
    };
    getTrainers();
  }, [currentPage, search, statusFilter,  refreshKey, category]);



  const filterBtn = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
      active
        ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
        : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
    }`;

  const thCls =
    'px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap';
  const tdCls = 'px-4 py-3 text-sm whitespace-nowrap';

  return (
    <div className="flex flex-col gap-4 bg-zinc-800/70 border p-2 rounded-xl">
      <p className="text-sm border-b py-1 ">All Trainers</p>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user, session, trainer..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
            />
          </div>

          {/* Session model filter */}
          {(['all', ...Object.values(TRAINER_CATEGORY)] as string[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={filterBtn(category === cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-36 border-zinc-700 bg-zinc-800/40 text-zinc-400">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {Object.values(TRAINER_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
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
                {/* <th className={thCls}>ID</th> */}
                <th className={thCls}>Name/Email</th>
                {/* <th className={thCls}>Email</th>                */}
                {/* <th className={thCls}>Category</th> */}
                <th className={thCls}>CoreDiscipline</th>
                <th className={thCls}>Specialties</th>
                <th className={thCls}> Experience</th>
               
                <th className={thCls}> Certs</th>
                <th className={thCls}>ID</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Booked On</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/40">
              {!trainersData.trainers ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center text-zinc-600 text-sm">
                    No bookings found
                  </td>
                </tr>
              ) : (
                trainersData.trainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* trainer  */}  
                    <td className={tdCls}>
                      <p className="font-medium text-zinc-100">{trainer.displayName}</p>
                      <p className="text-xs text-zinc-500">{trainer.email}</p>
                    </td>

                    {/* category */}
                    <td className={tdCls}>
                      <p className="text-zinc-200">{trainer.coreDiscipline}</p>
                      <p className="text-zinc-400">({trainer.category})</p>
                    </td>

                    {/* specialities */}
                    <td className={tdCls}>
                      <span className="text-zinc-400">{trainer.specialties.join(", ")}</span>
                    </td>

                 

                    {/*expr*/}
                    <td className={tdCls}>
                      <span className="text-zinc-400 capitalize">{trainer.experience} yr</span>
                    </td>

                   

                    {/* cert Verified*/}
                    <td className={tdCls}>
                      <span className="text-emerald-400 font-medium">
                        {trainer.isCertsVerified}
                      </span>
                    </td>
                    {/* ID verified*/}
                    <td className={tdCls}>
                      <span className="text-emerald-400 font-medium">
                        {trainer.isIdVerified}
                      </span>
                    </td>
                    {/* Status */}
                    <td className={tdCls}>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          STATUS_BADGE[trainer.status as trainerStatusKey] ?? STATUS_BADGE.pending
                        }`}
                      >
                        {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                      </span>
                    </td>

                    {/* Booked On */}
                    <td className={tdCls}>
                      <span className="text-zinc-500">
                        {formatDateDDMMYY(trainer.createdAt)}
                      </span>
                    </td>
                    <td className={tdCls}>
                       <button onClick={() =>setSelectedTrainer(trainer.id)}
                            className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    </td>
                    
                  </tr>
                  
                ))
              )}
            </tbody>
          </table>
          
          {selectedTrainer &&
            <TrainerDetailModal
              trainerId={selectedTrainer}             
              onClose={() => setSelectedTrainer(null)}              
            />
          } 
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={trainersData.totalPages}
          ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
          currentPage={trainersData.page}
          totalCount={trainersData.total}
          setCurrentPage={setCurrentPage}
          label="Bookings"
        />
      </div>

     
      
    </div>
  );
};

export default TrainersTable;
