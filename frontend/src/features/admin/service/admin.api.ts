export const ADMIN_ROUTES = {
  
  // users routes
  GET_USERS: "/admin/users/allUsers",
  GET_STATS: "/admin/users/getStats",
  TOGGLE_BLOCK: "/admin/users/toggleBlock",
  DELETE_USER: `/admin/users/deleteUser`,
  UPDATE_USER_ROLE: "/admin/users/updateRole",
  
 
} as const;