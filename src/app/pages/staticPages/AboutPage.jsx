import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

// ── Static data ──────────────────────────────────────────────────────────────

const LEADERSHIP = [
  {
    photo: '/images/PhotoForAbout/stimell.webp',
    name: 'Melissa Stimell, JD',
    role: 'Director',
    title: 'Professor of the Practice',
    bio: 'Founder and director of ENACT, teaching legislative advocacy and guiding the national network from Brandeis University.',
  },
  {
    photo: '/images/PhotoForAbout/DavidWeinstein.webp',
    name: 'David J. Weinstein',
    role: 'Assistant Director',
    title: 'Communications, International Center for Ethics, Justice and Public Life',
    bio: 'David Weinstein manages ENACT communications and outreach, connecting faculty fellows and students across the national network.',
  },
  {
    photo: '/images/PhotoForAbout/JayKaufman.webp',
    name: 'Jay Kaufman',
    role: 'Distinguished Legislative Mentor',
    title: 'Former Massachusetts State Representative (1995–2018)',
    bio: 'Jay Kaufman brings decades of legislative experience to ENACT, mentoring students and faculty on effective civic engagement.',
  },
  {
    photo: '/images/PhotoForAbout/RobGlover.webp',
    name: 'Rob Glover',
    role: 'Fellow for Course Resources',
    title: 'Associate Professor of Political Science, University of Maine',
    bio: 'Rob Glover curates and develops course resources for ENACT faculty, drawing on his research in democratic theory and civic education.',
  },
];

const PLATFORM_STAFF = [
  { photo: '/images/PhotoForAbout/KiyaGedamu.webp', name: 'Kiya Gedamu', title: 'Software Engineer · 2026–Present', bio: 'Software Engineer on the ENACT digital platform team.' },
  { photo: '/images/PhotoForAbout/NayeliNaranjo.webp', name: 'Nayeli Naranjo', title: 'Software Engineer · 2026–Present', bio: 'Software Engineer on the ENACT digital platform team.' },
  { photo: '/images/PhotoForAbout/TimHickey.webp', name: 'Timothy J. Hickey', title: 'Technology Advisor · 2020–Present', bio: 'Professor and Chair of Computer Science at Brandeis University, advising the ENACT digital platform.' },
  { photo: '/images/PhotoForAbout/HanyuDu.webp', name: 'Hangyu Du', title: 'Software Developer · 2020–2021', bio: 'Core developer of the ENACT digital platform. Fan of machine learning and end-to-end UI development.' },
  { photo: '/images/PhotoForAbout/HuiyanZhang.webp', name: 'Huiyan Zhang', title: 'Software Developer · 2020–2021', bio: 'Developed several core functions of the ENACT platform.' },
  { photo: '/images/PhotoForAbout/ElainaPevide.webp', name: 'Elaina Pevide', title: 'Student Delegate · 2020–Present', bio: 'ENACT student delegate, bridging the student voice with the platform team.' },
  { photo: '/images/PhotoForAbout/EmilyFishman.webp', name: 'Emily Fishman', title: 'Resource Support · 2020–Present', bio: 'Emily provides resource support and is interested in global health and health policy.' },
  { photo: '/images/PhotoForAbout/BeneeHershon.webp', name: 'Benée Hershon', title: 'Resource Support · 2020–Present', bio: 'Benée provides resource support and works in sustainable agriculture and environmental policy.' },
  { photo: '/images/PhotoForAbout/LouisePei.webp', name: 'Louise Pei', title: 'Software Developer · 2021–Present', bio: 'Core developer focused on website maintenance and feature development.' },
  { photo: '/images/PhotoForAbout/AaronPortman.webp', name: 'Aaron Portman', title: 'Software Developer · 2021', bio: 'Student developer who contributed to the ENACT platform.' },
  { photo: '/images/PhotoForAbout/BishalBaral.webp', name: 'Bishal Baral', title: 'Software Developer · 2021–Present', bio: 'Core developer who enjoys building software and writing efficient programs.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function LeadershipCard({ person }) {
  return (
    <div style={{ border: '1px solid #e8e4de', borderRadius: 6, padding: '24px', display: 'flex', gap: 20, background: 'white' }}>
      <img
        src={person.photo}
        alt={person.name}
        style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 4, flexShrink: 0, background: '#ddd' }}
        onError={e => { e.currentTarget.style.background = '#e0d9cc'; e.currentTarget.src = ''; }}
      />
      <div>
        <h4 style={{ color: NAVY, fontWeight: 700, marginBottom: 2, fontSize: '1.1rem' }}>{person.name}</h4>
        <p style={{ color: GOLD, fontWeight: 600, fontSize: '0.85rem', margin: '0 0 2px' }}>
          {person.role} · <span style={{ fontStyle: 'italic' }}>{person.title}</span>
        </p>
        <hr style={{ margin: '10px 0', borderColor: '#e0e0e0' }} />
        <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{person.bio}</p>
      </div>
    </div>
  );
}

function HoverCard({ photo, name, title, institution, bio, department, state }) {
  const [hovered, setHovered] = useState(false);
  const subtitle = institution || department || state || '';

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 6, border: '1px solid #e8e4de', background: 'white', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: '20px 16px', textAlign: 'center' }}>
        <img
          src={photo || '/images/defaultProfile.webp'}
          alt={name}
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, background: '#d4cfc6', marginBottom: 10 }}
          onError={e => { e.currentTarget.style.background = '#d4cfc6'; e.currentTarget.src = ''; }}
        />
        <h6 style={{ color: NAVY, fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>{name}</h6>
        {title && <p style={{ color: '#666', fontSize: '0.78rem', margin: '0 0 4px' }}>{title}</p>}
        {subtitle && <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>{subtitle}</p>}
      </div>

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: NAVY,
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.22s ease',
        pointerEvents: hovered ? 'auto' : 'none'
      }}>
        <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>{name}</h6>
        {title && <p style={{ color: GOLD, fontSize: '0.78rem', margin: '0 0 10px', fontWeight: 600 }}>{title}</p>}
        {bio && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', lineHeight: 1.55, margin: 0 }}>{bio}</p>}
      </div>
    </div>
  );
}

function FacultyHoverCard({ profile, onImageError }) {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) return null;

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 6, border: '1px solid #e8e4de', background: 'white', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: '20px 16px', textAlign: 'center' }}>
        <img
          src={profile.profilePicURL}
          alt={profile.userName}
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, background: '#d4cfc6', marginBottom: 10 }}
          onError={() => { setImgFailed(true); if (onImageError) onImageError(); }}
        />
        <h6 style={{ color: NAVY, fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>{profile.userName}</h6>
        {profile.affiliation && <p style={{ color: '#666', fontSize: '0.78rem', margin: '0 0 2px' }}>{profile.affiliation}</p>}
        {profile.state && <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>{profile.state}</p>}
      </div>
      <div style={{
        position: 'absolute', inset: 0, background: NAVY,
        padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.22s ease', pointerEvents: hovered ? 'auto' : 'none'
      }}>
        <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>{profile.userName}</h6>
        {profile.affiliation && <p style={{ color: GOLD, fontSize: '0.78rem', margin: '0 0 8px', fontWeight: 600 }}>{profile.affiliation}</p>}
        {profile.department && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '0 0 8px' }}>{profile.department}</p>}
        <a href={`/profile/view/${profile._id}`} style={{ color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 3, padding: '4px 14px', fontSize: '0.78rem', textDecoration: 'none', marginTop: 4 }}>
          View Profile →
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetch('/api/v0/faculty-list')
      .then(r => r.json())
      .then(data => setFaculty(data.faculty || []))
      .catch(() => {});
  }, []);

  const previewFaculty = faculty
    .filter(p => p.profilePicURL && p.profilePicURL.startsWith('http') && !p.profilePicURL.includes('defaultProfile'))
    .slice(0, 12); // fetch more than 8 so broken images still fill 8 slots

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #060f1e 0%, #0f2444 65%, #0053a4 100%)', padding: 'clamp(60px,10vw,100px) 0 clamp(50px,8vw,80px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 28, height: 1, background: GOLD, flexShrink: 0 }} />
            THE ENACT COMMUNITY
          </p>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.18, marginBottom: 20 }}>
            The people behind the network.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
            A national community of faculty fellows, a dedicated team, and the staff who build the platform connecting them.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: '#f8f7f2', padding: 'clamp(40px,6vw,64px) 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#444', margin: 0 }}>
            ENACT is a non-partisan program, based at{' '}
            <a href="https://www.brandeis.edu" target="_blank" rel="noreferrer" style={{ color: BLUE }}>Brandeis University ↗</a>,
            addressing challenges to American democracy by engaging young people around the country in state-level legislative
            change based on a shared commitment to knowledge, cooperation, justice and integrity.
            It is housed in the{' '}
            <a href="https://www.brandeis.edu/ethics/" target="_blank" rel="noreferrer" style={{ color: BLUE }}>International Center for Ethics, Justice and Public Life ↗</a>.
            The program was made possible by a generous gift from Board member Norbert Weissberg and Judith Schneider,
            with support from the Rice Family Foundation, Mark Friedman, and the Teagle Foundation.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ background: 'white', padding: 'clamp(48px,7vw,72px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>LEADERSHIP</p>
          <h2 style={{ color: NAVY, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, marginBottom: 32 }}>The team guiding ENACT</h2>
          <div className="about-leadership-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {LEADERSHIP.map(p => <LeadershipCard key={p.name} person={p} />)}
          </div>
        </div>
      </section>

      {/* Faculty Fellows */}
      <section style={{ background: '#f8f7f2', padding: 'clamp(48px,7vw,72px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>FACULTY FELLOWS</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ color: NAVY, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: 0 }}>
              A network across {faculty.length > 0 ? `${faculty.length}+` : '8+'} campuses
            </h2>
            <Link to="/profiles/view/faculty" style={{ color: BLUE, fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem' }}>
              View all fellows →
            </Link>
          </div>
          {previewFaculty.length > 0 ? (
            <div className="about-faculty-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {previewFaculty.map(p => <FacultyHoverCard key={p._id} profile={p} onImageError={() => {}} />)}
            </div>
          ) : (
            <p style={{ color: '#666' }}>
              <Link to="/profiles/view/faculty" style={{ color: BLUE }}>View the full list of faculty fellows →</Link>
            </p>
          )}
        </div>
      </section>

      {/* Digital Platform Staff */}
      <section style={{ background: 'white', padding: 'clamp(48px,7vw,72px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>DIGITAL PLATFORM STAFF</p>
          <h2 style={{ color: NAVY, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 28 }}>The team that builds it</h2>
          <div className="about-staff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PLATFORM_STAFF.map(m => (
              <HoverCard key={m.name} photo={m.photo} name={m.name} title={m.title} bio={m.bio} />
            ))}
          </div>
        </div>
      </section>

      {/* Intro videos */}
      <section style={{ background: '#f8f7f2', padding: 'clamp(48px,7vw,72px) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <p style={{ color: GOLD, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>INTRO VIDEOS</p>
          <h2 style={{ color: NAVY, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, marginBottom: 28 }}>Learn more about ENACT</h2>
          <div className="about-video-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h5 style={{ color: NAVY, marginBottom: 12 }}>What is ENACT?</h5>
              <video style={{ width: '100%', borderRadius: 6 }} controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Updated+Video+2.mp4" type="video/mp4" />
              </video>
            </div>
            <div>
              <h5 style={{ color: NAVY, marginBottom: 12 }}>A Brief Tour of enactnetwork.org</h5>
              <video style={{ width: '100%', borderRadius: 6 }} poster="/images/introVideo.webp" controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* External links */}
      <section style={{ background: NAVY, padding: '36px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,60px)', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>ENACT is based at Brandeis University's International Center for Ethics, Justice and Public Life.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="https://www.brandeis.edu/ethics/enact/index.html" target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ENACT Program ↗
            </a>
            <a href="https://www.brandeis.edu/ethics/" target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              Ethics Center ↗
            </a>
            <a href="https://www.brandeis.edu" target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              Brandeis University ↗
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-leadership-grid { grid-template-columns: 1fr !important; }
          .about-faculty-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-staff-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-video-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-faculty-grid { grid-template-columns: 1fr !important; }
          .about-staff-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
