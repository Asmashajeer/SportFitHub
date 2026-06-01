import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Landmark, Wallet } from 'lucide-react';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';

const FinancialInfoForm = ({
  onBack,
  isSubmitting,
}: {
  onBack: () => void;
  isSubmitting: boolean;
}) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bank Account Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Landmark className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider">
              Bank Account
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Holder Name</Label>
              <Input
                {...register('paymentInfo.bankAccount.accountName', {
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: 'Name should only contain letters',
                  },
                })}
                placeholder="Name as per bank records"
              />
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input
                {...register('paymentInfo.bankAccount.bankName', {
                  pattern: {
                    value: /^[A-Za-z][A-Za-z\s.]+$/,
                    message: 'Bank name should only contain letters',
                  },
                  minLength: {
                    value: 3,
                    message: 'Please enter a valid bank name (min 3 chars)',
                  },
                })}
                placeholder="e.g. HDFC, SBI, FEDERAL"
              />
              {errors?.paymentInfo?.bankAccount?.bankName && (
                <p className="text-xs text-red-500">
                  {errors.paymentInfo.bankAccount.bankName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input
                type="password" // Keep it masked initially for privacy
                {...form.register('paymentInfo.bankAccount.accountNumber', {
                  pattern: {
                    value: /^\d+$/,
                    message: 'Must be digits only',
                  },
                  minLength: { value: 9, message: 'Too short (min 9 digits)' },
                })}
                placeholder="0000 0000 0000"
              />
              {errors?.paymentInfo?.bankAccount?.accountNumber && (
                <p className="text-xs text-red-500">
                  {errors.paymentInfo.bankAccount.accountNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>IFSC / SWIFT Code</Label>
              <Input
                {...form.register('paymentInfo.bankAccount.ifscCode', {
                  pattern: {
                    value: /^[A-Z0-9]{8,11}$/i,
                    message: 'Invalid format eg:HDFC0001234',
                  },
                })}
                placeholder="HDFC0001234"
              />
              {errors?.paymentInfo?.bankAccount?.ifscCode && (
                <p className="text-xs text-red-500">
                  {errors.paymentInfo.bankAccount.ifscCode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-2" />

        {/* UPI ID Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Wallet className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider">
              UPI / Digital Wallet
            </span>
          </div>
          <div className="space-y-2">
            <Label>UPI ID (Optional)</Label>
            <Input
              {...form.register('paymentInfo.upiId', {
                pattern: {
                  value: /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/,
                  message: 'Invalid UPI format (e.g., username@bankname)',
                },
              })}
              placeholder="username@bank"
            />
            {errors?.paymentInfo?.bankAccount?.ifscCode && (
              <p className="text-xs text-red-500">
                {errors.paymentInfo.bankAccount.ifscCode.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="submit" // This triggers the root form's onSubmit
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Application...' : 'Complete Onboarding'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialInfoForm;
