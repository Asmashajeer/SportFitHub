import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Navigation,
  Loader2,
} from 'lucide-react';

import { userService } from '../service/userService';
import { useUserStore } from '../store/useUserStore';
import { GENDER } from '@/constants/constants';

import { uploadService } from '@/service/upload.service';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import toast from 'react-hot-toast';
import { CreateProfileSchema } from '../types/user.schema';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate=useNavigate();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const { profile, fetchProfile, setProfile } = useUserStore();
  const [userData, setUserData] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading,setIsLoading]=useState(false);
  
  const [imageVersion, setImageVersion] = useState(()=>Date.now());
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    setUserData(profile);
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   
    const file = e.target.files?.[0];
    console.log(file?.name);
    if (!file || !user) return; 
    const userId = user.id;
    try {   
       setIsLoading(true);
      const [profilePicUrl] = await uploadService.upload(
        file,
        `users/${userId}_profiles`,
        userId,
        'profile_pic'
      );       
     
      if(!userData?.id){
         toast.error("failed to update profile photo, please try again");
         return;
      }
      const data = await userService.updateProfilePic(userData.id, profilePicUrl);
      setImageVersion(Date.now()); 
      setProfile(data.profileData);
      setUser({ 
        ...user,
        profilePic: data.profileData.profilePic,
      });



    
      setIsLoading(false);
    } 
    catch (error) {
        toast.error('Failed to update profile photo, please try again');
        setIsLoading(false);
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
        : prev
    );
  };


  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserData((prev) => 
            prev ? {
              ...prev,          
              location:{
                type: 'Point',
                coordinates:[position.coords.latitude, position.coords.longitude]
            }
            }:prev
          );
          toast.success('Location updated!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get current location');
        })     
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };
  // Helper for Date Input (HTML date inputs require YYYY-MM-DD)
  const formatDateForInput = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const calculateAge = (dob: Date | string) => {
    if (!dob) return 'N/A';
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
      const validation = CreateProfileSchema.safeParse(userData);
          if (!validation.success) {
            const errorMessage = validation.error.issues[0].message;
            return toast.error(errorMessage);
          }
      const data = await userService.updateProfile(userData.id, userData);
      setProfile(data.profileData);
      setUserData(data.profileData);
      setIsEditing(false);
    }
    console.log('no userData');
  };
  if (!userData)
    return <div className="p-10 text-center">Loading Profile...</div>;

return (
  <div className=" min-h-screen max-w-6xl w-2xl mx-auto p-4">
    <Card className="shadow-sm border border-border/50 overflow-hidden">
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-5">
        <div>
          <CardTitle className="text-lg font-semibold">My Profile</CardTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal information and address.
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'destructive' : 'outline'}
          size="sm"
          className="rounded-full px-5"
        >
          {isEditing ? (
            <><X className="mr-2 h-3.5 w-3.5" /> Cancel</>
          ) : (
            <><Pencil className="mr-2 h-3.5 w-3.5" /> Edit</>
          )}
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        <div  className="flex items-center justify-between">                     
            {/* Avatar Row */}
            <div className="flex items-center gap-5 pb-6 border-b border-border/50">
              <div className="relative">
                <Avatar className="h-16 w-16 border border-border">
                  <AvatarImage      src={`${userData.profilePic}?v=${imageVersion}`}   alt="Profile" /> 
                  <AvatarFallback className="bg-muted">
                    <User2Icon size={28} className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Camera className="h-3 w-3 text-muted-foreground" />
                </button>
              {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />            
              </div>          
              <div className='text-start'>
                <h3 className="text-base font-semibold">{userData.fullName}</h3>
                <p className="text-sm text-muted-foreground">Member</p>
                <p className="text-sm text-primary " >{user?.email}</p>
              </div> 
            </div>
            {!user?.roles.includes('trainer') && (
              <div className='text-end right-0'>              
                  <Button  onClick={()=>navigate('/trainer/add-Profile')}>Become a Trainer</Button>                
                </div> 
              )}
          </div>
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

          {/* Personal Details */}
          <div className="space-y-1 justify-start text-left ">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-4">
              <User className="h-3.5 w-3.5" /> Personal Details
            </p>

            {/* Full Name */}
            <div className="py-3 border-b border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">Full Name</p>
              {isEditing ? (
                <Input
                  name="fullName"
                  value={userData.fullName}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="text-sm font-medium">{userData.fullName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="py-3 border-b border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              {isEditing ? (
                <div className="relative">
                  <Calendar className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="date"
                    name="DOB"
                    className="pl-9 h-8 text-sm"
                    value={formatDateForInput(userData.DOB)}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-sm font-medium">{calculateAge(userData.DOB)} years</p>
              )}
            </div>

            {/* Gender */}
            <div className="py-3 space-y-1">
              <p className="text-xs text-muted-foreground">Gender</p>
              {isEditing ? (
                <Select
                  value={userData.gender}
                  onValueChange={(val) => handleChange('gender', val)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GENDER).map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium">{userData.gender}</p>
              )}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-1  justify-start text-left ">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-4">
              <MapPin className="h-3.5 w-3.5" /> Contact & Location
            </p>

            {/* Phone */}
            <div className="py-3 border-b border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">Phone Number</p>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    name="phone"
                    className="pl-9 h-8 text-sm"
                    value={userData.phone}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-muted-foreground" />
                  {userData.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="py-3 border-b border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">Address</p>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    name="street"
                    placeholder="Street"
                    value={userData.address?.street}
                    onChange={handleAddressChange}
                    className="h-8 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="city"
                      placeholder="City"
                      value={userData.address?.city}
                      onChange={handleAddressChange}
                      className="h-8 text-sm"
                    />
                    <Input
                      name="zip"
                      placeholder="Zip code"
                      value={userData.address?.zip}
                      onChange={handleAddressChange}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium">
                  {userData.address?.street}, {userData.address?.city}{' '}
                  {userData.address?.zip || ''}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="py-3 space-y-1">
              <p className="text-xs text-muted-foreground"> Location</p>  
              {isEditing?(
                <div className="flex items-center justify-between mb-4">
                 
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="flex items-center gap-2 rounded-full border-primary/30 text-xs"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Current Location
                  </Button>
                </div>
              ):(            
                <a href={`https://www.google.com/maps?q=${userData.location?.coordinates[1]},${userData.location?.coordinates[0]}`}
                target="_blank"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5" />
                View on Google Maps
              </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      {isEditing && (
        <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-5">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleUpdate} className="px-6">
            <Save className="mr-2 h-3.5 w-3.5" /> Save Changes
          </Button>
        </CardFooter>
      )}

    </Card>
  </div>
);
};


export default UserProfile;