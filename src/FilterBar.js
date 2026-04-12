import React from 'react';
const FILTERS = [
  { key: 'open', label: 'Open now' },
  { key: 'free', label: 'Free' },
  { key: 'accessible', label: 'Accessible' },
  { key: 'gender_neutral', label: 'Gender neutral' },
];
export default function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 16px', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
      {FILTERS.map(f => (
        <button key={f.key} onClick={() => onChange(prev => ({ ...prev, [f.key]: !prev[f.key] }))} style={{
          whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: 99, fontSize: 13, cursor: 'pointer',
          border: active[f.key] ? 'none' : '1px solid #d1d5db',
          background: active[f.key] ? '#2563eb' : '#fff',
          color: active[f.key] ? '#fff' : '#374151',
        }}>{f.label}</button>
      ))}
    </div>
  );
}
