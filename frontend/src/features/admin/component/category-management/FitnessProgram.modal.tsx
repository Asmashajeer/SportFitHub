import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Edit, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { CategoryMangementService } from '../../service/categoryManagementService';

import { UseAdminStore } from '../../store/useAdminStore';
import toast from 'react-hot-toast';
import type { FitnessData } from '../../store/types';
interface props {
  isEdit: boolean;
  currentProgram?: FitnessData | null;
}
export function FitnessProgramModal({ isEdit, currentProgram }: props) {
  const addProgram = UseAdminStore((state) => state.addProgram);
  const updateProgram = UseAdminStore((state) => state.updateProgram);
  const [program, setProgram] = useState(() => {
    if (isEdit && currentProgram) {
      return currentProgram;
    }
    return {
      id: '',
      programName: '',
      slug: '',
      description: '',
    };
  });

  // Auto-generate slug as user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProgram((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'programName') {
        newState.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
          .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
      }
      return newState;
    });
  };
  const handleSubmit = async () => {
    try {
      if (Object.values(program).length > 0) {
        if (isEdit) {
          const data = await CategoryMangementService.updateProgram(program);
          updateProgram(data.program);
          toast.success(data.program.programName + ' updated');
        } else {
          const { newProgram } =
            await CategoryMangementService.addProgram(program);
          addProgram(newProgram);
          toast.success(newProgram.programName + ' added');
        }
        setProgram({
          id: '',
          programName: '',
          slug: '',
          description: '',
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.toString() || 'Something went wrong');
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit && currentProgram ? (
          <Button variant="ghost" className="gap-2">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New program
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit the Program' : 'Add New fitness program'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="programName">Program Name</Label>
            <Input
              name="programName"
              value={program.programName}
              onChange={(e) => handleChange(e)}
              placeholder="e.g. HIIT "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug" className="text-muted-foreground">
              URL Slug (Auto-generated)
            </Label>
            <Input
              name="slug"
              value={program.slug}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              name="description"
              value={program.description}
              onChange={(e) => handleChange(e)}
              className="bg-muted"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} type="submit">
            {isEdit ? 'Save Changes' : 'Save program'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
