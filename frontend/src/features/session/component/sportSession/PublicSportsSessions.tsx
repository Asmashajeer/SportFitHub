import { useEffect, useState } from 'react';
import { sportSessionService } from '../../service/sportSessionService';

import type { SportsSessionPublicResponseData } from '../../store/session.types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, MapPin, Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import {
  AGE_GROUP,
  LOCATION_RADIUS,
  PAGINATION_DEFAULT_LIMIT,
  SESSION_TYPE,
} from '@/constants/constants';
import SportSessionCard from './SportSessionCard';
import SportsBanner from '../SportsSessionBanner';

import type { SportData } from '@/features/admin/store/types';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { userService } from '@/features/user/service/userService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import Pagination from '@/components/reusable/Pagination';

interface PaginationProps {
  totalPages: number;
  total: number;
  page: number;
}

interface SessionsDataProps {
  sessions: SportsSessionPublicResponseData[];
  pagination: PaginationProps;
}

const PublicSportsSessions = () => {
  const [sessionsData, setSessionsData] = useState<SessionsDataProps>({
    sessions: [],
    pagination: { totalPages: 0, total: 0, page: 1 },
  });

  const { user, isAuthenticated } = useAuthStore();
  const [sports, setSports] = useState<SportData[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('');
 const [radius,setRadius]=useState(0);
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    radius:0,
  });
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sportFilter, sessionTypeFilter, ageGroupFilter, location]);

  useEffect(() => {
    try {
      const getSportCategory = async () => {
        const data = await sportSessionService.getAvailableSports();
        setSports(data.sports);
      };
      getSportCategory();
    } catch (error) {
      console.error('Failed to fetch sport categories');
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await sportSessionService.getAllSessions({
          page: currentPage,
          search: debouncedSearch,
          sport: sportFilter,
          sessionType: sessionTypeFilter,
          ageGroup: ageGroupFilter,
          ...location,
        });
        setSessionsData(data);
        setCurrentPage(sessionsData.pagination.page);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch sessions');
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [currentPage, debouncedSearch, sportFilter, sessionTypeFilter, ageGroupFilter, location]);

   useEffect(()=>{
     const getCurrentLocation = async (radius:number) => {
    if (user && isAuthenticated) {
      const data = await userService.getProfile();
      if (data.profile) {
        setLocation({
          lat: data.profile.location.coordinates[0],
          lng: data.profile.location.coordinates[1],
          radius: radius,
        });
        return;
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius:radius,
          });
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
  if(radius!==0)
      getCurrentLocation(radius);
},[radius]);
 

  const resetAllFilters = () => {
    setSearchQuery('');
    setSportFilter('');
    setSessionTypeFilter('');
    setAgeGroupFilter('');
    setLocation({ lat: 0, lng: 0, radius: 0 });
  };

  const activeFilterCount = [sportFilter, sessionTypeFilter, ageGroupFilter].filter(
    (f) => f && f !== 'all'
  ).length + (location.lat !== 0 ? 1 : 0);

  const FilterPanel = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Sport */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sport</Label>
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports?.map((sport: SportData) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.sportName} {sport.icon}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Group */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Age Group</Label>
        <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Age Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Age Groups</SelectItem>
            {Object.values(AGE_GROUP).map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Session Type */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Session Type</Label>
        <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {Object.values(SESSION_TYPE).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Location
        </Label>

        <div className="grid grid-cols-2 gap-1.5">
          {LOCATION_RADIUS.map((rad) =>{          
              const isActive = location.radius === rad && location.lat !== 0;
              return (
                <Button
                  key={rad}
                  type="button"
                  variant="outline"
                  onClick={() => setRadius(rad)}
                  className={`flex items-center justify-center gap-1.5 text-xs h-8 rounded-lg border transition-all duration-150
                    ${isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                   }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  {rad} km
                </Button>
              );
            })}
        </div>

        {location.lat !== 0 && (
          <button
            onClick={() => setLocation({ lat: 0, lng: 0, radius:0 })}
            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors text-left"
          >
            Clear location
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <SportsBanner />
      <h1 className="text-xl font-bold tracking-tight p-2 mb-4">Explore Sports Sessions</h1>

      {/* ── Top row: Search + Get Nearby ── */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sports..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          className="flex items-center gap-2 rounded-full border-primary/30 text-xs whitespace-nowrap shrink-0"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Nearby {LOCATION_RADIUS} km</span>
          <span className="sm:hidden">Nearby</span>
        </Button> */}

        {/* Mobile: Filters toggle button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border-primary/30 text-xs shrink-0 lg:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* ── Main layout: Sidebar + Content ── */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-4 border border-border rounded-xl p-4 bg-card">
            <FilterPanel />
          </div>
        </aside>

        {/* Sessions Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : sessionsData.sessions.length > 0 ? (
            <>
              <div id='sessions' className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sessionsData.sessions.map((session) => (
                  <SportSessionCard key={session.id} session={session} />
                ))}
              </div>
              <Pagination
                totalPages={sessionsData.pagination.totalPages}
                ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
                currentPage={currentPage}
                totalCount={sessionsData.pagination.total}
                setCurrentPage={setCurrentPage}
                label="Sports Sessions"
              />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No active sports sessions found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-72 bg-background border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <Button
              className="w-full mt-6"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicSportsSessions;