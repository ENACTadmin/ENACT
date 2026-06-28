import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

const VIDEOS = [
  {
    title: 'Getting to Know ENACT',
    description: 'A complete overview of the ENACT platform and program.',
    poster: '/images/introVideo.webp',
    src: 'https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4',
    audience: 'all',
  },
  {
    title: 'Create an Account & Profile',
    description: 'Step-by-step guide to setting up your ENACT account and profile.',
    poster: '/images/accountCreation.webp',
    src: 'https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4',
    audience: 'all',
  },
  {
    title: 'Uploading ENACT Resources',
    description: 'Learn how to upload and share resources with the ENACT community.',
    poster: null,
    src: 'https://enact-resources.s3.us-east-2.amazonaws.com/Uploading+ENACT+Resources+(with+subtitles).mp4',
    audience: 'all',
  },
  {
    title: 'Viewing & Creating Events',
    description: 'How to find upcoming events and create new ENACT events.',
    poster: null,
    src: 'https://enact-resources.s3.us-east-2.amazonaws.com/Viewing+and+Creating+ENACT+Events+(with+subtitles).mp4',
    audience: 'all',
  },
  {
    title: 'Faculty Tutorial',
    description: 'A complete overview of ENACT tools and features for faculty fellows.',
    poster: null,
    src: 'https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Faculty+Overview+Video.mp4',
    audience: 'faculty',
  },
];

function VideoCard({ video }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '22px 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ margin: 0, color: NAVY, fontSize: '1rem', fontWeight: 700 }}>{video.title}</h3>
          {video.audience === 'faculty' && (
            <span style={{ background: '#fff8e6', color: '#8a6000', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 3, marginLeft: 8, flexShrink: 0, textTransform: 'uppercase' }}>
              Faculty
            </span>
          )}
        </div>
        <p style={{ margin: '0 0 16px', color: '#666', fontSize: '0.88rem', lineHeight: 1.6 }}>{video.description}</p>
        <button onClick={() => setOpen(x => !x)}
          style={{ background: open ? NAVY : BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
          {open ? 'Hide video' : '▶ Watch video'}
        </button>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0' }}>
          <video style={{ width: '100%', display: 'block' }} poster={video.poster || undefined} controls>
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const { user } = useAuth();
  const loggedIn = user?.loggedIn;
  const isFacultyOrAdmin = user?.status === 'faculty' || user?.status === 'admin';

  const visibleVideos = VIDEOS.filter(v => v.audience === 'all' || (v.audience === 'faculty' && isFacultyOrAdmin));

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            How-to Videos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto' }}>
            Video guides to help you get the most out of the ENACT platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#f5f7fa', padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {!loggedIn ? (
            <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${GOLD}40`, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔒</div>
              <h2 style={{ color: NAVY, fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>Log in to access help videos</h2>
              <p style={{ color: '#666', marginBottom: 24 }}>
                ENACT how-to videos are available to registered members.
              </p>
              <a href="/login" style={{ background: BLUE, color: '#fff', padding: '10px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                Log in →
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {visibleVideos.map(v => <VideoCard key={v.title} video={v} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
