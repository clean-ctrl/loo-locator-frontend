import React from 'react';

function distanceMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function formatDistance(m) { return m < 1000 ? `${Math.round(m)}m` : `${(m/1000).toFixed(1)}km`; }

const STATUS = { open:{label:'Open',bg:'#dcfce7',color:'#166534'}, busy:{label:'Busy',bg:'#fef9c3',color:'#854d0e'}, closed:{label:'Closed',bg:'#fee2e2',color:'#991b1b'} };

export default function BathroomCard({ bathroom, userLocation, selected, onClick }) {
  const s = STATUS[bathroom.status] || STATUS.closed;
  const dist = userLocation ? distanceMetres(userLocation.lat, userLocation.lng, bathroom.lat, bathroom.lng) : null;
  return (
    <div onClick={onClick} style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: selected ? '#eff6ff' : '#fff', borderLeft: selected ? '3px solid #2563eb' : '3px solid transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{bathroom.name}</div>
        <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{dist ? formatDistance(dist) + ' away' : bathroom.address}</div>
      <div style={{ fontSize: 13, color: '#f59e0b' }}>
        {bathroom.avg_rating ? '★'.repeat(Math.round(bathroom.avg_rating)) + '☆'.repeat(5-Math.round(bathroom.avg_rating)) : 'No ratings yet'}
      </div>
    </div>
  );
}
