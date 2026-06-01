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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { CategoryMangementService } from '../../service/categoryManagementService';

import { UseAdminStore } from '../../store/useAdminStore';
import toast from 'react-hot-toast';
import type { SportData } from '../../store/types';
interface props {
  isEdit: boolean;
  currentSport?: SportData | null;
}
export function SportModal({ isEdit, currentSport }: props) {
  const addSport = UseAdminStore((state) => state.addSport);
  const updateSport = UseAdminStore((state) => state.updateSport);
  const [sport, setsport] = useState(() => {
    if (isEdit && currentSport) {
      return currentSport;
    }
    return {
      id: '',
      sportName: '',
      slug: '',
      icon: '',
      description: '',
      isActive: true,
    };
  });

  // Auto-generate slug as user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setsport((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'sportName') {
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
      if (Object.values(sport).length > 0) {
        if (isEdit) {
          const data = await CategoryMangementService.updateSport(sport!);
          updateSport(data.sport);
          toast.success(data.sport.sportName + '  updated');
        } else {
          const { newSport } = await CategoryMangementService.addSport(sport);
          addSport(newSport);
          toast.success(newSport.sportName + ' added');
        }
        setsport({
          id: '',
          sportName: '',
          slug: '',
          icon: '',
          description: '',
        });
      }
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {!isEdit ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Sport
          </Button>
        ) : (
          <Button variant="ghost" className="gap-2 ">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit the Sport' : 'Add New Sport'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sportName">Sport Name</Label>
            <Input
              name="sportName"
              value={sport.sportName}
              onChange={(e) => handleChange(e)}
              placeholder="e.g.Soccer "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug" className="text-muted-foreground">
              URL Slug (Auto-generated)
            </Label>
            <Input
              name="slug"
              value={sport.slug}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon" className="text-foreground">
              Icon{' '}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              name="icon"
              value={sport.icon}
              onChange={(e) => handleChange(e)}
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              name="description"
              value={sport.description}
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
            {isEdit ? 'Save changes' : 'Save Sport'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
