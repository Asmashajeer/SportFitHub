import { User, Calendar, MapPin, Home, Navigation, Camera, Save } from 'lucide-react';
import { useRef, useState } from 'react';
import { GENDER_TYPES, RELATIONSHIP_TYPES, type GenderType,  type RelationType } from '../../../constants/constants';

interface Address {
  street: string;
  city: string;
  zip: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface UserProfile {
  name: string;
  dob: string;
  gender: GenderType;
  relationship: string;
  address: Address;
  location: Location;
  profilePic: string;
}

const UserProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    dob: '',
    gender: 'male',
    relationship: '',
    address: {
      street: '',
      city: '',
      zip: ''
    },
    location: {
      latitude: 0,
      longitude: 0
    },
    profilePic: ''
  });

  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setProfile(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleLocationChange = (field: keyof Location, value: string) => {
    const numValue = parseFloat(value) || 0;
    setProfile(prev => ({
      ...prev,
      location: { ...prev.location, [field]: numValue }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfile(prev => ({ ...prev, profilePic: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Profile Data:', profile);
    setIsLoading(false);
    alert('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#212222] border border-[#454c59] rounded-3xl shadow-2xl p-8">
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
              <div className="w-32 h-32 rounded-full bg-[#212222]/60 border-2 border-[#454c59] overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-500" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#197e04] rounded-full flex items-center justify-center text-black hover:brightness-110 transition-all duration-200 active:scale-95"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
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
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* DOB and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Gender
                </label>
               
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as GenderType)}
                    className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                  > 
                  {Object.values(GENDER_TYPES).map((gType)=>(
                    <option key={gType} value={gType}>{gType}</option> 
                    ))}                 
                  </select>
              </div>
            </div>

            {/* Relationship Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Relationship Status
              </label>             
                
                <select
                  value={profile.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value as RelationType)}
                  className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                >{Object.values(RELATIONSHIP_TYPES).map((relation)=> (
                   <option  key={relation} value={relation}>{relation}</option>   ))}                 
                </select>
              
            </div>

            {/* Address Section */}
            <div className="border-t border-[#454c59] pt-6">
              <h3 className="text-xl font-bold text-[#f8fafca9] mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#197e04]" />
                Address
              </h3>

              <div className="space-y-4">
                {/* Street */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={profile.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    placeholder="Enter street address"
                    className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                  />
                </div>

                {/* City and Zip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={profile.address.zip}
                      onChange={(e) => handleAddressChange('zip', e.target.value)}
                      placeholder="Enter ZIP code"
                      className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-[#454c59] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#f8fafca9] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#197e04]" />
                  Location Coordinates
                </h3>
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#197e04]/10 border border-[#197e04]/30 text-[#197e04] text-sm font-medium hover:bg-[#197e04]/20 transition-all duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  Get Current
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={profile.location.latitude}
                    onChange={(e) => handleLocationChange('latitude', e.target.value)}
                    placeholder="0.000000"
                    className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={profile.location.longitude}
                    onChange={(e) => handleLocationChange('longitude', e.target.value)}
                    placeholder="0.000000"
                    className="w-full px-4 py-3 rounded-xl bg-[#212222]/60 border border-[#454c59] text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#197e04] outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale bg-[#197e04] text-black hover:shadow-[0_0_20px_rgba(25,126,4,0.3)] hover:brightness-110 mt-8"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;