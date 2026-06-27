import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

const NOTIFICATIONS = [
  {
    badge: 'OPPORTUNITY',
    message: 'Faculty Fellowship applications are now open',
    cta: { label: 'Apply →', href: 'https://www.brandeis.edu/enact/grants-fellowships/index.html', external: true },
  },
  {
    badge: 'OPPORTUNITY',
    message: 'Know a great educator? Nominate a Faculty Fellow candidate',
    cta: { label: 'Nominate →', href: 'mailto:ENACT@brandeis.edu', external: false },
  },
  {
    badge: 'NEWS',
    message: 'Explore the latest ENACT news and program updates',
    cta: { label: 'Read more →', href: 'https://www.brandeis.edu/enact/news-updates/index.html', external: true },
  },
  {
    badge: 'EVENTS',
    message: 'View upcoming ENACT events and workshops',
    cta: { label: 'View events →', href: '/app/events', external: false },
  },
];

function NotificationCarousel({ onDismiss }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState('left'); // direction of incoming slide
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  const advance = useCallback((nextIdx, direction) => {
    setDir(direction);
    setIdx(nextIdx);
    setAnimKey(k => k + 1);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx(i => { const n = (i + 1) % NOTIFICATIONS.length; return n; });
      setDir('left');
      setAnimKey(k => k + 1);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const prev = () => {
    advance((idx - 1 + NOTIFICATIONS.length) % NOTIFICATIONS.length, 'right');
    resetTimer();
  };
  const next = () => {
    advance((idx + 1) % NOTIFICATIONS.length, 'left');
    resetTimer();
  };
  const goTo = (i) => {
    advance(i, i > idx ? 'left' : 'right');
    resetTimer();
  };

  const n = NOTIFICATIONS[idx];
  const animName = dir === 'left' ? 'slideInLeft' : 'slideInRight';

  return (
    <div style={{ background: '#08152a', display: 'flex', alignItems: 'center', height: 44, userSelect: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Prev arrow */}
      <button onClick={prev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
        ‹
      </button>

      {/* Sliding content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div key={animKey} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: `${animName} 0.35s ease` }}>
          <span style={{ background: GOLD, color: '#1a1100', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2, flexShrink: 0 }}>
            {n.badge}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            {n.message}
          </span>
          <a
            href={n.cta.href}
            target={n.cta.external ? '_blank' : undefined}
            rel={n.cta.external ? 'noreferrer' : undefined}
            style={{ color: GOLD, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', flexShrink: 0 }}
          >
            {n.cta.label}
          </a>
        </div>
      </div>

      {/* Next arrow */}
      <button onClick={next} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
        ›
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 4 }}>
        {NOTIFICATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{ width: i === idx ? 18 : 6, height: 6, background: i === idx ? GOLD : 'rgba(255,255,255,0.3)', borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }}
          />
        ))}
      </div>

      {/* Close */}
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
        ×
      </button>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ResourceAccordion({ resources }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div>
      {resources.map((r, i) => (
        <div key={r._id || i} style={{ marginBottom: 8, border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{ width: '100%', padding: '16px 20px', background: openIdx === i ? NAVY : 'white', color: openIdx === i ? 'white' : NAVY, border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            <span>{r.name}</span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{openIdx === i ? '−' : '+'}</span>
          </button>
          {openIdx === i && (
            <div style={{ padding: '20px 24px', background: '#fafafa' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px', marginBottom: 16 }}>
                {r.description && <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}><strong>Description:</strong> {r.description}</p>}
                {r.state && <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}><strong>State:</strong> {r.state}</p>}
                {r.institution && <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}><strong>Institution:</strong> {r.institution}</p>}
                {r.ownerName && <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}><strong>Author:</strong> {r.ownerName}</p>}
                {r.tags && <p style={{ margin: 0, color: '#444', fontSize: '0.95rem' }}><strong>Topics:</strong> {Array.isArray(r.tags) ? r.tags.join(', ') : r.tags}</p>}
              </div>
              <a href={r.uri} target="_blank" rel="noreferrer" style={{ background: BLUE, color: 'white', padding: '8px 20px', borderRadius: 4, textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                Download Resource
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EventAccordion({ events, loggedIn }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div>
      {events.map((ev, i) => {
        const showFull = loggedIn || ev.visibility === 'public';
        const desc = showFull ? ev.description : (String(ev.description || '').split('.')[0] + '...');
        return (
          <div key={ev._id || i} style={{ marginBottom: 8, border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: '100%', padding: '16px 20px', background: openIdx === i ? NAVY : 'white', color: openIdx === i ? 'white' : NAVY, border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', gap: 12 }}
            >
              <span style={{ flex: 1 }}>{ev.title}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.8 }}>{new Date(ev.start).toLocaleDateString()}</span>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{openIdx === i ? '−' : '+'}</span>
            </button>
            {openIdx === i && (
              <div style={{ padding: '20px 24px', background: '#fafafa', display: 'flex', gap: 20 }}>
                {ev.imageURL && (
                  <img src={ev.imageURL} alt={ev.title} style={{ width: 110, height: 75, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ margin: '0 0 12px', color: '#444', lineHeight: 1.65, fontSize: '0.95rem' }}>{desc}</p>
                  {showFull && ev.uri ? (
                    <a href={ev.uri} target="_blank" rel="noreferrer" style={{ color: BLUE, fontWeight: 500, fontSize: '0.9rem' }}>View Event →</a>
                  ) : !loggedIn ? (
                    <a href="/app/login" style={{ color: GOLD, fontWeight: 500, fontSize: '0.9rem' }}>Log in to see full details →</a>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef(null);
  const eventsRef = useRef(null);
  const resourcesRef = useRef(null);

  const loggedIn = user?.loggedIn;
  const status = user?.status;

  useEffect(() => {
    fetch('/api/v0/home-data')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ resources: [], events: [], imagePaths: [], labelPaths: [], cookieDismissed: false }));
  }, []);

  useEffect(() => {
    if (data?.cookieDismissed) setDismissed(true);
  }, [data]);

  function handleDismiss() {
    setDismissed(true);
    document.cookie = `notificationDismissed=true; path=/; max-age=${60 * 60 * 24 * 30}`;
  }

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const { resources = [], events = [] } = data || {};

  const audienceCards = [
    {
      number: '01', title: 'Students & Alumni',
      description: 'Search student work, and network with the national community of ENACT students and alumni.',
      linkText: 'Log in to the network', linkHref: loggedIn ? '/search/' : '/app/login'
    },
    {
      number: '02', title: 'Faculty Fellows',
      description: 'Access ENACT teaching resources, syllabi, and student work to bring civic engagement into your classroom.',
      linkText: 'Explore teaching resources', linkHref: '/search/'
    },
    {
      number: '03', title: 'The Public',
      description: 'Read student work on bills from across the U.S. — op-eds, issue research, testimony, and more.',
      linkText: 'Browse public resources', linkHref: '/search/'
    }
  ];

  const quickNavItems = [
    { label: 'Search Resources', href: '/search/' },
    { label: 'Get Started', href: loggedIn ? '/search/' : '/app/login' },
    { label: 'Upcoming Events', href: '#', onClick: (e) => { e.preventDefault(); scrollTo(eventsRef); } },
    { label: 'Intro Video', href: '#', onClick: (e) => { e.preventDefault(); scrollTo(videoRef); } },
    { label: 'News & Updates', href: 'https://www.brandeis.edu/enact/news-updates/index.html', external: true }
  ];

  return (
    <div>
      {/* Rotating notification carousel */}
      {!dismissed && <NotificationCarousel onDismiss={handleDismiss} />}

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #060f1e 0%, #0f2444 65%, #0053a4 100%)', padding: 'clamp(60px,10vw,110px) 0 clamp(60px,9vw,90px)', position: 'relative' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 30, height: 1, background: GOLD, flexShrink: 0 }} />
            A NATIONAL, NON-PARTISAN PROGRAM AT BRANDEIS UNIVERSITY
          </p>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5.5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.14, marginBottom: 24 }}>
            Students turning conviction into{' '}
            <em style={{ color: GOLD, fontStyle: 'italic' }}>legislation.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: 520, marginBottom: 44, lineHeight: 1.7 }}>
            ENACT engages undergraduates at colleges and universities across the country in real, state-level legislative change —
            bridging the classroom and the statehouse.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href={loggedIn ? '/search/' : '/app/login'}
              style={{ background: GOLD, color: '#1a1100', padding: '14px 28px', borderRadius: 4, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
              Get started →
            </a>
            <button onClick={() => scrollTo(videoRef)}
              style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '13px 26px', borderRadius: 4, fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
              Watch the intro film
            </button>
          </div>
        </div>
      </section>

      {/* Quick nav bar */}
      <nav style={{ background: '#08152a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {quickNavItems.map((item, i) => (
            <a key={item.label}
              href={item.href}
              onClick={item.onClick}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className="hp-qnav-item"
              style={{ color: 'rgba(255,255,255,0.8)', flex: '1 1 auto', minWidth: 160, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRight: i < quickNavItems.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <span>{item.label}</span>
              <span style={{ color: GOLD, marginLeft: 10 }}>→</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Who We Are */}
      <section style={{ background: 'white', padding: 'clamp(48px,8vw,80px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <div className="hp-who-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,5vw,72px)', marginBottom: 52, alignItems: 'start' }}>
            <div>
              <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>WHO WE ARE</p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.1rem)', fontWeight: 700, color: NAVY, lineHeight: 1.3, margin: 0 }}>
                The Abraham Feinberg Educational Network for Active Civic Transformation.
              </h2>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#4a4a4a', paddingTop: 'clamp(0px,3vw,36px)', margin: 0 }}>
              ENACT is a national, non-partisan program based at{' '}
              <a href="https://www.brandeis.edu" target="_blank" rel="noreferrer" style={{ color: BLUE }}>Brandeis University</a>.
              Through a signature course and a connected network, students research live legislation, draft testimony and
              op-eds, and work directly with lawmakers on the issues they care about most — gaining the skills and confidence
              to stay civically engaged for life.
            </p>
          </div>

          <div className="hp-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {audienceCards.map(card => (
              <div key={card.number} style={{ border: '1px solid #e8e4de', borderTop: `3px solid ${GOLD}`, borderRadius: 4, padding: '28px 24px', background: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: GOLD, fontSize: '0.75rem', fontWeight: 700, marginBottom: 10, letterSpacing: '0.05em' }}>{card.number}</div>
                <h3 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>{card.title}</h3>
                <p style={{ color: '#555', lineHeight: 1.65, marginBottom: 'auto', paddingBottom: 20, fontSize: '0.95rem' }}>{card.description}</p>
                <a href={card.linkHref} style={{ color: BLUE, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                  {card.linkText} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: NAVY, padding: 'clamp(48px,7vw,72px) 0' }}>
        <div className="hp-stats-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'clamp(24px,4vw,48px)', alignItems: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.35, margin: 0 }}>
            A measurable shift in<br />civic life.
          </h2>
          {[{ value: '30+', label: 'partner campuses' }, { value: '1,000+', label: 'undergraduates engaged' }, { value: '25+', label: 'states reached' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: GOLD, fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Expandable Resources */}
      {data && (
        <section ref={resourcesRef} style={{ background: '#f8f7f2', padding: 'clamp(48px,7vw,72px) 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ color: NAVY, fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Public Resources</h2>
              <a href="/search/" style={{ color: BLUE, fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem' }}>Browse all resources →</a>
            </div>
            {resources.length > 0 ? (
              <ResourceAccordion resources={resources} />
            ) : (
              <p style={{ color: '#666' }}>No resources available yet.</p>
            )}
            {status === 'admin' && (
              <div style={{ marginTop: 16 }}>
                <a href="/resources/manage/public" style={{ color: BLUE, fontWeight: 500, fontSize: '0.9rem' }}>Manage Displayed Resources →</a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Expandable Events */}
      {data && (
        <section ref={eventsRef} style={{ background: 'white', padding: 'clamp(48px,7vw,72px) 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ color: NAVY, fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Events</h2>
              <a href="/app/events" style={{ color: BLUE, fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem' }}>View all events →</a>
            </div>
            {events.length > 0 ? (
              <EventAccordion events={events} loggedIn={loggedIn} />
            ) : (
              <p style={{ color: '#666' }}>
                No upcoming events at this time.{' '}
                <a href="https://www.brandeis.edu/enact/news-events/index.html" target="_blank" rel="noreferrer" style={{ color: BLUE }}>
                  Check the ENACT events page ↗
                </a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Intro Videos */}
      <section ref={videoRef} style={{ background: 'linear-gradient(135deg, #060f1e 0%, #0f2444 65%, #0053a4 100%)', padding: 'clamp(48px,7vw,72px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, marginBottom: 36, textAlign: 'center' }}>Intro Videos</h2>
          <div className="hp-video-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h5 style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12, textAlign: 'center' }}>What is ENACT?</h5>
              <video style={{ width: '100%', borderRadius: 6 }} controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Updated+Video+2.mp4" type="video/mp4" />
              </video>
            </div>
            <div>
              <h5 style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12, textAlign: 'center' }}>A Brief Tour of enactnetwork.org</h5>
              <video style={{ width: '100%', borderRadius: 6 }} poster="/images/introVideo.webp" controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hp-who-grid { grid-template-columns: 1fr !important; }
          .hp-cards-grid { grid-template-columns: 1fr !important; }
          .hp-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hp-video-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .hp-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
