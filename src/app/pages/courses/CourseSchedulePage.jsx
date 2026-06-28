import React, { useEffect, useState } from 'react';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

const DAY_ABBR = { Monday: 'M', Tuesday: 'T', Wednesday: 'W', Thursday: 'Th', Friday: 'F', Saturday: 'Sa', Sunday: 'Su' };
const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function toLocalTime(timezone, time) {
  try {
    const base = new Date();
    const [h, m] = time.split(':').map(Number);
    base.setHours(h, m, 0, 0);
    const courseStr = base.toLocaleString('en-US', { timeZone: timezone });
    const diff = base.getTime() - new Date(courseStr).getTime();
    return new Date(base.getTime() + diff).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return time;
  }
}

function CourseCard({ course, courseTimes }) {
  const [expanded, setExpanded] = useState(false);
  const times = courseTimes.filter(ct => String(ct.courseId) === String(course._id));
  const byDay = {};
  times.forEach(ct => {
    if (!byDay[ct.day]) byDay[ct.day] = [];
    byDay[ct.day].push(ct);
  });
  const activeDays = DAYS_ORDER.filter(d => byDay[d]);

  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ minWidth: 48, height: 48, background: NAVY, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: GOLD, fontSize: '1.2rem' }}>📚</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 4px', color: NAVY, fontSize: '1rem', fontWeight: 700 }}>{course.courseName}</h3>
          <p style={{ margin: '0 0 8px', color: '#555', fontSize: '0.88rem' }}>
            {course.instructor && <span>{course.instructor}</span>}
            {course.institution && <span style={{ color: '#999' }}> · {course.institution}</span>}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ background: '#f0f4ff', color: BLUE, fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
              {course.semester} {course.year}
            </span>
            {course.state && (
              <span style={{ background: '#f5f5f5', color: '#555', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 3 }}>
                {course.state}
              </span>
            )}
            {(course.asynchronous || course.undecided) && (
              <span style={{ background: '#fff8e6', color: '#8a6000', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 3 }}>
                {course.asynchronous ? 'Asynchronous' : 'TBD'}
              </span>
            )}
          </div>
        </div>
        {activeDays.length > 0 && (
          <button onClick={() => setExpanded(x => !x)}
            style={{ background: 'none', border: `1px solid ${BLUE}`, color: BLUE, borderRadius: 6, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {expanded ? 'Hide times' : 'Show times'}
          </button>
        )}
      </div>

      {/* Day pills always visible */}
      {activeDays.length > 0 && (
        <div style={{ padding: '0 22px 14px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DAYS_ORDER.map(d => (
            <span key={d} style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: byDay[d] ? BLUE : '#f0f0f0', color: byDay[d] ? '#fff' : '#bbb',
              fontSize: '0.72rem', fontWeight: 700
            }}>
              {DAY_ABBR[d]}
            </span>
          ))}
        </div>
      )}

      {/* Expanded time details */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 22px 18px', background: '#fafafa' }}>
          {activeDays.map(d => (
            <div key={d} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ minWidth: 80, color: '#555', fontSize: '0.85rem', fontWeight: 600 }}>{d}</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {byDay[d].map((ct, i) => (
                  <span key={i} style={{ background: '#fff', border: `1px solid ${BLUE}`, color: BLUE, fontSize: '0.8rem', padding: '3px 10px', borderRadius: 20 }}>
                    {toLocalTime(course.timezone, ct.startTime)} – {toLocalTime(course.timezone, ct.endTime)}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {course.institutionURL && (
            <a href={course.institutionURL} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 10, color: BLUE, fontSize: '0.82rem', fontWeight: 600 }}>
              Course website ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseSchedulePage() {
  const [courses, setCourses] = useState([]);
  const [courseTimes, setCourseTimes] = useState([]);
  const [userTz, setUserTz] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    fetch('/api/v0/courses/schedule')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setCourses(data.courses || []); setCourseTimes(data.courseTimes || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const syncCourses = courses.filter(c => !c.asynchronous && !c.undecided);
  const asyncCourses = courses.filter(c => c.asynchronous || c.undecided);

  const q = search.toLowerCase();
  const filteredSync = syncCourses.filter(c =>
    !q || c.courseName?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q) || c.state?.toLowerCase().includes(q) || c.institution?.toLowerCase().includes(q)
  );
  const filteredAsync = asyncCourses.filter(c =>
    !q || c.courseName?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q) || c.state?.toLowerCase().includes(q) || c.institution?.toLowerCase().includes(q)
  );

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: BLUE, width: 48, height: 48 }} />
        <p style={{ color: '#666', marginTop: 16 }}>Loading course schedule…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ color: '#c0392b' }}>Failed to load schedule: {error}</p>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Course Schedule
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginTop: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: GOLD, fontSize: '2rem', fontWeight: 800 }}>{courses.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>courses in session</div>
            </div>
            {userTz && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{userTz}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>your timezone (times adjusted)</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search + content */}
      <section style={{ background: '#f5f7fa', padding: '48px 24px 80px', minHeight: '40vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Search */}
          <div style={{ marginBottom: 36, display: 'flex', gap: 12, alignItems: 'center', maxWidth: 480 }}>
            <input type="text" placeholder="Search by course, instructor, or state…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#fff' }} />
          </div>

          {/* Sync courses */}
          {filteredSync.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 4, height: 20, background: GOLD, borderRadius: 2 }} />
                Scheduled Courses
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {filteredSync.map(c => (
                  <CourseCard key={c._id} course={c} courseTimes={courseTimes} />
                ))}
              </div>
            </div>
          )}

          {/* Async courses */}
          {filteredAsync.length > 0 && (
            <div>
              <h2 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 4, height: 20, background: GOLD, borderRadius: 2 }} />
                Asynchronous &amp; TBD Courses
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {filteredAsync.map(c => (
                  <CourseCard key={c._id} course={c} courseTimes={courseTimes} />
                ))}
              </div>
            </div>
          )}

          {filteredSync.length === 0 && filteredAsync.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📚</div>
              <p style={{ fontSize: '1.1rem' }}>{search ? 'No courses match your search.' : 'No courses scheduled this semester.'}</p>
            </div>
          )}

          <div style={{ marginTop: 48, textAlign: 'center', borderTop: '1px solid #e0e0e0', paddingTop: 32 }}>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>
              Looking for older courses?{' '}
              <a href="/courses/pastList" style={{ color: BLUE, fontWeight: 600 }}>Browse past course list →</a>
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
