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

import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/reusable/ConfirmDialog';
import { FitnessProgramModal } from './FitnessProgram.modal';

const FitnessManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { programs, setPrograms, updateProgram, deleteProgram } =
    UseAdminStore();

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchprograms = async () => {
      try {
        const data = await CategoryMangementService.getPrograms({
          page: 1,
          search: debouncedSearch,
          status: statusFilter,
        });
        setPrograms(data.programs);
      } catch (error) {
        toast.error(error?.toString() || 'Something went wrong');
        setPrograms([]);
      }
    };
    fetchprograms();
  }, [debouncedSearch, statusFilter]);

  const handleToggleStatus = async (id: string) => {
    const data = await CategoryMangementService.toggleProgramStatus(id);
    updateProgram(data.program);
  };

  const handleDeleteprogram = async (id: string) => {
    const data = await CategoryMangementService.deleteProgram(id);
    deleteProgram(data.id);
  };
  return (
    <div className="bg-card space-y-6 mx-5 justify-center">
      <div className="  flex-row  items-center ">
        <div>
          <h2 className="text-xl font-bold tracking-tight ">
            Fitness Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage the fitness programs available for trainers.
          </p>
        </div>
      </div>

      {/* MIDDLE ROW: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
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
          <FitnessProgramModal isEdit={false} />
        </div>
      </div>

      {/* MAIN AREA: Data Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs?.length ? (
              programs?.map((program) => (
                <TableRow key={program?.id}>
                  <TableCell className="font-medium">
                    {program.programName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    /{program.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={program.isActive}
                        onCheckedChange={() => handleToggleStatus(program.id)}
                      />
                      <Badge
                        variant={program.isActive ? 'default' : 'secondary'}
                      >
                        {program.isActive ? 'Active' : 'Not Active'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <FitnessProgramModal
                        isEdit={true}
                        currentProgram={program}
                      />

                      <ConfirmDialog
                        icon={<Trash2 className="h-4 w-4 text-red-400" />}
                        title={`Delete ${program.programName} ?`}
                        description={`this will remove ${program.programName} from programs list `}
                        onConfirm={() => handleDeleteprogram(program.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center">
                  <div>No programs to list</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FitnessManager;
