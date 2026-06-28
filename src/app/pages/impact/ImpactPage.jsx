import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

function tagColor(tag) {
  const palette = ['#e3ecff', '#fef9e0', '#e8f8f0', '#fde8f3', '#ede8ff'];
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = tag.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

// ── Resource detail modal ──────────────────────────────────────────────────────

function ResourceModal({ resource, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  const tags = Array.isArray(resource.tags) ? resource.tags.filter(Boolean) : [];
  const isVideo = resource.mediaType === 'video' && resource.uri?.endsWith('.mp4');

  return (
    <div ref={ref} onClick={e => e.target === ref.current && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 680, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <div style={{ background: `linear-gradient(120deg, ${NAVY} 0%, ${BLUE} 100%)`, padding: '28px 32px 22px', borderRadius: '12px 12px 0 0' }}>
          <button onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {resource.contentType && (
              <span style={{ background: GOLD, color: '#1a1100', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {resource.contentType}
              </span>
            )}
            {resource.mediaType && (
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
                {resource.mediaType}
              </span>
            )}
          </div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>{resource.name}</h2>
        </div>

        <div style={{ padding: '24px 32px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 18 }}>
            {resource.authorName && <Meta label="Author" value={resource.authorName} />}
            {resource.institution && <Meta label="Institution" value={resource.institution} />}
            {resource.state && <Meta label="State" value={resource.state} />}
            {resource.yearOfCreation && <Meta label="Year" value={resource.yearOfCreation} />}
          </div>

          {resource.description && (
            <p style={{ color: '#444', lineHeight: 1.75, marginBottom: 20, fontSize: '0.95rem' }}>{resource.description}</p>
          )}

          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
              {tags.map(t => (
                <span key={t} style={{ background: tagColor(t), color: NAVY, fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {resource.uri && (
            isVideo ? (
              <video controls style={{ width: '100%', borderRadius: 8, maxHeight: 320 }}>
                <source src={resource.uri} type="video/mp4" />
              </video>
            ) : (
              <a href={resource.uri} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', background: BLUE, color: '#fff', padding: '11px 28px', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                View Resource ↗
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ color: '#aaa', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
      <div style={{ color: NAVY, fontSize: '0.88rem', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

// ── Resource card ──────────────────────────────────────────────────────────────

function ResourceCard({ resource, onClick }) {
  const [hovered, setHovered] = useState(false);
  const tags = Array.isArray(resource.tags) ? resource.tags.filter(Boolean).slice(0, 3) : [];
  const isVideo = resource.mediaType === 'video' && resource.uri?.endsWith('.mp4');

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', borderRadius: 10, border: `1px solid ${hovered ? '#c8d8ff' : '#e8e8e8'}`, padding: '20px 22px', cursor: 'pointer', boxShadow: hovered ? '0 6px 20px rgba(0,83,164,0.12)' : '0 1px 4px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'all 0.18s ease', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {resource.contentType && (
          <span style={{ background: '#e3ecff', color: BLUE, fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
            {resource.contentType}
          </span>
        )}
        {isVideo && (
          <span style={{ background: '#fff0f0', color: '#c0392b', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
            ▶ Video
          </span>
        )}
        {resource.yearOfCreation && (
          <span style={{ color: '#aaa', fontSize: '0.75rem', marginLeft: 'auto' }}>{resource.yearOfCreation}</span>
        )}
      </div>

      <h3 style={{ margin: 0, color: NAVY, fontSize: '0.97rem', fontWeight: 700, lineHeight: 1.4 }}>{resource.name}</h3>

      {resource.description && (
        <p style={{ margin: 0, color: '#666', fontSize: '0.82rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.78rem', color: '#888' }}>
        {resource.authorName && <span>👤 {resource.authorName}</span>}
        {resource.institution && <span>🏛 {resource.institution}</span>}
        {resource.state && <span>📍 {resource.state}</span>}
      </div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {tags.map(t => (
            <span key={t} style={{ background: tagColor(t), color: NAVY, fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        <span style={{ color: BLUE, fontSize: '0.78rem', fontWeight: 600 }}>View details →</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ImpactPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'news' ? 'news' : 'research');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v0/impact-resources')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchParams({ tab }, { replace: true });
  }, [tab, setSearchParams]);

  const items = tab === 'research'
    ? (data?.facultyResearch || [])
    : (data?.essayENACT || []);

  const q = search.toLowerCase();
  const filtered = items.filter(r =>
    !q || r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q) ||
    r.authorName?.toLowerCase().includes(q) || r.institution?.toLowerCase().includes(q)
  );

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', paddingBottom: 48 }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            ENACT Impact
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            Faculty research, student reflections, and news coverage of ENACT's impact across the country.
          </p>
        </div>

        {/* Tab bar inside hero */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              { key: 'research', label: 'Faculty Research', count: data?.facultyResearch?.length },
              { key: 'news',     label: 'In the News',      count: data?.essayENACT?.length },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }}
                style={{ padding: '14px 28px', border: 'none', borderBottom: tab === t.key ? `3px solid ${GOLD}` : '3px solid transparent', background: 'none', color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: tab === t.key ? 700 : 400, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.label}
                {t.count != null && (
                  <span style={{ background: tab === t.key ? GOLD : 'rgba(255,255,255,0.15)', color: tab === t.key ? '#1a1100' : 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#f5f7fa', padding: '40px 24px 80px', minHeight: '50vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div className="spinner-border" style={{ color: BLUE, width: 44, height: 44 }} />
              <p style={{ color: '#888', marginTop: 14 }}>Loading…</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#c0392b' }}>
              <p>Failed to load resources: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Search bar */}
              <div style={{ marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="text" placeholder={`Search ${tab === 'research' ? 'faculty research' : 'news & articles'}…`}
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, maxWidth: 420, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.9rem', background: '#fff', outline: 'none' }} />
                {search && (
                  <button onClick={() => setSearch('')}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Clear
                  </button>
                )}
                <span style={{ color: '#999', fontSize: '0.82rem' }}>
                  {filtered.length} item{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Results grid */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 14 }}>📄</div>
                  <p style={{ fontSize: '1rem' }}>
                    {search ? 'No results match your search.' : `No ${tab === 'research' ? 'faculty research' : 'news articles'} available yet.`}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                  {filtered.map(r => (
                    <ResourceCard key={r._id} resource={r} onClick={() => setSelected(r)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .impact-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 580px) { .impact-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {selected && <ResourceModal resource={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
