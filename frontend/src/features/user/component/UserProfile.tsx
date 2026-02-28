import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pencil,
  Save,
  X,
  MapPin,
  Phone,
  Calendar,
  User,
  User2Icon,
  PhoneCall,
  Camera,
} from "lucide-react";
import GetMapsLink from "@/components/reusable/GetMapsLink";
import { userService } from "../service/userService";
import { useUserStore } from "../store/useUserStore";
import { GENDER } from "@/constants/constants";

import { uploadService } from "@/service/upload.service";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export const UserProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const { profile, fetchProfile, setProfile } = useUserStore();
  const [userData, setUserData] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();

  }, []);
  useEffect(() => {
    setUserData(profile);
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const userId = user?.id;
    const folderPath = `users/${userId}`;
    if (file && userId) {
      const profilePicUrl = await uploadService.upload(
        file,
        `${folderPath}_profiles`,
        userId,
        "profile_pic",
      );
      setUserData((prev) =>
        prev ? { ...prev, ["profilePic"]: profilePicUrl } : prev,
      );
      setUser({ ...user, profilePic: profilePicUrl });
    }
  };

  const handleChange = (name: string, value: string) => {
    setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            address: { ...prev.address, [name]: value },
          }
        : prev,
    );
  };

  // Helper for Date Input (HTML date inputs require YYYY-MM-DD)
  const formatDateForInput = (date: any) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const calculateAge = (dob: Date | string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();    
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleUpdate = async () => {
    if (userData) {
      const data = await userService.updateProfile(userData.id, userData);      
      setProfile(data.profileData);
      setUserData(data.profileData);
      setIsEditing(false);
    }
    console.log("no userData");
  };
  if (!userData)
    return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg border-none bg-secondary/10">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your personal information and address.
            </p>
          </div>
          
        </CardHeader>

        <CardContent className="pt-8 space-y-8 bg-card">
          {/* Header section with Avatar */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-border/50">
            <>
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={userData.profilePic} />
                <Button
                  variant="ghost"
                  className="absolute right-0 bottom-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="  text-primary" />
                </Button>
                <AvatarFallback>
                  <User2Icon size={40} />
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold">{userData.fullName}</h3>
              </div>
            </>
            <div className="flex  w-full  justify-end">
              <Button
                onClick={
                  isEditing ? () => setIsEditing(false) : () => setIsEditing(true)
                }
                variant={isEditing ? "destructive" : "outline"}
                className="rounded-full px-6"
              >
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
            
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* PERSONAL SECTION */}
            <div className="space-y-6 bg-card">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <User className="h-4 w-4" /> Personal Details
              </h4>

              <div className="space-y-1 ">
                {isEditing ? (
                  <div>
                    <Label className="text-muted-foreground text-sm w-1/3 ">
                      Full Name :
                    </Label>
                    <Input
                      name="fullName"
                      value={userData.fullName}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <p className=" text-left px-1 ">{userData.fullName}</p>
                )}
              </div>

              <div className="space-y-2  ">
                {isEditing ? (
                  <div>
                    <Label className="text-muted-foreground   ">
                      Date of Birth:
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        name="DOB"
                        className="pl-10"
                        value={formatDateForInput(userData.DOB)}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <p className=" text-left font-medium px-1">
                    {calculateAge(userData.DOB)} years
                  </p>
                )}
              </div>

              <div className="space-y-2 ">
                {isEditing ? (
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <Select
                      value={userData.gender}
                      onValueChange={(val) => handleChange("gender", val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(GENDER).map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-left font-medium px-1">
                    {userData.gender}
                  </p>
                )}
              </div>
            </div>

            {/* CONTACT & ADDRESS SECTION */}
            <div className="space-y-6">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Contact & Location
              </h4>

              <div className="space-y-2  ">
                {isEditing ? (
                  <>
                    <Label className="text-muted-foreground">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-4 h-3 w-3 text-muted-foreground" />
                      <Input
                        name="phone"
                        className="pl-10"
                        value={userData.phone}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <p className=" text-left font-medium px-1">
                    <PhoneCall className="w-3 h-3 text-primary" />
                    {userData.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2  ">
                  {isEditing ? (
                    <div>
                      <Label className="text-muted-foreground">Street</Label>
                      <Input
                        name="street"
                        value={userData.address?.street}
                        onChange={handleAddressChange}
                      />
                    </div>
                  ) : (
                    <p className=" text-left font-medium px-1">
                      <span className="text-sm  text-primary">Street : </span>{" "}
                      {userData.address?.street}{" "}
                    </p>
                  )}
                </div>
                <div className="space-y-2  ">
                  {isEditing ? (
                    <div>
                      <Label className="text-muted-foreground">City</Label>
                      <Input
                        name="city"
                        value={userData.address?.city}
                        onChange={handleAddressChange}
                      />
                    </div>
                  ) : (
                    <p className=" text-left font-medium px-1">
                      <span className="text-sm  text-primary">City : </span>{" "}
                      {userData.address?.city}{" "}
                    </p>
                  )}
                </div>
                <div className="space-y-2  ">
                  {isEditing ? (
                    <div>
                      <Label className="text-muted-foreground">Zip Code</Label>
                      <Input
                        name="zip"
                        value={userData.address?.zip}
                        onChange={handleAddressChange}
                      />
                    </div>
                  ) : (
                    <p className="text-left font-medium px-1">
                      <span className="text-sm  text-primary">Zip : </span>{" "}
                      {userData.address?.zip || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center gap-3 py-3 bg-primary/5 rounded-xl mb-1 border-primary/10">
                  <MapPin className="text-primary h-5 w-5" />
                  <Label className="text-muted-foreground block ">
                    Live Location :
                  </Label>
                  <a
                    href={`https://www.google.com/maps?q=${userData.location?.coordinates[1]},${userData.location?.coordinates[0]}`}
                    target="_blank"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View pinned location on Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {isEditing && (
          <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-6">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleUpdate()}
              className="px-8 shadow-lg shadow-primary/20"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
