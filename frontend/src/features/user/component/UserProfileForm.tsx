import {
  User,
  Calendar,
  MapPin,
  Home,
  Navigation,
  Camera,
  Save,
  Phone,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  GENDER,
  RELATIONSHIP,
  type GenderType,
  type RelationType,
} from '../../../constants/constants';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { userService } from '../service/userService';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadService } from '@/service/upload.service';
import { CreateProfileSchema } from '../types/user.schema';
import { Button } from '@/components/ui/button';
import PaymentService from '@/features/booking/service/bookingService';
import { useBookingStore } from '@/features/booking/store/useBookingStore';

interface UserProfile {
  userId: string;
  fullName: string;
  DOB: string; // Changed to string for easier input handling
  gender: GenderType;
  phone: string;
  relationship: RelationType;
  street: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  profilePic: string;
  isPrimary: boolean;
}

const UserProfileForm: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile>({
    userId: user ? user.id : '',
    fullName: '',
    DOB: '',
    gender: GENDER.MALE,
    phone: '',
    relationship: RELATIONSHIP.SELF,
    street: '',
    city: '',
    zip: '',
    longitude: 0,
    latitude: 0,
    profilePic: '',
    isPrimary: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For backend
  const [previewImage, setPreviewImage] = useState(''); // For UI
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { payload } = useBookingStore(); //for user to redirect to checkout
  const from = location.state?.from || '';

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || '',
        userId: user.id,
      }));
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store binary for Multer
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Store string for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast.success('Location updated!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('User not found');

    setIsLoading(true);

    try {
      let profilePicUrl = profile.profilePic;

      if (selectedFile) {
        const userId = user?.id;
        const folderPath = `users/${userId}`;

        [profilePicUrl] = await uploadService.upload(
          selectedFile,
          `${folderPath}_profiles`,
          userId,
          'profile_pic'
        );
      }
      const profilePayload = {
        ...profile,
        profilePic: profilePicUrl, // new URL
      };

      const validation = CreateProfileSchema.safeParse(profilePayload);
      if (!validation.success) {
        const errorMessage = validation.error.issues[0].message;
        return toast.error(errorMessage);
      }
      const response = await userService.addProfile(validation.data);
      setHasProfile(true);
      console.log('Upload Success:', response);
      toast.success('Profile saved successfully!');
      if (from && payload) {
        // User was trying to book! Finish the process for them.
        navigate('/checkout');
        return;
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Changed div to form */}
        <form
          onSubmit={handleSubmit}
          className="bg-secondary border border-[#454c59] rounded-3xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#f8fafca9] mb-2">
              Profile Information
            </h1>
            <p className="text-slate-400 text-sm">
              Complete your profile details
            </p>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-secondary/60 border-2 border-[#454c59] overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-500" />
                )}
              </div>
              <button
                type="button" // Important: prevents form submission
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black hover:brightness-110 transition-all duration-200 active:scale-95"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">Click to upload photo</p>
          </div>

          <div className="space-y-6 text-left">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) =>
                    handleInputChange('fullName', e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* DOB and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="date"
                    required
                    value={profile.DOB}
                    onChange={(e) => handleInputChange('DOB', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Gender
                </label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) =>
                    handleInputChange('gender', value as GenderType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GENDER).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone & Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="pl-12 w-full rounded-xl bg-secondary/60 border border-[#454c59] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t border-[#454c59] pt-6">
              <h3 className="text-xl font-bold text-[#f8fafca9] mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Address
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Street Address"
                  value={profile.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="bg-secondary/60 border-[#454c59]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={profile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-secondary/60 border-[#454c59]"
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={profile.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    className="bg-secondary/60 border-[#454c59]"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-[#454c59] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#f8fafca9] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  current Location
                </h3>
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  readOnly
                  placeholder="Lat"
                  value={profile.latitude}
                  className="bg-secondary/60 opacity-70"
                />
                <Input
                  readOnly
                  placeholder="Lng"
                  value={profile.longitude}
                  className="bg-secondary/60 opacity-70"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-6 rounded-full font-bold text-black bg-primary hover:brightness-110 transition-all mt-8"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
