import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

const STATUS_COLORS = { open: '#16a34a', busy: '#d97706', closed: '#dc2626' };

export default function MapView({ center, bathrooms, selectedId, onSelect, radius }) {
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY });
  const onLoad = useCallback((map) => { mapRef.current = map; }, []);

  if (!isLoaded) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6' }}>Loading map...</div>;

  return (
    <GoogleMap mapContainerStyle={{ flex: 1, width: '100%' }} center={center} zoom={15} onLoad={onLoad}
      options={{ disableDefaultUI: false, zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
      <Marker position={center} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#2563eb', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 }} title="You are here" zIndex={1000} />
      <Circle center={center} radius={radius} options={{ fillColor: '#2563eb', fillOpacity: 0.05, strokeColor: '#2563eb', strokeOpacity: 0.2, strokeWeight: 1 }} />
      {bathrooms.map(b => (
        <Marker key={b.id} position={{ lat: b.lat, lng: b.lng }} onClick={() => onSelect(b)} title={b.name}
          icon={{ path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: STATUS_COLORS[b.status] || '#6b7280', fillOpacity: 1, strokeColor: '#fff',
            strokeWeight: selectedId === b.id ? 2.5 : 1.5, scale: selectedId === b.id ? 2 : 1.6,
            anchor: new window.google.maps.Point(12, 22) }} />
      ))}
    </GoogleMap>
  );
}
