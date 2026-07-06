import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTrainerStore } from '../../store/useTrainerStore';
import { trainerService } from '../../service/trainerService';

import { TRAINER_CATEGORY } from '@/constants/constants';
import { Textarea } from '@/components/ui/textarea';


import { Badge } from '@/components/ui/badge';
import { CornerDownLeftIcon,  X } from 'lucide-react';
import { useState } from 'react';
import { BasicInfoSchema } from '../../types/trainer.profile.schema';
import toast from 'react-hot-toast';

interface BasicInfoFormValues {
    displayName: string;
    category: (typeof TRAINER_CATEGORY)[keyof typeof TRAINER_CATEGORY];
    coreDiscipline: string;
    bio: string;    
    specialties: string[];
    experience: number;
    languages: string[];
}

const BasicInfoEditForm = ({
  initialData,
  onCancel,
}: {
  initialData: BasicInfoFormValues;
  onCancel: () => void;
}) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);

  const form = useForm<BasicInfoFormValues>({
    defaultValues: initialData,
  });
  const {getValues,setValue,setError,clearErrors,}=form
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLang, setNewLang] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToArray = (
    field: 'specialties' | 'languages',
    value: string,
    setter: (v: string) => void
  ) => {
    const currentArray = getValues(field) || [];
    const val=value.trim()[0].toUpperCase() + value.trim().slice(1);
    if (val && !currentArray.includes(val)) {      
      setValue(field, [...currentArray, val], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setter('');
    }else{
     setError(field, { message: 'Duplicate item ' }, { shouldFocus: true });
    }
  };

  const removeFromArray = (
    field: 'specialties' | 'languages',
    item: string
  ) => {
    const currentArray = getValues(field) || [];
  
    const updatedArray = currentArray.filter((i: string) => i !== item);
    setValue(field, updatedArray, { shouldValidate: true, shouldDirty: true });
    if (updatedArray.length === 0) {
      setError(field, { message: 'Add minimum one ' }, { shouldFocus: true });
    } else clearErrors(field);
  };
  const onSubmit = async (data: BasicInfoFormValues) => {
    if (!profile?.id) return;
     setIsSubmitting(true);
    try {
      const payload={
        ...data,
        category:initialData.category,           
        coreDiscipline: initialData.coreDiscipline ,
      }
      const newData=BasicInfoSchema.safeParse(payload);
       if (!newData.success) {
              const errorMessage = newData.error.issues[0].message;
              toast.error(errorMessage);
              console.log(errorMessage);
              setIsSubmitting(false);
              return;
            }
      const updatedData = await trainerService.updateBasicInfo(
        profile.id,
        newData.data
      );
    
      setProfile( updatedData.profile);
      toast.success("Basic Info updated");
      onCancel();
    } catch (error) {
       toast.error('Failed to update. Please try again.');
      console.error('Failed to update Basic info', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-[#1e1e1f] p-4  border rounded-lg"
      ><div className="space-y-3 p-3 bg-secondary/10 rounded-md border border-white/5"> 
          <h3 className="text-xs font-bold uppercase text-trainer-primary">
              Basic information
           </h3>
          {/* Basic information Section */} 
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                   DisplayName
                  </FormLabel>
                  <FormControl>
                    <Input {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">           
            <div className='col-span-2'>
              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="text-[10px] uppercase">
                    specialties
                    </FormLabel>
                    <div className=' flex items-center gap-1'>
                      {field.value.map((s) => (
                        <Badge key={s} variant="secondary"
                         className="border text-emerald-500">
                          {s}
                          <button
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              removeFromArray('specialties', s);
                            }}
                            className="ml-1 focus:outline-none"
                          >
                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex">
                      <FormControl>
                      <Input
                        value={newSpecialty}
                        onChange={(e) => {
                          clearErrors('specialties');
                          setNewSpecialty(e.target.value);
                        }}
                        placeholder="Add skills and enter..."
                        onKeyDown={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(),
                          addToArray('specialties', newSpecialty, setNewSpecialty))
                        }
                      />           
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          addToArray('specialties', newSpecialty, setNewSpecialty)
                        }
                      >
                        <CornerDownLeftIcon className="h-5 w-5  text-emerald-500 border hover:border-emerald-400 hover:bg-black"/>
                      </Button> 
                    </div>
                    <div className='flex items-center'>
                      {newSpecialty && (
                        <p className="text-xs text-muted-foreground ">
                          Press <kbd className=" px-1 py-0.5 text-xs border rounded bg-muted">Enter /⏎ </kbd> to add
                        </p>
                      )}
                      <FormMessage />
                    </div>
                   
                  </FormItem>
                )}
              />
            </div>
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase">
                    Experience
                    </FormLabel>                 
                    <FormControl>
                      <Input {...field}   type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormDescription className=' text-start text-[9px] text-amber-400'>
                       * Changes in Experience require admin approval.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                   Languages
                  </FormLabel>
                   
                  <div className="flex">
                    <FormControl>
                    <Input
                        value={newLang}
                        onChange={(e) => {
                          clearErrors('languages');
                          setNewLang(e.target.value);
                        }}
                        placeholder="Add Language and Enter..."
                        onKeyDown={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(),
                          addToArray('languages', newLang, setNewLang))
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => addToArray('languages', newLang, setNewLang)}
                    >
                     <CornerDownLeftIcon className="h-5 w-5  text-emerald-500 border hover:border-emerald-400 hover:bg-black"/>
                    </Button>
                  </div>
                  <div className=' flex items-center gap-1'>
                    {field.value.map((lang) => (
                      <Badge key={lang} variant="secondary" 
                       className="border text-emerald-500">
                        {lang}
                        <button
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            removeFromArray('languages',lang);
                          }}
                          className="ml-1 focus:outline-none"
                        >
                          <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                    {newLang && (
                      <p className="text-xs text-muted-foreground">
                        Press <kbd className=" px-1 py-0.5 text-xs border rounded bg-muted">Enter /⏎ </kbd> to add
                      </p>
                    )}          
                  <FormMessage />
                </FormItem>
              )}
            />            
          </div>
          <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          
          <Button disabled={isSubmitting} type="submit">Update Basic Info</Button>
        </div>
      </form>
    </Form>
  );
};
export default BasicInfoEditForm;
