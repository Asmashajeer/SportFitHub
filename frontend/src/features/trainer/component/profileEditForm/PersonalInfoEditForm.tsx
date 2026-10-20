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
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
  initialData: PersonalInfoFormValues;
  onCancel: () => void;
}) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PersonalInfoFormValues>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!profile?.id) return;
    setIsSubmitting(true);
    const personalInfo = {
          ...data,
          DOB: initialData.DOB,
        };
    const newData = PersonalInfoSchema.safeParse(personalInfo);
    if (!newData.success) {
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
       setProfile(updatedData.profile);
      toast.success("personal Info updated");
      onCancel();
    } catch (error) {
      toast.error('Failed to update. Please try again.');
      console.error('Failed to update Personal Info', error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return(
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-[#161617] p-4 sm:p-6 border border-primary/40 rounded-lg shadow-4xl shadow-black ring-1 ring-primary/30 w-full max-w-full overflow-hidden text-xs sm:text-sm"
      > 
        {/* Personal Info Header */}
        <div className="space-y-3 p-3 sm:p-4 bg-secondary/10 rounded-md border border-white/5">
          <h3 className="text-xs sm:text-sm font-bold uppercase text-trainer-primary">
             Personal Information
          </h3>
        </div> 

        {/* Main Personal Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">   
          <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-[10px] sm:text-xs uppercase">
                  FullName
                  </FormLabel>
                  <FormControl>
                  <Input {...field} placeholder="Badminton" className="text-xs sm:text-sm" />
                  </FormControl>
                  <FormDescription className="text-start text-[9px] sm:text-[10px] text-amber-400">
                      * Changes in Full Name require admin approval.
                  </FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-[10px] sm:text-xs uppercase">
                  Gender
                  </FormLabel>
                  <FormControl>
                  <Input {...field} placeholder="" className="text-xs sm:text-sm" />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                  <FormItem className="col-span-full sm:col-span-1">
                      <FormLabel className="text-[10px] sm:text-xs uppercase">
                      Phone
                      </FormLabel>
                      <FormControl>
                      <Input {...field} placeholder="" className="text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />
        </div>

        {/* Address Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 border-2 border-primary/20 p-3 sm:p-4 rounded-xl bg-secondary/5">
            <p className="col-span-full text-left text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wide">Address</p>
            
            <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                <FormItem className="col-span-full">
                    <FormLabel className="text-[10px] sm:text-xs uppercase">
                    Street
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="" className="text-xs sm:text-sm" />
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
                    <FormLabel className="text-[10px] sm:text-xs uppercase">
                    City
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="" className="text-xs sm:text-sm" />
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
                    <FormLabel className="text-[10px] sm:text-xs uppercase">
                   State
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="" className="text-xs sm:text-sm" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address.zip"
                render={({ field }) => (
                <FormItem className="col-span-full sm:col-span-1">
                    <FormLabel className="text-[10px] sm:text-xs uppercase">
                    Zip
                    </FormLabel>
                    <FormControl>
                    <Input {...field} placeholder="" className="text-xs sm:text-sm" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onCancel} className="w-full sm:w-auto text-xs sm:text-sm">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit" className="w-full sm:w-auto text-xs sm:text-sm">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Updating..." : "Update Personal Info"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoEditForm;