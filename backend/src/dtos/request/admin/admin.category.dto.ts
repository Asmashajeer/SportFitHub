export interface getQueryDTO {
  page: number;
  limit:number;
  search: string;
  status?: string;
}

export interface SportRequestDTO {
  id: string;
  sportName: string;
  slug: string;
  icon?: string;
  description: string;
  isActive?: boolean;
}

export interface FitnessPgmRequestDTO {
  id: string;
  programName: string;
  slug: string;
  description: string;
  isActive?: boolean;
}
