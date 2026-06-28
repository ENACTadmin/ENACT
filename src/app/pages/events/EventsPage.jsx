import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  const timeOpts = { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' };
  if (s.toDateString() === e.toDateString()) {
    return `${s.toLocaleDateString('en-US', opts)} · ${s.toLocaleTimeString('en-US', timeOpts)} – ${e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
}

function formatShortDate(date) {
  const d = new Date(date);
  return { month: d.toLocaleDateString('en-US', { month: 'short' }), day: d.getDate() };
}

function EventModal({ event, onClose }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const { month, day } = formatShortDate(event.start);

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 640, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        {event.imageURL ? (
          <img src={event.imageURL} alt={event.title}
            style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
        ) : (
          <div style={{ height: 120, background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`, borderRadius: '12px 12px 0 0' }} />
        )}
        <button onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
          ×
        </button>
        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', minWidth: 52, background: NAVY, borderRadius: 8, padding: '6px 0', flexShrink: 0 }}>
              <div style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{month}</div>
              <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{day}</div>
            </div>
            <h2 style={{ margin: 0, color: NAVY, fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3 }}>{event.title}</h2>
          </div>
          <p style={{ color: GOLD, fontWeight: 600, fontSize: '0.9rem', marginBottom: 16 }}>
            {formatDateRange(event.start, event.end)}
          </p>
          {event.description && (
            <p style={{ color: '#444', lineHeight: 1.7, marginBottom: 24 }}>{event.description}</p>
          )}
          {event.uri && (
            <a href={event.uri} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: BLUE, color: '#fff', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              Learn More ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { month, day } = formatShortDate(event.start);
  const isPast = new Date(event.start) < new Date();

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.08)', transform: hovered ? 'translateY(-3px)' : 'none', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 160, background: event.imageURL ? 'transparent' : `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`, overflow: 'hidden' }}>
        {event.imageURL
          ? <img src={event.imageURL} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>📅</span>
            </div>
        }
        {isPast && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Past
          </span>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: NAVY, borderRadius: 6, padding: '4px 8px', textAlign: 'center', minWidth: 42 }}>
          <div style={{ color: GOLD, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>{month}</div>
          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{day}</div>
        </div>
      </div>
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 8px', color: NAVY, fontSize: '1rem', fontWeight: 700, lineHeight: 1.4 }}>{event.title}</h3>
        <p style={{ margin: 0, color: '#777', fontSize: '0.8rem' }}>
          {new Date(event.start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <span style={{ color: BLUE, fontSize: '0.82rem', fontWeight: 600 }}>View details →</span>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { user } = useAuth();
  const [future, setFuture] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/v0/events')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setFuture(data.future || []); setPast(data.past || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const displayed = tab === 'upcoming' ? future : past;

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: BLUE, width: 48, height: 48 }} />
        <p style={{ color: '#666', marginTop: 16 }}>Loading events…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ color: '#c0392b' }}>Failed to load events: {error}</p>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            ENACT Events
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto' }}>
            Workshops, panels, and networking opportunities across the ENACT network.
          </p>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 124, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
          {['upcoming', 'past'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '16px 28px', border: 'none', borderBottom: tab === t ? `3px solid ${BLUE}` : '3px solid transparent', background: 'none', color: tab === t ? BLUE : '#666', fontWeight: tab === t ? 700 : 400, fontSize: '0.95rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {t === 'upcoming' ? `Upcoming (${future.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Events grid */}
      <section style={{ background: '#f5f7fa', minHeight: '40vh', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📅</div>
              <p style={{ fontSize: '1.1rem' }}>
                {tab === 'upcoming' ? 'No upcoming events at this time.' : 'No past events found.'}
              </p>
              {tab === 'upcoming' && (
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Check back soon for upcoming ENACT events and workshops.</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {displayed.map(ev => (
                <EventCard key={ev._id} event={ev} onClick={() => setSelected(ev)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 900px) {
          .events-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .events-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Modal */}
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
