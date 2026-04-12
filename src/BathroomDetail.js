import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
function getDeviceId() {
  let id = localStorage.getItem('loo_device_id');
  if (!id) { id = 'dev_' + Math.random().toString(36).slice(2); localStorage.setItem('loo_device_id', id); }
  return id;
}

const VOTES = [
  { key:'clean', label:'Clean', emoji:'✓' },
  { key:'stocked', label:'Stocked', emoji:'📦' },
  { key:'busy', label:'Busy', emoji:'⏳' },
  { key:'broken', label:'Out of order', emoji:'✗' },
];
const ISSUES = [
  { key:'out_of_paper', label:'No paper' },
  { key:'no_soap', label:'No soap' },
  { key:'broken_lock', label:'Broken lock' },
  { key:'flooded', label:'Flooded' },
];
const STATUS = { open:{label:'Open',bg:'#dcfce7',color:'#166534'}, busy:{label:'Busy',bg:'#fef9c3',color:'#854d0e'}, closed:{label:'Closed',bg:'#fee2e2',color:'#991b1b'} };

export default function BathroomDetail({ bathroom, onClose, onUpdate }) {
  const [myVotes, setMyVotes] = useState([]);
  const [votes, setVotes] = useState({});
  const [myRating, setMyRating] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/bathrooms/${bathroom.id}/votes?device_id=${getDeviceId()}`)
      .then(r => r.json()).then(d => { setVotes(d.votes || {}); setMyVotes(d.my_votes || []); }).catch(()=>{});
  }, [bathroom.id]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }

  async function handleVote(key) {
    try {
      const r = await fetch(`${BASE_URL}/api/bathrooms/${bathroom.id}/votes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ device_id: getDeviceId(), vote_type: key }) });
      const d = await r.json();
      setVotes(d.votes);
      setMyVotes(prev => d.action === 'added' ? [...prev, key] : prev.filter(k => k !== key));
      showToast(d.action === 'added' ? 'Thanks!' : 'Vote removed');
      onUpdate && onUpdate();
    } catch { showToast('Error'); }
  }

  async function handleIssue(key) {
    try {
      await fetch(`${BASE_URL}/api/bathrooms/${bathroom.id}/issues`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ device_id: getDeviceId(), issue_type: key }) });
      showToast('Issue reported!');
    } catch { showToast('Error'); }
  }

  async function handleRating(stars) {
    setMyRating(stars);
    try {
      await fetch(`${BASE_URL}/api/bathrooms/${bathroom.id}/ratings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ device_id: getDeviceId(), stars }) });
      showToast(`Rated ${stars} stars!`);
      onUpdate && onUpdate();
    } catch { showToast('Error'); }
  }

  const s = STATUS[bathroom.status] || STATUS.closed;

  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#fff', borderRadius:'16px 16px 0 0', boxShadow:'0 -4px 24px rgba(0,0,0,0.12)', maxHeight:'75vh', overflowY:'auto', zIndex:20, padding:'0 0 32px' }}>
      <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'#e5e7eb' }} />
      </div>
      <button onClick={onClose} style={{ position:'absolute', top:12, right:16, border:'none', background:'#f3f4f6', borderRadius:'50%', width:32, height:32, fontSize:18, cursor:'pointer' }}>×</button>
      <div style={{ padding:'8px 20px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#111', flex:1, paddingRight:12 }}>{bathroom.name}</h2>
          <span style={{ fontSize:12, fontWeight:600, padding:'3px 10px', borderRadius:99, background:s.bg, color:s.color }}>{s.label}</span>
        </div>
        <div style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>{bathroom.address}</div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:500, color:'#374151', marginBottom:6 }}>
            {bathroom.avg_rating ? `${Number(bathroom.avg_rating).toFixed(1)} ★ (${bathroom.rating_count} ratings)` : 'No ratings yet — be the first!'}
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {[1,2,3,4,5].map(n => (
              <span key={n} onClick={() => handleRating(n)} style={{ fontSize:24, cursor:'pointer', color: n <= myRating ? '#f59e0b' : '#d1d5db' }}>★</span>
            ))}
          </div>
        </div>

        <div style={{ fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:10 }}>How is it right now?</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {VOTES.map(b => {
            const voted = myVotes.includes(b.key);
            return (
              <button key={b.key} onClick={() => handleVote(b.key)} style={{ padding:'8px 14px', borderRadius:99, fontSize:13, cursor:'pointer', border: voted ? 'none' : '1px solid #e5e7eb', background: voted ? '#dbeafe' : '#fff', color: voted ? '#1e40af' : '#374151' }}>
                {b.emoji} {b.label} {votes[b.key] > 0 && <strong>{votes[b.key]}</strong>}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize:12, fontWeight:600, color:'#6b7280', marginBottom:10 }}>Report an issue</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {ISSUES.map(b => (
            <button key={b.key} onClick={() => handleIssue(b.key)} style={{ padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', border:'1px solid #e5e7eb', background:'#fff', color:'#374151' }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      {toast && <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#111', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, zIndex:99 }}>{toast}</div>}
    </div>
  );
}
