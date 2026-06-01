import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTrainerStore } from '../../store/useTrainerStore';
import { trainerService } from '../../service/trainerService';
import toast from 'react-hot-toast';

interface PaymentFormValues {
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  upiId?: string;
}

const PaymentInfoFormEdit = ({
  initialData,
  onCancel,
}: {
  initialData: PaymentFormValues;
  onCancel: () => void;
}) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);

  const form = useForm<PaymentFormValues>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: PaymentFormValues) => {
    if (!profile?.id) return;
    const isUpiEmpty = !data.upiId?.trim();
    const isBankEmpty =
      !data.bankAccount?.accountNumber?.trim() &&
      !data.bankAccount?.accountName?.trim();

    if (isUpiEmpty && isBankEmpty) {
      toast.error('Please provide either Bank Details or a UPI ID.');
      return;
    }
    try {
      const updatedProfile = await trainerService.updatePaymentInfo(
        profile.id,
        data
      );
      setProfile(updatedProfile);
      onCancel();
    } catch (error) {
      console.error('Failed to update payment info', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-[#1e1e1f] p-4  border rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Account Section */}
          <div className="space-y-3 p-3 bg-secondary/10 rounded-md border border-white/5">
            <h3 className="text-xs font-bold uppercase text-trainer-primary">
              Bank Details
            </h3>

            <FormField
              control={form.control}
              name="bankAccount.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                    Account Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccount.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="000012345678" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccount.ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                    IFSC Code
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="BARB0XXXXX" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* UPI Section */}
          <div className="space-y-3 p-3 bg-secondary/10 rounded-md border border-white/5">
            <h3 className="text-xs font-bold uppercase text-trainer-primary">
              UPI Transfer
            </h3>
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase">
                    UPI ID
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="username@bank" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-[10px] text-muted-foreground italic">
              Ensure your UPI ID is active for instant settlements.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update Payments</Button>
        </div>
      </form>
    </Form>
  );
};
export default PaymentInfoFormEdit;
