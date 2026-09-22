import { DAYS_OF_WEEK, type DayName } from "@/constants/constants";
import { useMemo } from "react";
import type { Trainer } from "../store/useTrainerStore";

export function useTrainerAvailability(profile: Trainer|null) {
  const availableDays = useMemo(() => 
    DAYS_OF_WEEK.filter(day => profile?.availability?.[day]?.available === true),
    [profile]
  );

  const checkInWorkingHours = (day: DayName, startTime: string, endTime: string): boolean => {
    const workingDay = profile?.availability?.[day];
    if (!workingDay?.available || !workingDay.startTime || !workingDay.endTime) return false;
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    return toMin(startTime) >= toMin(workingDay.startTime) && toMin(endTime) <= toMin(workingDay.endTime);
  };

  return { availableDays, checkInWorkingHours };
}