import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: google.maps.MarkerOptions[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom, markers = [] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (ref.current) {
        const newMap = new google.maps.Map(ref.current, {
          center,
          zoom,
        });
        setMap(newMap);
      }
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load Google Maps script dynamically
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach(marker => {
        new google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
        });
      });
    }
  }, [map, markers]);

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMap;