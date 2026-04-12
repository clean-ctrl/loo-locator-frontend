import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function AddBathroomModal({ userLocation, onClose, onAdded }) {
  const [form, setForm] = useState({ name:'', address:'', lat: userLocation?.lat||'', lng: userLocation?.lng||'', is_free:true, is_accessible:false, gender_type:'male_female', requires_key:false, customers_only:false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!form.name || !form.address) { setError('Name and address are required.'); return; }
    setSaving(true);
    try {
      const r = await fetch(`${BASE_URL}/api/bathrooms`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) }) });
      const result = await r.json();
      onAdded(result); onClose();
    } catch { setError('Could not add bathroom.'); }
    setSaving(false);
  }

  const inp = { width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #d1d5db', fontSize:14, outline:'none' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-end', zIndex:50 }}>
      <div style={{ width:'100%', background:'#fff', borderRadius:'16px 16px 0 0', padding:'24px 20px 36px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700 }}>Add a Bathroom</h2>
          <button onClick={onClose} style={{ border:'none', background:'#f3f4f6', borderRadius:'50%', width:32, height:32, fontSize:18, cursor:'pointer' }}>×</button>
        </div>
        {[['Name *','name','e.g. Tim Hortons — Fort St'],['Address *','address','e.g. 123 Fort St, Victoria, BC']].map(([label,key,ph]) => (
          <div key={key} style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>{label}</label>
            <input value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} style={inp} />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {[['Latitude','lat','48.4284'],['Longitude','lng','-123.3656']].map(([label,key,ph]) => (
            <div key={key}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>{label}</label>
              <input type="number" value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} style={inp} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 }}>Gender</label>
          <select value={form.gender_type} onChange={e => setForm(f=>({...f,gender_type:e.target.value}))} style={inp}>
            <option value="male_female">Male / Female</option>
            <option value="gender_neutral">Gender neutral</option>
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {[['is_free','Free to use'],['is_accessible','Wheelchair accessible'],['requires_key','Requires a key'],['customers_only','Customers only']].map(([key,label]) => (
            <label key={key} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, cursor:'pointer' }}>
              <input type="checkbox" checked={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.checked}))} style={{ width:18, height:18 }} />
              {label}
            </label>
          ))}
        </div>
        {error && <div style={{ color:'#dc2626', fontSize:13, marginBottom:12 }}>{error}</div>}
        <button onClick={handleSubmit} disabled={saving} style={{ width:'100%', padding:13, borderRadius:10, background: saving ? '#93c5fd' : '#2563eb', color:'#fff', border:'none', fontSize:15, fontWeight:600, cursor:'pointer' }}>
          {saving ? 'Adding...' : 'Add Bathroom'}
        </button>
      </div>
    </div>
  );
}
