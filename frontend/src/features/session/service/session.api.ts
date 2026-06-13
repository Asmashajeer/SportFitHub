

export const GET_SESSION = {
  BY_ID: (sessionModel: string, id: string) =>
    `/user/sessions/${sessionModel}/${id}`,
};
