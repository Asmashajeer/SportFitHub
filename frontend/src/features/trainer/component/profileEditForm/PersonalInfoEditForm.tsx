

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
import { PersonalInfoSchema } from '../../types/trainer.profile.schema';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatDateDDMMYY } from '@/utils/formatDate';



interface PersonalInfoFormValues {  
    fullName: string;
    DOB: string;
    gender: string;
    phone: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
}


const PersonalInfoEditForm = ({
  initialData,
  onCancel,
}: {
  initialData:PersonalInfoFormValues;
  onCancel: () => void;
}) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const fetchProfile = useTrainerStore((state) => state.fetchProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PersonalInfoFormValues>({
    defaultValues: initialData,
  });
 

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!profile?.id) return;
    setIsSubmitting(true);
    const  personalInfo= {
          ...data,
          DOB: initialData.DOB,
        };
    const newData=PersonalInfoSchema.safeParse( personalInfo);
    if(!newData.success){
           const errorMessage = newData.error.issues[0].message;
            toast.error(errorMessage);
            console.log(errorMessage);
            setIsSubmitting(false);
            return;
       }
    try {
      const updatedData = await trainerService.updatePersonalInfo(
        profile.id,
        newData.data
      );
       setProfile( updatedData.profile);
      toast.success("personal Info updated");
      onCancel();
    } catch (error) {
      toast.error('Failed to update. Please try again.');
      console.error('Failed to update Personal Info', error);
    }
  }
  return(
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-[#161617] p-4 border border-primary/40 rounded-lg shadow-4xl shadow-black ring-1 ring-primary/30"
      >   
       
          {/* personal info section */}
          <div className="space-y-3 p-3 bg-secondary/10 rounded-md border border-white/5">
            <h3 className="text-xs font-bold uppercase text-trainer-primary">
             Personal Information
            </h3>
          </div> 
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">   
      
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[10px] uppercase">
                    FullName
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="Badminton" />
                    </FormControl>
                    <FormDescription className='text-start text-[9px] text-amber-400'>
                       * Changes in Full Name require admin approval.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            {/* <FormField
                control={form.control}
                name="DOB"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[10px] uppercase">
                    DOB
                    </FormLabel>
                    <FormControl>
                    <Input {...field} value={formatDateDDMMYY(field.value)}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            /> */}
            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[10px] uppercase">
                    Gender
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase">
                        Phone
                        </FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
          </div>
            {/* address info */}

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 border-2 p-3 rounded-xl">
               <p className="col-span-2 text-left">Address</p>
                <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase">
                        Street
                        </FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase">
                        City
                        </FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase">
                       State
                        </FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address.zip"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase">
                       Zip
                        </FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="" />
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
          <Button  disabled={isSubmitting} type="submit">Update Personal Info</Button>
        </div>
      </form>
    </Form>
  );
}
export default PersonalInfoEditForm;
