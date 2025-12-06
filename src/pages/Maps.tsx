import React, { useState, useEffect } from 'react';
import GoogleMap from '@/components/GoogleMap';

export default function Maps() {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ 
    lat: 20.5937, 
    lng: 78.9629 
  });
  
  const [zoom, setZoom] = useState<number>(5);
  
  const markers: google.maps.MarkerOptions[] = [
    {
      position: { lat: 19.0760, lng: 72.8777 },
      title: "Mumbai"
    },
    {
      position: { lat: 28.6139, lng: 77.2090 },
      title: "Delhi"
    },
    {
      position: { lat: 13.0827, lng: 80.2707 },
      title: "Chennai"
    },
    {
      position: { lat: 12.9716, lng: 77.5946 },
      title: "Bangalore"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">🗺️ Travel Maps</h1>
          <p className="text-lg text-gray-600">Explore your travel destinations around the world</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">📍 Interactive World Map</h2>
            <p className="text-gray-600">View your travel history and plan future adventures</p>
          </div>
          
          <div className="p-4">
            <GoogleMap 
              center={mapCenter} 
              zoom={zoom} 
              markers={markers} 
            />
          </div>
        </div>
        
        
        </div>
      </div>
  );
}