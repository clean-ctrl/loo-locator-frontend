import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100vw', height: '100vh' };
const center = { lat: 48.4284, lng: -123.3656 }; // Victoria, BC

function App() {
  const [bathrooms, setBathrooms] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY
  });

  useEffect(() => {
    // This connects to your Railway Backend
    fetch(`${process.env.REACT_APP_API_URL}/api/bathrooms`)
      .then(res => res.json())
      .then(data => setBathrooms(data.bathrooms || []))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {bathrooms.map(loo => (
          <Marker 
            key={loo.id} 
            position={{ lat: parseFloat(loo.lat), lng: parseFloat(loo.lng) }} 
            title={loo.name} 
          />
        ))}
      </GoogleMap>
      
      {/* Floating Info Box */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, 
        background: 'white', padding: '15px', 
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'sans-serif' 
      }}>
        <h2 style={{ margin: 0 }}>Loo Locator 🚽</h2>
        <p style={{ margin: '5px 0 0' }}>{bathrooms.length} bathrooms found nearby.</p>
      </div>
    </div>
  );
}

export default App;
