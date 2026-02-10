import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark,  Wallet } from "lucide-react";
import type { TrainerOnboardingFormValues } from "../types/trainerprofile.types";

const FinancialInfoForm = ({ onBack, isSubmitting }: { onBack: () => void; isSubmitting: boolean }) => {
  const form = useFormContext<TrainerOnboardingFormValues>();

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
            <span className="text-sm uppercase tracking-wider">Bank Account</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Holder Name</Label>
              <Input 
                {...form.register("paymentInfo.bankAccount.accountName",)}
                placeholder="Name as per bank records"
              />
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input 
                {...form.register("paymentInfo.bankAccount.bankName", )}
                placeholder="e.g. HDFC, SBI, Chase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input 
                type="password" // Keep it masked initially for privacy
                {...form.register("paymentInfo.bankAccount.accountNumber", )}
                placeholder="0000 0000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label>IFSC / SWIFT Code</Label>
              <Input 
                {...form.register("paymentInfo.bankAccount.ifscCode", )}
                placeholder="HDFC0001234"
              />
            </div>
          </div>
        </div>

        <hr className="my-2" />

        {/* UPI ID Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Wallet className="h-4 w-4" />
            <span className="text-sm uppercase tracking-wider">UPI / Digital Wallet</span>
          </div>
          <div className="space-y-2">
            <Label>UPI ID (Optional)</Label>
            <Input 
              {...form.register("paymentInfo.upiId")}
              placeholder="username@bank"
            />
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
          {isSubmitting ? "Submitting Application..." : "Complete Onboarding"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialInfoForm;