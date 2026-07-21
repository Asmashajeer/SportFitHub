export interface ProgramResponseDTO {
  id: string;
  programName: string;
  slug: string;

  description: string;
  isActive: boolean;
}

export interface FitnessProgramResponseDTOWithPagination {
  programs: ProgramResponseDTO[];
  total: number;
  totalPages: number;
  page: number;
}
