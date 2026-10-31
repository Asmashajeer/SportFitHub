import {type DayName } from "@/constants/constants";
import { useMemo } from "react";
import type { Trainer } from "../store/useTrainerStore";

export function useTrainerAvailability(profile: Trainer|null) {
  const avl=profile?.availability;
  const availableDays = useMemo(() => (
    // DAYS_OF_WEEK.filter(day => profile?.availability?.[day]?.available === true),
     avl?.weeklySchedule.filter((sday)=>sday.isAvailable).map((d)=>d.day)||[]),
    [profile]
  );

  // const checkInWorkingHours = (day: DayName, startTime: string, endTime: string): boolean => {
  //   const workingDay = profile?.availability?.[day];
  //   if (!workingDay?.available || !workingDay.startTime || !workingDay.endTime) return false;
  //   const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  //   return toMin(startTime) >= toMin(workingDay.startTime) && toMin(endTime) <= toMin(workingDay.endTime);
  // };
  const checkInWorkingHours = (day: DayName, startTime: string, endTime: string): boolean => {
    if (! avl?.weeklySchedule) return false;
    const daySchedule=avl.weeklySchedule.find((s)=>s.day===day);
    if (!daySchedule?.isAvailable || !daySchedule.slots || daySchedule.slots.length === 0) {
      return false;
    }
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

    const targetStart = toMin(startTime);
    const targetEnd = toMin(endTime);

    return daySchedule.slots.some((slot) => {
      if (!slot.startTime || !slot.endTime) return false;
      const slotStart = toMin(slot.startTime);
      const slotEnd = toMin(slot.endTime);

      return targetStart >= slotStart && targetEnd <= slotEnd;
    });   
  }

  return { availableDays, checkInWorkingHours };
}