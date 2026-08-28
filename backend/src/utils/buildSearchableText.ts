
export const buildSportsSearchText = (session) => {
  return [
    session.sessionName,
    session.slug,
    session.description,
    session.sportCategory?.sportName,
    session.sessionType,
    session.ageGroup,
    session.venue?.name,
  ].filter(Boolean).join(' ');
};



//------------fitness---------------
export const buildFitnessSearchText = (session) => {
  return [
    session.sessionName,
    session.slug,
    session.description,
    session.ageGroup,
    session.sessionType,
    session.fitnessCategory?.programName,
    session.venue?.name,
    session.mode,
    session.intensityLevel,
  ].filter(Boolean).join(' ');
};
