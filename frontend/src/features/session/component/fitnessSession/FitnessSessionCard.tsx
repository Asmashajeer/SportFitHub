import { Clock, MapPin, Star, Users, User, Zap } from 'lucide-react';
import { CURRENCY,PAYLOAD_MODEL,SESSION_MODE } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import type { FitnessSessionPublicResponseData } from '../../store/fitness.session.types';



const FitnessSessionCard = ({
  session,
  rating
}: {
  session: FitnessSessionPublicResponseData;
  rating?: { avgRating: number; reviewCount: number };
}) => {
  const navigate = useNavigate();
  const handleCardClick = () => navigate(`/fitness/sessions/${session.id}`);

  const startingPrice = Math.min(...session.pricing.map((p) => p.price));
  const isOnline = session.mode === SESSION_MODE.ONLINE;

  const intensityColor: Record<string, string> = {
    Low: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-500 bg-amber-50 border-amber-200',
    High: 'text-red-500 bg-red-50 border-red-200',
  };
 

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={session.images[0] || '/placeholder-fitness.jpg'}
          alt={session.sessionName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Top-left: online / venue */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20">
            {isOnline ? (
              <>
                <Zap size={11} className="text-emerald-400" />
                Online
              </>
            ) : (
              <>
                <MapPin size={11} className="text-sky-300" />
                {session.venue?.name}
              </>
            )}
          </span>
        </div>

        {/* Top-right: intensity */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${
              intensityColor[session.intensityLevel] ?? 'text-slate-500 bg-white/80 border-slate-200'
            }`}
          >
            <Zap size={10} fill="currentColor" />
            {session.intensityLevel}
          </span>
        </div>

        {/* Bottom-right: program badge */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
            {session.fitnessCategory?.programName?? PAYLOAD_MODEL.FITNESS_SESSION}
          </span>
        </div>

        {/* Bottom-left: rating */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-400/90 text-amber-900">
            <Star size={10} fill="currentColor" />
          
              {rating?.avgRating ?? 0}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {session.sessionName}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {session.duration} min
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1">
            <Users size={12} />
            {session.ageGroup}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted font-medium">
            <User size={11} />
            {session.sessionType}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-0.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              Starting from
            </p>
            <p className="text-2xl font-bold text-foreground leading-none">
              <span className="text-sm font-bold text-muted-foreground mr-0.5">{CURRENCY}</span>
              {startingPrice}
            </p>
          </div>

          <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-0.5">
            View details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FitnessSessionCard;