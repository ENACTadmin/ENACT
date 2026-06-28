import React, { useEffect, useState } from 'react';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

function ProfileCard({ profile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.07)', transform: hovered ? 'translateY(-3px)' : 'none', transition: 'all 0.2s ease', cursor: 'default' }}>
      <div style={{ padding: '24px 20px 20px', textAlign: 'center' }}>
        <img src={profile.profilePicURL || '/images/defaultProfile.webp'} alt={profile.userName}
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${hovered ? GOLD : '#e8e8e8'}`, transition: 'border-color 0.2s', marginBottom: 12 }} />
        <h3 style={{ margin: '0 0 4px', color: NAVY, fontSize: '0.95rem', fontWeight: 700 }}>{profile.userName}</h3>
        {profile.affiliation && (
          <p style={{ margin: '0 0 2px', color: '#666', fontSize: '0.8rem' }}>{profile.affiliation}</p>
        )}
        {profile.department && (
          <p style={{ margin: '0 0 2px', color: '#888', fontSize: '0.75rem' }}>{profile.department}</p>
        )}
        {profile.state && (
          <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: '0.75rem' }}>{profile.state}</p>
        )}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/profile/view/${profile._id}`}
            style={{ background: BLUE, color: '#fff', padding: '5px 12px', borderRadius: 4, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
            Profile
          </a>
          {profile.linkedInURL && (
            <a href={profile.linkedInURL} target="_blank" rel="noopener noreferrer"
              style={{ background: '#f0f4ff', color: BLUE, padding: '5px 12px', borderRadius: 4, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
              LinkedIn ↗
            </a>
          )}
          {profile.personalWebsiteURL && (
            <a href={profile.personalWebsiteURL} target="_blank" rel="noopener noreferrer"
              style={{ background: '#f5f5f5', color: '#555', padding: '5px 12px', borderRadius: 4, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
              Website ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FacultyListPage() {
  const [staff, setStaff] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v0/faculty-list')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setStaff(data.staff || []); setFaculty(data.faculty || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase();
  const filteredFaculty = faculty.filter(p =>
    !q || p.userName?.toLowerCase().includes(q) || p.affiliation?.toLowerCase().includes(q) ||
    p.state?.toLowerCase().includes(q) || p.department?.toLowerCase().includes(q)
  );

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: BLUE, width: 48, height: 48 }} />
        <p style={{ color: '#666', marginTop: 16 }}>Loading faculty…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ color: '#c0392b' }}>Failed to load faculty: {error}</p>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Faculty Fellows
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 540, margin: '0 auto' }}>
            Educators from colleges and universities across the country driving civic engagement through ENACT.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#f5f7fa', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* ENACT Staff */}
          {staff.length > 0 && (
            <div style={{ marginBottom: 56 }}>
              <h2 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 4, height: 20, background: GOLD, borderRadius: 2 }} />
                ENACT Staff
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                {staff.map(p => <ProfileCard key={p._id} profile={p} />)}
              </div>
            </div>
          )}

          {/* Faculty Fellows */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
              <h2 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 4, height: 20, background: GOLD, borderRadius: 2 }} />
                Faculty Fellows
                <span style={{ background: '#f0f4ff', color: BLUE, fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>
                  {filteredFaculty.length}
                </span>
              </h2>
              <input type="text" placeholder="Search by name, institution, or state…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '9px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.88rem', minWidth: 280, background: '#fff', outline: 'none' }} />
            </div>

            {filteredFaculty.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <p style={{ fontSize: '1rem' }}>No faculty match your search.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                {filteredFaculty.map(p => <ProfileCard key={p._id} profile={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .faculty-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .faculty-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .faculty-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
