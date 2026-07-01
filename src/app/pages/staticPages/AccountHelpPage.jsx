import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

export default function AccountHelpPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto' }}>
            A step-by-step video guide to setting up your ENACT account and profile.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#f5f7fa', padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '28px 32px' }}>
              <h2 style={{ margin: '0 0 10px', color: NAVY, fontSize: '1.2rem', fontWeight: 700 }}>Create an Account &amp; Profile</h2>
              <p style={{ margin: '0 0 20px', color: '#666', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Learn how to register for ENACT, complete your profile, and start connecting with the network.
              </p>
              <button onClick={() => setOpen(x => !x)}
                style={{ background: open ? NAVY : BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                {open ? 'Hide video' : '▶ Watch the guide'}
              </button>
            </div>
            {open && (
              <div style={{ borderTop: '1px solid #f0f0f0' }}>
                <video style={{ width: '100%', display: 'block' }} poster="/images/accountCreation.webp" controls>
                  <source src="https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4" type="video/mp4" />
                </video>
              </div>
            )}
          </div>

          <div style={{ marginTop: 32, background: '#fff', borderRadius: 10, border: `1px solid ${GOLD}40`, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ margin: '0 0 4px', color: NAVY, fontSize: '1rem', fontWeight: 700 }}>Ready to sign up?</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.88rem' }}>Create your ENACT account and join the network.</p>
            </div>
            <Link to="/signup" style={{ background: BLUE, color: '#fff', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              Sign up →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
