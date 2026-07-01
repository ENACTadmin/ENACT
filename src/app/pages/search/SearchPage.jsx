import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';
const LIGHT_BG = '#f5f7fa';

// ── Helpers ────────────────────────────────────────────────────────────────────

function sortUnique(arr) {
  return [...new Set((arr || []).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

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

  const tags = Array.isArray(resource.tags) ? resource.tags : [];

  return (
    <div ref={ref} onClick={e => e.target === ref.current && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 660, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        {/* Header strip */}
        <div style={{ background: `linear-gradient(120deg, ${NAVY} 0%, ${BLUE} 100%)`, padding: '28px 32px 24px', borderRadius: '12px 12px 0 0' }}>
          <button onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
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
          {/* Meta row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 20 }}>
            {resource.authorName && <Meta label="Author" value={resource.authorName} />}
            {resource.institution && <Meta label="Institution" value={resource.institution} />}
            {resource.state && <Meta label="State" value={resource.state} />}
            {resource.yearOfCreation && <Meta label="Year" value={resource.yearOfCreation} />}
            {resource.courseName && <Meta label="Course" value={resource.courseName} />}
            {resource.resourceType && <Meta label="Type" value={resource.resourceType} />}
          </div>

          {resource.description && (
            <p style={{ color: '#444', lineHeight: 1.75, marginBottom: 20, fontSize: '0.95rem' }}>{resource.description}</p>
          )}

          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              {tags.map(t => (
                <span key={t} style={{ background: tagColor(t), color: NAVY, fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {resource.uri && (
            <a href={resource.uri} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: BLUE, color: '#fff', padding: '11px 28px', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
              View / Download Resource ↗
            </a>
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
  const tags = Array.isArray(resource.tags) ? resource.tags.slice(0, 3) : [];

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', borderRadius: 10, border: `1px solid ${hovered ? '#c8d8ff' : '#e8e8e8'}`, padding: '20px 22px', cursor: 'pointer', boxShadow: hovered ? '0 6px 20px rgba(0,83,164,0.12)' : '0 1px 4px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'all 0.18s ease', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Top badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {resource.contentType && (
          <span style={{ background: '#e3ecff', color: BLUE, fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {resource.contentType}
          </span>
        )}
        {resource.mediaType && (
          <span style={{ background: '#f5f5f5', color: '#666', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
            {resource.mediaType}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{ margin: 0, color: NAVY, fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{resource.name}</h3>

      {/* Description preview */}
      {resource.description && (
        <p style={{ margin: 0, color: '#666', fontSize: '0.82rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.description}
        </p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.78rem', color: '#888' }}>
        {resource.authorName && <span>👤 {resource.authorName}</span>}
        {resource.institution && <span>🏛 {resource.institution}</span>}
        {resource.state && <span>📍 {resource.state}</span>}
        {resource.yearOfCreation && <span>📅 {resource.yearOfCreation}</span>}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
          {tags.map(t => (
            <span key={t} style={{ background: tagColor(t), color: NAVY, fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
              {t}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span style={{ color: '#aaa', fontSize: '0.7rem', padding: '3px 0' }}>+{resource.tags.length - 3} more</span>
          )}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        <span style={{ color: BLUE, fontSize: '0.78rem', fontWeight: 600 }}>View details →</span>
      </div>
    </div>
  );
}

// ── Filter sidebar ─────────────────────────────────────────────────────────────

function FilterSection({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(true);
  if (!options.length) return null;
  return (
    <div style={{ borderBottom: '1px solid #eee', paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(x => !x)}
        style={{ background: 'none', border: 'none', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: 0, marginBottom: open ? 10 : 0 }}>
        <span style={{ color: NAVY, fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
          {options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: selected.has(opt) ? BLUE : '#555' }}>
              <input type="checkbox" checked={selected.has(opt)} onChange={() => onChange(opt)}
                style={{ accentColor: BLUE, width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ lineHeight: 1.3 }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Active filter chips ────────────────────────────────────────────────────────

function ActiveFilters({ filters, onRemove, onClearAll }) {
  const chips = [];
  for (const [dim, set] of Object.entries(filters)) {
    for (const val of set) chips.push({ dim, val });
  }
  if (!chips.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, alignItems: 'center' }}>
      <span style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600 }}>Filters:</span>
      {chips.map(({ dim, val }) => (
        <span key={`${dim}:${val}`}
          style={{ background: '#e3ecff', color: BLUE, fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px 4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          {val}
          <button onClick={() => onRemove(dim, val)}
            style={{ background: 'none', border: 'none', color: BLUE, cursor: 'pointer', padding: 0, fontSize: '0.85rem', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
            ×
          </button>
        </span>
      ))}
      <button onClick={onClearAll}
        style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
        Clear all
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const FILTER_DIMS = [
  { key: 'contentType', label: 'Content Type', field: 'contentType' },
  { key: 'mediaType',   label: 'Media Type',   field: 'mediaType' },
  { key: 'state',       label: 'State',         field: 'state' },
  { key: 'year',        label: 'Year',          field: 'yearOfCreation' },
];

const POPULAR_TAGS = ['Op-Ed', 'Lobbying', 'Policy', 'Legislation', 'Criminal Justice', 'Education', 'Environment', 'Healthcare', 'Housing'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [sets, setSets] = useState({ contentTypes: [], mediaTypes: [], institutions: [], years: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selected, setModal] = useState(null);
  const [filters, setFilters] = useState({ contentType: new Set(), mediaType: new Set(), state: new Set(), year: new Set() });
  const inputRef = useRef(null);

  // Load filter sets once
  useEffect(() => {
    fetch('/api/v0/resources/sets')
      .then(r => r.json())
      .then(data => setSets(data))
      .catch(() => {});
  }, []);

  // Run search when query changes
  useEffect(() => {
    if (!query.trim()) { setResults([]); setHasSearched(false); return; }
    setLoading(true);
    setHasSearched(true);
    fetch(`/api/v0/resources/searchByKeyword?searchString=${encodeURIComponent(query.trim())}`)
      .then(r => r.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  // Sync query param
  useEffect(() => {
    if (query.trim()) setSearchParams({ q: query.trim() }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  const handleSearch = useCallback(e => {
    e.preventDefault();
    setFilters({ contentType: new Set(), mediaType: new Set(), state: new Set(), year: new Set() });
    setQuery(inputVal);
  }, [inputVal]);

  const toggleFilter = useCallback((dim, val) => {
    setFilters(prev => {
      const next = { ...prev, [dim]: new Set(prev[dim]) };
      next[dim].has(val) ? next[dim].delete(val) : next[dim].add(val);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ contentType: new Set(), mediaType: new Set(), state: new Set(), year: new Set() });
  }, []);

  // Client-side filtering
  const filtered = results.filter(r => {
    if (filters.contentType.size && !filters.contentType.has(r.contentType)) return false;
    if (filters.mediaType.size && !filters.mediaType.has(r.mediaType)) return false;
    if (filters.state.size && !filters.state.has(r.state)) return false;
    if (filters.year.size && !filters.year.has(r.yearOfCreation)) return false;
    return true;
  });

  // Build filter options from results (dynamic based on what's in results)
  const optFor = field => sortUnique(results.map(r => r[field === 'year' ? 'yearOfCreation' : field]));

  const hasActiveFilters = Object.values(filters).some(s => s.size > 0);

  return (
    <>
      {/* Hero with search bar */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '60px 24px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 16 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Search Resources
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 28px' }}>
            Explore publicly available resources created by ENACT students across the United States.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, maxWidth: 620, margin: '0 auto', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <input ref={inputRef} type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search by keyword, topic, author, institution…"
              style={{ flex: 1, padding: '14px 20px', border: 'none', fontSize: '1rem', outline: 'none', background: '#fff' }} />
            <button type="submit"
              style={{ padding: '14px 28px', background: GOLD, border: 'none', color: '#1a1100', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s' }}>
              Search
            </button>
          </form>

          {/* Popular tags */}
          {!hasSearched && (
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', alignSelf: 'center' }}>Try:</span>
              {POPULAR_TAGS.map(t => (
                <button key={t} onClick={() => { setInputVal(t); setQuery(t); setFilters({ contentType: new Set(), mediaType: new Set(), state: new Set(), year: new Set() }); }}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: '5px 12px', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results + sidebar */}
      <section style={{ background: LIGHT_BG, padding: '36px 24px 80px', minHeight: '50vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>

          {/* Sidebar filters */}
          <aside style={{ background: '#fff', borderRadius: 10, padding: '20px 18px', border: '1px solid #e8e8e8', position: 'sticky', top: 140 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, color: NAVY, fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</h2>
              {hasActiveFilters && (
                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: BLUE, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                  Clear all
                </button>
              )}
            </div>

            {!hasSearched ? (
              <p style={{ color: '#bbb', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>Search first to see filter options.</p>
            ) : (
              <>
                <FilterSection
                  label="Content Type"
                  options={optFor('contentType')}
                  selected={filters.contentType}
                  onChange={v => toggleFilter('contentType', v)}
                />
                <FilterSection
                  label="Media Type"
                  options={optFor('mediaType')}
                  selected={filters.mediaType}
                  onChange={v => toggleFilter('mediaType', v)}
                />
                <FilterSection
                  label="State"
                  options={optFor('state')}
                  selected={filters.state}
                  onChange={v => toggleFilter('state', v)}
                />
                <FilterSection
                  label="Year"
                  options={optFor('year')}
                  selected={filters.year}
                  onChange={v => toggleFilter('year', v)}
                />
              </>
            )}
          </aside>

          {/* Results area */}
          <div>
            {/* Status bar */}
            {hasSearched && !loading && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: '#555', fontSize: '0.88rem' }}>
                  {filtered.length === 0
                    ? 'No results'
                    : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}${hasActiveFilters ? ' (filtered)' : ''}`}
                  {query && <> for <strong>"{query}"</strong></>}
                </span>
              </div>
            )}

            {/* Active filter chips */}
            <ActiveFilters filters={filters} onRemove={toggleFilter} onClearAll={clearAll} />

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div className="spinner-border" style={{ color: BLUE, width: 44, height: 44 }} />
                <p style={{ color: '#888', marginTop: 14, fontSize: '0.9rem' }}>Searching…</p>
              </div>
            )}

            {/* Empty states */}
            {!loading && !hasSearched && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#bbb' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🔍</div>
                <p style={{ fontSize: '1.05rem', color: '#888' }}>Enter a keyword above to search resources.</p>
              </div>
            )}

            {!loading && hasSearched && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>📭</div>
                <p style={{ color: '#888', fontSize: '1rem', marginBottom: 8 }}>
                  {hasActiveFilters ? 'No results match the selected filters.' : `No resources found for "${query}".`}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearAll}
                    style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Results grid */}
            {!loading && filtered.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {filtered.map(r => (
                  <ResourceCard key={r._id} resource={r} onClick={() => setModal(r)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .search-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Modal */}
      {selected && <ResourceModal resource={selected} onClose={() => setModal(null)} />}
    </>
  );
}
