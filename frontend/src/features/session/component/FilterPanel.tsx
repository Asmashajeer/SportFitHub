import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { FitnessData, SportData } from '@/features/admin/store/types';
import { PAYLOAD_MODEL, AGE_GROUP, SESSION_TYPE } from '@/constants/constants';

const FilterPanel = ({
  activeFilterCount,
  resetAllFilters,
  categoryFilter,
  setCategoryFilter,
  sportFilter,
  setSportFilter,
  programFilter,
  setProgramFilter,
  ageGroupFilter,
  setAgeGroupFilter,
  sessionTypeFilter,
  setSessionTypeFilter,
  ratingFilter,
  setRatingFilter,
  sports,
  programs,
}: {
  activeFilterCount: number;
  resetAllFilters: () => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  sportFilter: string;
  setSportFilter: (val: string) => void;
  programFilter: string;
  setProgramFilter: (val: string) => void;
  ageGroupFilter: string;
  setAgeGroupFilter: (val: string) => void;
  sessionTypeFilter: string;
  setSessionTypeFilter: (val: string) => void;
  ratingFilter: string;
  setRatingFilter: (val: string) => void;
  sports: SportData[] | null;
  programs: FitnessData[];
}) => (
  <div className="sticky top-24 flex flex-col gap-5 border rounded-xl bg-card p-4 h-fit">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-base text-foreground">Filters</h2>
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">{activeFilterCount}</span>
          <button onClick={resetAllFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Reset
          </button>
        </div>
      )}
    </div>

    <div className="h-px bg-border" />

    {/* 1. Category Filter */}
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Category</Label>
      <Select
        value={categoryFilter}
        onValueChange={(val) => {
          setCategoryFilter(val);
          setSportFilter('all');
          setProgramFilter('all');
        }}
      >
        <SelectTrigger className="w-full h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value={PAYLOAD_MODEL.SPORT_SESSION}>🏃 Sports</SelectItem>
          <SelectItem value={PAYLOAD_MODEL.FITNESS_SESSION}>💪 Fitness</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* 2. Sport Select */}
    {(categoryFilter === 'all' || categoryFilter === PAYLOAD_MODEL.SPORT_SESSION) && (
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Sport Type</Label>
        <Select value={sportFilter} onValueChange={(val) => setSportFilter(val)}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports?.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.sportName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    {/* 3. Program Select */}
    {(categoryFilter === 'all' || categoryFilter === PAYLOAD_MODEL.FITNESS_SESSION) && (
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Program</Label>
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs?.map((pgm) => (
              <SelectItem key={pgm.id} value={pgm.id}>
                {pgm.programName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    <div className="h-px bg-border" />

    {/* 4. Age Group */}
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Age Group</Label>
      <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
        <SelectTrigger className="w-full h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          {Object.values(AGE_GROUP).map((age) => (
            <SelectItem key={age} value={age}>
              {age}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* 5. Session Type */}
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Session Type</Label>
      <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
        <SelectTrigger className="w-full h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.values(SESSION_TYPE).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="h-px bg-border" />

    {/* 6. Rating Filter */}
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Minimum Rating</Label>
      <div className="flex flex-col gap-2">
        {[4, 3, 2].map((r) => {
          const isActive = ratingFilter === String(r);
          return (
            <button
              key={r}
              onClick={() => setRatingFilter(isActive ? '' : String(r))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                isActive ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary/30'
              }`}
            >
              <span>{r}★</span>
              <span className="text-xs">&amp; up</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default FilterPanel;

// Empty Filter State

export const EmptyFilterState = ({ resetAllFilters }: { resetAllFilters: () => void }) => (
  <div className="flex items-center justify-center py-24">
    <div className="flex flex-col items-center gap-4 text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="font-semibold text-lg">No sessions match your filters</h3>
      <p className="text-sm text-muted-foreground">Try adjusting your filters to find more sessions</p>
      <button onClick={resetAllFilters} className="text-sm text-primary hover:underline mt-2">
        Reset all filters
      </button>
    </div>
  </div>
);


