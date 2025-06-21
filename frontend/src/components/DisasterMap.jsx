import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DisasterMap.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

// Auto-fit component to adjust bounds based on markers
const FitBounds = ({ disasters }) => {
  const map = useMap();

  useEffect(() => {
    if (!disasters.length) return;

    const bounds = L.latLngBounds([]);

    disasters.forEach(disaster => {
      let lat, lon;

      // Handle POINT string format
      if (typeof disaster.location === 'string') {
        const match = disaster.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) {
          lon = parseFloat(match[1]);
          lat = parseFloat(match[2]);
        }
      }

      // Handle GeoJSON { coordinates: [lon, lat] }
      if (!lat || !lon) {
        const coords = disaster.location?.coordinates;
        if (Array.isArray(coords)) {
          lon = coords[0];
          lat = coords[1];
        }
      }

      if (lat && lon) {
        bounds.extend([lat, lon]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [disasters, map]);

  return null;
};

const DisasterMap = ({ disasters }) => {
  const defaultCenter = [20.2961, 85.8245]; // Default: Odisha

  return (
    <div style={{ height: '400px', marginTop: '2rem' }}>
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {disasters.map(disaster => {
          let lat, lon;

          // Case 1: location stored as string POINT(lon lat)
          if (typeof disaster.location === 'string') {
            const match = disaster.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
            if (match) {
              lon = parseFloat(match[1]);
              lat = parseFloat(match[2]);
            }
          }

          // Case 2: location stored as GeoJSON
          if ((!lat || !lon) && disaster.location?.coordinates) {
            const coords = disaster.location.coordinates;
            if (Array.isArray(coords)) {
              lon = coords[0];
              lat = coords[1];
            }
          }

          if (!lat || !lon) return null;

          return (
            <Marker key={disaster.id} position={[lat, lon]}>
              <Popup>
                <strong>{disaster.title}</strong><br />
                {disaster.location_name}<br />
                {disaster.description}
              </Popup>
            </Marker>
          );
        })}

        <FitBounds disasters={disasters} />
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
