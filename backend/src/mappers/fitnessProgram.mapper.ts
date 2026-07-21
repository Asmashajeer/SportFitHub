import { IFitnessProgram } from '@/models/fitnessProgram.model';

export const toProgramResponseDTO = (program: IFitnessProgram) => {
  return {
    id: program._id.toString(),
    programName: program.programName,
    slug: program.slug,

    description: program.description,
    isActive: program.isActive,
  };
};
