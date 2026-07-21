export interface SportsResponseDTO {
  id: string;
  sportName: string;
  slug: string;
  icon: string;
  description: string;
  isActive: boolean;
}
export interface SportsResponseDTOWithPagination {
  sports: SportsResponseDTO[];
  total: number;
  totalPages: number;
  page: number;
}
