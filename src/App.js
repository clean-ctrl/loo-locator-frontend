import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import FilterBar from './FilterBar';
import MapView from './MapView';
import BathroomCard from './BathroomCard';
import BathroomDetail from './BathroomDetail';
import AddBathroomModal from './AddBathroomModal';
import { useUserLocation } from './hooks/useUserLocation';
import { fetchNearbyBathrooms } from './utils/api';

const RADIUS = 1500;

export default function App() {
  const { location, error: locError, loading: locLoading } = useUserLocation();
  const [bathrooms, setBathrooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ open: false, free: false, accessible: false, gender_neutral: false });
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState('split');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const loadBathrooms = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const apiFilters = {};
      if (filters.open) apiFilters.status = 'open';
      if (filters.free) apiFilters.is_free = true;
      if (filters.accessible) apiFilters.is_accessible = true;
      if (filters.gender_neutral) apiFilters.gender_type = 'gender_neutral';
      const data = await fetchNearbyBathrooms({ ...location, radius: RADIUS, filters: apiFilters });
      setBathrooms(data.bathrooms || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [location, filters]);

  useEffect(() => {
    loadBathrooms();
  }, [loadBathrooms]);

  function handleSelect(bathroom) {
    setSelected(prev => prev?.id === bathroom.id ? null : bathroom);
  }

  function handleAdded(newBathroom) {
    setBathrooms(prev => [newBathroom, ...prev]);
    setSelected(newBathroom);
  }

  if (locLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ fontSize: 40 }}>🚽</span>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#374151' }}>Finding your location...</div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>Please allow location access when prompted</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header onAddBathroom={() => setShowAdd(true)} />

      {locError && (
        <div style={{ background: '#fef9c3', padding: '8px 16px', fontSize: 12, color: '#854d0e', flexShrink: 0 }}>
          ⚠️ {locError}
        </div>
      )}

      <FilterBar active={filters} onChange={setFilters} />

      <div style={{ display: 'flex', padding: '8px 16px', background: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        {[['split', 'Map + List'], ['map', 'Map only'], ['list', 'List only']].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '6px 0', fontSize: 12, cursor: 'pointer',
            border: '1px solid #e5e7eb',
            background: view === v ? '#2563eb' : '#fff',
            color: view === v ? '#fff' : '#6b7280',
            fontWeight: view === v ? 600 : 400,
            borderRadius: v === 'split' ? '6px 0 0 6px' : v === 'list' ? '0 6px 6px 0' : '0',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {(view === 'split' || view === 'map') && location && (
          <div style={{ flex: view === 'split' ? '0 0 55%' : '1', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <MapView
              center={location}
              bathrooms={bathrooms}
              selectedId={selected ? selected.id : null}
              onSelect={handleSelect}
              radius={RADIUS}
            />
            {selected && (
              <BathroomDetail
                bathroom={selected}
                userLocation={location}
                onClose={() => setSelected(null)}
                onUpdate={loadBathrooms}
              />
            )}
          </div>
        )}

        {(view === 'split' || view === 'list') && (
          <div ref={listRef} style={{
            flex: view === 'split' ? '0 0 45%' : '1',
            overflowY: 'auto',
            borderLeft: view === 'split' ? '1px solid #e5e7eb' : 'none',
            background: '#fff',
          }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                Looking for loos nearby...
              </div>
            ) : bathrooms.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                No bathrooms found nearby.
                <br />
                <button
                  onClick={() => setShowAdd(true)}
                  style={{ marginTop: 12, color: '#2563eb', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Add the first one!
                </button>
              </div>
            ) : (
              bathrooms.map(b => (
                <BathroomCard
                  key={b.id}
                  bathroom={b}
                  userLocation={location}
                  selected={selected ? selected.id === b.id : false}
                  onClick={() => handleSelect(b)}
                />
              ))
            )}

            {view === 'list' && selected && (
              <BathroomDetail
                bathroom={selected}
                userLocation={location}
                onClose={() => setSelected(null)}
                onUpdate={loadBathrooms}
              />
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <AddBathroomModal
          userLocation={location}
          onClose={() => setShowAdd(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}
