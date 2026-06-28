import React from 'react';
import { Link } from 'react-router-dom';

const GOLD = '#c49422';
const DARK = '#060f1e';

const COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { label: 'About ENACT', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Help Center', to: '/help' },
      { label: 'Account Help', to: '/accountHelp' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Search Resources', to: '/search' },
      { label: 'Faculty Research', href: '/resources/view/facultyResearch' },
      { label: 'In the News', href: '/resources/view/inTheNews' },
    ],
  },
  {
    heading: 'Network',
    links: [
      { label: 'Faculty Fellows', to: '/profiles/view/faculty' },
      { label: 'Course Schedule', to: '/courses/schedule' },
      { label: 'Events', to: '/events' },
    ],
  },
  {
    heading: 'ENACT Program',
    external: true,
    links: [
      { label: 'ENACT National Site ↗', href: 'https://www.brandeis.edu/ethics/enact/index.html' },
      { label: 'Ethics Center ↗', href: 'https://www.brandeis.edu/ethics/' },
      { label: 'Faculty Fellowship ↗', href: 'https://www.brandeis.edu/enact/grants-fellowships/index.html' },
      { label: 'ENACT Schools ↗', href: 'https://www.brandeis.edu/ethics/ENACT/ENACTschools.html' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'ENACT@brandeis.edu ↗', href: 'mailto:ENACT@brandeis.edu' },
      { label: 'News & Updates ↗', href: 'https://www.brandeis.edu/enact/news-updates/index.html', external: true },
      { label: '@ENACTnational ↗', href: 'https://twitter.com/enactnational', external: true },
      { label: 'Brandeis University ↗', href: 'https://www.brandeis.edu', external: true },
    ],
  },
];

function FooterLink({ link }) {
  const style = {
    color: 'rgba(255,255,255,0.62)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    lineHeight: 1,
    transition: 'color 0.15s',
    display: 'block',
  };

  const hoverOn = e => { e.currentTarget.style.color = 'white'; };
  const hoverOff = e => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; };

  if (link.to) {
    return (
      <Link to={link.to} style={style} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      style={style}
      target={link.external || link.href?.startsWith('http') ? '_blank' : undefined}
      rel={link.external || link.href?.startsWith('http') ? 'noreferrer' : undefined}
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
    >
      {link.label}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: DARK, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Mega-menu columns */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,64px) clamp(20px,5vw,60px)' }}>
        <div className="footer-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'clamp(24px,3vw,48px)' }}>
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <h6 style={{ color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.18em', marginBottom: 16, fontWeight: 600 }}>
                {col.heading}
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(link => <FooterLink key={link.label} link={link} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px clamp(20px,5vw,60px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/enact-logo.webp" alt="ENACT" style={{ width: 32, height: 32 }} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>ENACT</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', letterSpacing: '0.03em' }}>The Abraham Feinberg Educational Network for Active Civic Transformation</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="mailto:ENACT@brandeis.edu" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'none' }}>
              ENACT@brandeis.edu
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Brandeis University, Waltham MA</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>© {year} ENACT Program</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-col-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .footer-col-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}
