import { useState, useEffect } from 'react';

const DEFAULT_LOCATION = { lat: 48.4284, lng: -123.3656 };

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      setError('Geolocation not supported — showing Victoria, BC');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoading(false); },
      () => { setLocation(DEFAULT_LOCATION); setError('Location denied — showing Victoria, BC'); setLoading(false); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { location, error, loading };
}
