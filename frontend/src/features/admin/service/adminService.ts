import api from "../../../api/axiosInstance";
import { LIMIT, type UserRole } from "../../../constants/constants";
import type { getAllusersParams, queryParamsOptions } from "../store/types";
import { ADMIN_ROUTES } from "./admin.api";


export const adminService = {
  getUsers: async (queryParams: queryParamsOptions) => {
    const params: getAllusersParams = { page: queryParams.page, limit: LIMIT };

    if (queryParams.search) {
      params.search = queryParams.search;
    }
    if (queryParams.status && queryParams.status !== "all") {
      params.status = queryParams.status;
    }
    if (queryParams.role && queryParams.role !== "all") {
      params.role = queryParams.role;
    }
    const response = await api.get(ADMIN_ROUTES.GET_USERS, { params });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get(ADMIN_ROUTES.GET_STATS);
    return response.data;
  },
  toggleBlock: async (id: string) => {
    const response = await api.patch(ADMIN_ROUTES.TOGGLE_BLOCK, { id });

    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(ADMIN_ROUTES.DELETE_USER + `/${id}`);
    return response.data;
  },
  updateUserRole: async (id: string, selectedRole: UserRole) => {
    const response = await api.patch(ADMIN_ROUTES.UPDATE_USER_ROLE, {
      id,
      selectedRole,
    });
    return response.data;
  },
};
