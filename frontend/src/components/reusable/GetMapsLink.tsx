// GetMapsLink.tsx
import { ExternalLink } from 'lucide-react';

interface GetMapsLinkProps {
  coords: [number, number]; // Expected format: [longitude, latitude]
}

const GetMapsLink = ({ coords }: GetMapsLinkProps) => {
  if (!coords || !Array.isArray(coords) || coords.length < 2) {
    return null;
  }

  // 2. MongoDB uses [lng, lat], Google uses lat,lng
  const [lng, lat] = coords;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] tracking-widest transition-colors mt-2"
    >
      <span>Get Direction</span>
      <ExternalLink size={12} />
    </a>
  );
};

export default GetMapsLink;
