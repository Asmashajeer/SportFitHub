import { Search, Filter, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { CategoryMangementService } from '../../service/categoryManagementService';
import { UseAdminStore } from '../../store/useAdminStore';
import { SportModal } from './Sport.modal';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/reusable/ConfirmDialog';
import Pagination from '@/components/reusable/Pagination';
import type { SportData } from '../../store/types';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';


interface SportsMangerState {
  sports: SportData[];
  totalPages: number;
  total: number;
  page: number;
}


  
const SportsManager = () => {
  const [sportsData, setSportsData] = useState<SportsMangerState >({
  sports: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { sports, setSports, updateSport, deleteSport } = UseAdminStore();

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const {sportsData} = await CategoryMangementService.getSports({
          page: currentPage,
          search: debouncedSearch,
          status: statusFilter,
        });
        setSportsData(sportsData);
        setSports(sportsData.sports);
        setCurrentPage(sportsData.page);
      } catch (error) {
        toast.error(error?.toString() || 'Something went wrong');
        setSports([]);
      }
    };
    fetchSports();
  }, [debouncedSearch, statusFilter,currentPage]);

  const handleToggleStatus = async (id: string) => {
    const data = await CategoryMangementService.toggleSportStatus(id);
    updateSport(data.sport);
  };

  const handleDeleteSport = async (id: string) => {
    const data = await CategoryMangementService.deleteSport(id);
    deleteSport(data.id);
  };
  return (
    <div className="bg-card space-y-6 mx-5 justify-center">
      <div className="  flex-row  items-center ">
        <div>
          <h2 className="text-xl font-bold tracking-tight ">
            Sports Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage the sports available for trainers.
          </p>
        </div>
      </div>

      {/* MIDDLE ROW: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-37.5">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <SportModal isEdit={false} />
        </div>
      </div>

      {/* MAIN AREA: Data Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Icon</TableHead>
              <TableHead>Sport Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sports?.length ? (
              sports?.map((sport) => (
                <TableRow key={sport?.id}>
                  <TableCell className="text-2xl">{sport.icon}</TableCell>
                  <TableCell className="font-medium">
                    {sport.sportName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    /{sport.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sport.isActive}
                        onCheckedChange={() => handleToggleStatus(sport.id)}
                      />
                      <Badge variant={sport.isActive ? 'default' : 'secondary'}>
                        {sport.isActive ? 'Active' : 'Not Active'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <SportModal isEdit={true} currentSport={sport} />
                      {/* <Button variant="ghost" size="icon" onClick={()=>setIsEditing(true)}><Edit className="h-4 w-4"/></Button> */}
                      <ConfirmDialog
                        icon={<Trash2 className="h-4 w-4 text-red-400" />}
                        title={`Delete ${sport.sportName} ?`}
                        description={`this will remove ${sport.sportName} from sports list `}
                        onConfirm={() => handleDeleteSport(sport.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center">
                  <div>No sports to list</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
        <Pagination
          totalPages={sportsData.totalPages}
          ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
          currentPage={sportsData.page}
          totalCount={sportsData.total}
          setCurrentPage={setCurrentPage}
          label="Sports"
        />
    </div>
  );
};

export default SportsManager;
