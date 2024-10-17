import React, { useEffect, useRef, useState } from 'react';
import leaflet, { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

function LeafletMap({ longitude, latitude, question }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (longitude && latitude && !map) {
      // Initiera Leaflet-kartan när komponenten har renderats och vi har koordinater
      const mapInstance = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Lägg till OpenStreetMap som tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Lägg till en markör på quizets position
      const marker = L.marker([latitude, longitude]).addTo(mapInstance);
      marker.bindPopup(`<b>${question}</b><br>Longitude: ${longitude}, Latitude: ${latitude}`).openPopup();

      setMap(mapInstance);
    }

    // Ta bort kartan när komponenten avmonteras
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [longitude, latitude, map, question]);

  return (
    <div>
       <section id='map'></section>
    </div>
  );
}

export default LeafletMap;
