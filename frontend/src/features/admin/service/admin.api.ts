export const ADMIN_ROUTES = {
  
  // users routes
  GET_USERS: "/admin/users/allUsers",
  GET_STATS: "/admin/users/getStats",
  TOGGLE_BLOCK: "/admin/users/toggleBlock",
  DELETE_USER: `/admin/users/deleteUser`,
  UPDATE_USER_ROLE: "/admin/users/updateRole",
  
  //trainersApprovals
    GET_PENDING_TRAINERS:'/admin/trainers/get_pending_trainers',
    GET_TRAINER:'/admin/trainers/get_trainer',
    TRAINERS:'/admin/trainers'
} as const;