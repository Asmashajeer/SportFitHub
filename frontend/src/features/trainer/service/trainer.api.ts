export const TRAINER_ROUTES = {
  ADD_PROFILE: '/trainer/add-profile',
  GET_PROFILE_PIC: '/trainer/profile_pic',
  GET_PROFILE: '/trainer/profile',
  // UPDATE_PROFILE:'/trainer/profile',
  UPDATE_PROFILE: {
    BY_ID: (profileId: string) => `trainer/profile/${profileId}`,
  },

  GET_BOOKINGS: '/trainer/bookings',
};
