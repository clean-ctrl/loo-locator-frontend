const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export function getDeviceId() {
  let id = localStorage.getItem('loo_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('loo_device_id', id);
  }
  return id;
}

export async function fetchNearbyBathrooms({ lat, lng, radius = 1000, filters = {} }) {
  const params = new URLSearchParams({ lat, lng, radius, limit: 30, ...filters });
  const res = await fetch(`${BASE_URL}/api/bathrooms?${params}`);
  if (!res.ok) throw new Error('Failed to fetch bathrooms');
  return res.json();
}

export function distanceMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function formatDistance(metres) {
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
}
