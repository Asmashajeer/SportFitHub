import { MapContainer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
const mapPicker_key = import.meta.env.VITE_MAPTILER_CLOUD_API;
import { MaptilerLayer, Language } from '@maptiler/leaflet-maptilersdk';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker = ({ onLocationSelect }: MapPickerProps) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  useEffect(() => {
    const handleSearch = (result: any) => {
      const { x, y } = result.location; // x: lng, y: lat
      const newPos = L.latLng(y, x);
      setPosition(newPos);
    };

    map.on('geosearch/showlocation', handleSearch);
    return () => {
      map.off('geosearch/showlocation', handleSearch);
    };
  }, [map]);
  return position === null ? null : <Marker position={position}></Marker>;
};

const SearchField = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // @ts-ignore - The types for GeoSearchControl can be finicky with React
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address (e.g. Dubai Mall)',
    });

    map.addControl(searchControl);

    // Listen for the location selection event
    map.on('geosearch/showlocation', (result: any) => {
      const { x, y } = result.location; // x is Longitude, y is Latitude
      onLocationSelect(y, x);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};
function MapLanguageControl({ apiKey }: { apiKey: string }) {
  const map = useMap();

  useEffect(() => {
    const mtLayer = new MaptilerLayer({
      apiKey: apiKey,
      language: Language.ENGLISH,
      style: 'streets-v2',
    });

    mtLayer.addTo(map);

    return () => {
      map.removeLayer(mtLayer);
    };
  }, [map, apiKey]);

  return null;
}
export const MapPicker = ({ onLocationSelect }: MapPickerProps) => {
  return (
    <div className="h-100 w-full rounded-md border overflow-hidden">
      <MapContainer
        center={[25.2048, 55.2708]} // Default to Dubai (or your preferred city)
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapLanguageControl apiKey={mapPicker_key} />
        <SearchField onLocationSelect={onLocationSelect} />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};
