
// const SessionGrid = ({ sessions, ratingsMap }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//     {sessions.map((session) =>
//       session.type === 'SPORTS' ? (
//         <SportSessionCard key={session.id} session={session} rating={ratingsMap[session.id]} />
//       ) : (
//         <FitnessSessionCard key={session.id} session={session} rating={ratingsMap[session.id]} />
//       )
//     )}
//   </div>
// );
// features/sessions/components/SessionGrid.tsx


import  { PAYLOAD_MODEL } from "@/constants/constants";
import type { FitnessSessionPublicResponseData } from "../store/fitness.session.types";
import type { SportsSessionPublicResponseData } from "../store/session.types";
import FitnessSessionCard from "./fitnessSession/FitnessSessionCard";
import SportSessionCard from "./sportSession/SportSessionCard";
import type { SessionPublicResponseData } from "../store/types";



interface SessionGridProps {
  sessions: SessionPublicResponseData[];
  ratingsMap?: Record<string, { avgRating: number; reviewCount: number }>;
}

const SessionGrid = ({ sessions, ratingsMap = {} }: SessionGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {sessions.map((session) =>
        session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? (
          <SportSessionCard
            key={session.id}
            session={session as SportsSessionPublicResponseData}
            rating={ratingsMap[session.id]}
          />
        ) : (
          <FitnessSessionCard
            key={session.id}
            session={session as FitnessSessionPublicResponseData}
            rating={ratingsMap[session.id]}
          />
        )
      )}
    </div>
  );
};

export default SessionGrid;