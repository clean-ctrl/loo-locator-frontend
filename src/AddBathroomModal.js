import React, { useState, useEffect, useRef } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function AddBathroomModal({ userLocation, onClose, onAdded }) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    is_free: true,
    is_accessible: false,
    gender_type: 'male_female',
    requires_key: false,
    customers_only: false,
  });
  const [coords, setCoords] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const addressRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !addressRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'ca' },
      fields: ['formatted_address', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        setError('Could not find that address — please select one from the dropdown');
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoords({ lat, lng });
      setForm(f => ({ ...f, address: place.formatted_address }));
      setError('');
    });

    autocompleteRef.current = autocomplete;

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  async function handleSubmit() {
    if (!form.name) { setError('Name is required.'); return; }
    if (!form.address) { setError('Address is required.'); return; }
    if (!coords) { setError('Please select an address from the dropdown suggestions.'); return; }

    setSaving(true);
    setError('');
    try {
      const r = await fetch(`${BASE_URL}/api/bathrooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: coords.lat, lng: coords.lng }),
      });
      const result = await r.json();
      onAdded(result);
      onClose();
    } catch {
      setError('Could not add bathroom. Please try again.');
    }
    setSaving(false);
  }

  const inp = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
      <div style={{ width: '100%', background: '#fff', borderRadius: '16px 16px 0 0', padding: '24px 20px 36px', maxHeight: '85vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add a Bathroom</h2>
          <button onClick={onClose} style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
            Bathroom name *
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Thrifty Foods — Broadmead"
            style={inp}
          />
        </div>

        {/* Address autocomplete */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
            Address * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(start typing and pick from the list)</span>
          </label>
          <input
            ref={addressRef}
            value={form.address}
            onChange={e => { setForm(f => ({ ...f, address: e.target.value })); setCoords(null); }}
            placeholder="e.g. 777 Royal Oak Dr, Victoria"
            style={{ ...inp, borderColor: coords ? '#16a34a' : '#d1d5db' }}
            autoComplete="off"
          />
          {coords && (
            <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>
              ✓ Location confirmed
            </div>
          )}
          {!coords && form.address.length > 3 && (
            <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>
              ⚠ Please select an address from the dropdown
            </div>
          )}
        </div>

        {/* Gender */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Gender</label>
          <select value={form.gender_type} onChange={e => setForm(f => ({ ...f, gender_type: e.target.value }))} style={inp}>
            <option value="male_female">Male / Female</option>
            <option value="gender_neutral">Gender neutral</option>
            <option value="male_only">Male only</option>
            <option value="female_only">Female only</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['is_free', 'Free to use'],
            ['is_accessible', 'Wheelchair accessible'],
            ['requires_key', 'Requires a key'],
            ['customers_only', 'Customers only'],
          ].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                style={{ width: 18, height: 18 }}
              />
              {label}
            </label>
          ))}
        </div>

        {error && (
          <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#fee2e2', borderRadius: 6 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', padding: 13, borderRadius: 10,
            background: saving ? '#93c5fd' : '#2563eb',
            color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? 'Adding...' : 'Add Bathroom'}
        </button>

      </div>
    </div>
  );
}
