import { IFitnessProgram } from '@/models/fitnessProgram.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toProgramResponseDTO = (program: IFitnessProgram) => {
  const timezone = getTimezone();
  return {
    id: program._id.toString(),
    programName: program.programName,
    slug: program.slug,

    description: program.description,
    isActive: program.isActive,
  };
};
