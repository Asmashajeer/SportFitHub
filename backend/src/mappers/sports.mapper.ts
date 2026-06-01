import { ISports } from '@/models/sports.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toSportsResponseDTO = (sport: ISports) => {
  const timezone = getTimezone();
  return {
    id: sport._id.toString(),
    sportName: sport.sportName,
    slug: sport.slug,
    icon: sport.icon,
    description: sport.description,
    isActive: sport.isActive,
  };
};
