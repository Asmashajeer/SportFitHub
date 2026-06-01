import {
  BOOKING_SESSION_STATUS,
  SESSION_MODE,
  SESSION_TYPE,
} from '@/constants/constants';

export interface DashboardStats {
  totalusers: number;
  ActiveUsers: number;
}
export interface queryParamsOptions {
  page: number;
  search?: string;
  status?: string;
  role?: string;
}
export interface getAllusersParams extends queryParamsOptions {
  limit: number;
}

export interface SportData {
  id: string;
  sportName: string;
  slug: string;
  icon?: string;
  description: string;
  isActive?: boolean;
}

export interface FitnessData {
  id: string;
  programName: string;
  slug: string;
  description: string;
  isActive?: boolean;
}
export interface SessionFilter {
  page: number;
  limit: number;
  search: string;
  status: string;
  type: string;
  mode: string;
}
export interface TrainerFilter {
  page: number;
  limit: number;
  search: string;
  status: string;
   category:string
}