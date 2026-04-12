import React from 'react';

export default function Header({ onAddBathroom }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', background: '#fff',
      borderBottom: '1px solid #e5e7eb', zIndex: 10, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>🚽</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: '#111' }}>Loo Locator</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Community bathroom finder</div>
        </div>
      </div>
      <button onClick={onAddBathroom} style={{
        background: '#2563eb', color: '#fff', border: 'none',
        borderRadius: 8, padding: '8px 14px', fontSize: 13,
        fontWeight: 500, cursor: 'pointer',
      }}>+ Add Bathroom</button>
    </header>
  );
}
