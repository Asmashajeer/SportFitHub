import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import type { TrainerOnboardingFormValues } from "../types/trainerprofile.types";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { TRAINER_CATEGORY } from "@/constants/constants";

interface BasicInfoFormProps {
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  previewUrl:string|null,
  onNext: (fields: any[]) => void;

}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({previewUrl, setPreviewUrl, onNext }) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    watch,

    formState: { errors },
  } = form;

  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const profilePicFile = watch("profilePic");

  useEffect(() => {
    if (profilePicFile && profilePicFile[0]) {
      const url = URL.createObjectURL(profilePicFile[0]);
      setPreviewUrl(url);
   
      return () => URL.revokeObjectURL(url); // Cleanup
    }
    setPreviewUrl(null);
  }, [profilePicFile,setPreviewUrl]);

  const currentFields = [
    "displayName",
    "category",
    "coreDiscipline",
    "bio",
    "profilePic",
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* profilepic */}
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="picture" className="cursor-pointer">
            <Avatar className="h-24 w-24">
            
              <AvatarImage src={previewUrl||'' } />
            
              <AvatarFallback>
                <Camera />
              </AvatarFallback>            
            </Avatar>
            {/* {previewUrl && (
              <div className="absolute -bottom-1 -right-1 bg-trainer-primary text-white p-1 rounded-full shadow-sm">
                <Camera size={14} />
              </div>
            )} */}

          </Label>
          <Input
            id="picture"
            type="file"
            className=" hidden max-w-xs"
            {...register("profilePic", { required:previewUrl ? false : "Photo is required"})}
          />
          {errors.profilePic && (
            <p className="text-destructive text-sm">
              {errors.profilePic.message}
            </p>
          )}
        </div>

        {/* display Name */}
        <div className="space-y-2">
          <Label>Display Name</Label>
          <Input
            {...register("displayName", { required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters"
              },
              pattern: {
                value: /^[A-Za-z][A-Za-z\s]*$/,
                message: "Name can only contain letters"
              }
             })}
            placeholder="Coach Name.. (Eg: Coach John)"
            className={errors.displayName ? "border-destructive" : ""}
          />
          {errors.displayName && (
            <p className="text-destructive text-sm">
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* category */}

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={form.watch("category")}
          
            onValueChange={(val) => form.setValue("category", val)}
          >
            <SelectTrigger className="w-full cursor-pointer hover:bg-slate-800">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TRAINER_CATEGORY).map((cat) => (
                <SelectItem
                  className="cursor-pointer focus:bg-[#197e04] focus:text-white"
                  key={cat}
                  value={cat}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Core Discipline */}
        <div className="space-y-2">
          <Label>Core Discipline</Label>
          <Input
            {...register("coreDiscipline", { required: "CoreDiscipline is required",
              pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Discipline should only contain letters"
            }
             })}
            placeholder="eg: Football, Yoga"
            className={errors.coreDiscipline ? "border-destructive" : ""}
          />
          {errors.coreDiscipline && (
            <p className="text-destructive text-sm">
              {errors.coreDiscipline.message}
            </p>
          )}
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <Label>Bio <span className=" text-xs text-stone-600">(minimum 10 characters)</span></Label>
          <Textarea
            {...register("bio", { required: "Bio is required" })}
            placeholder="Tell us about yourself"
            className={errors.bio ? "border-destructive" : ""}
          />
          {errors.bio && (
            <p className="text-destructive text-sm">{errors.bio.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          className="w-full"
          onClick={() => onNext(currentFields)}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};
export default BasicInfoForm;
