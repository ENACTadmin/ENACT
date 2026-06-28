import React, { useCallback, useEffect, useRef, useState } from 'react';

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

export default function NotificationCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState('left');
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
      setDir('left');
      setIdx(i => (i + 1) % NOTIFICATIONS.length);
      setAnimKey(k => k + 1);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const prev = () => { advance((idx - 1 + NOTIFICATIONS.length) % NOTIFICATIONS.length, 'right'); resetTimer(); };
  const next = () => { advance((idx + 1) % NOTIFICATIONS.length, 'left'); resetTimer(); };

  const n = NOTIFICATIONS[idx];
  const btnStyle = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' };

  return (
    <div style={{ background: '#060f1e', display: 'flex', alignItems: 'center', height: 44, userSelect: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <button style={btnStyle} onClick={prev}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>‹</button>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div key={animKey} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: `${dir === 'left' ? 'ncSlideInLeft' : 'ncSlideInRight'} 0.32s ease` }}>
          <span style={{ background: GOLD, color: '#1a1100', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 2, flexShrink: 0 }}>
            {n.badge}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{n.message}</span>
          <a href={n.cta.href} target={n.cta.external ? '_blank' : undefined} rel={n.cta.external ? 'noreferrer' : undefined}
            style={{ color: GOLD, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', flexShrink: 0 }}>
            {n.cta.label}
          </a>
        </div>
      </div>

      <button style={btnStyle} onClick={next}
        onMouseEnter={e => e.currentTarget.style.color = 'white'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>›</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 16 }}>
        {NOTIFICATIONS.map((_, i) => (
          <button key={i} onClick={() => { advance(i, i > idx ? 'left' : 'right'); resetTimer(); }}
            style={{ width: i === idx ? 18 : 6, height: 6, background: i === idx ? GOLD : 'rgba(255,255,255,0.3)', borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }} />
        ))}
      </div>

      <style>{`
        @keyframes ncSlideInLeft  { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ncSlideInRight { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
    </div>
  );
}
