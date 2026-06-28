import React from 'react';
import { Link } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

export default function SignupPage() {
  return (
    <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '40px 40px 36px', maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/images/enact-logo.webp" alt="ENACT" style={{ height: 48, marginBottom: 12 }} />
          <h1 style={{ color: NAVY, fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px' }}>Join ENACT</h1>
          <p style={{ color: '#888', fontSize: '0.88rem', margin: 0 }}>Create your account to get started</p>
        </div>

        <form action="/signup" method="post">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#444', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Email</label>
            <input type="text" name="email" id="Username" placeholder="your@email.edu" required autoFocus
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 7, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#444', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input type="password" name="password" id="inputPassword" placeholder="••••••••" required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 7, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <input name="submit" type="submit" value="Create account"
            style={{ width: '100%', padding: '11px', background: BLUE, color: '#fff', border: 'none', borderRadius: 7, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 20 }} />

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: 12 }}>Already have an account?</p>
            <Link to="/login"
              style={{ display: 'block', width: '100%', padding: '10px', background: NAVY, color: '#fff', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', boxSizing: 'border-box' }}>
              Sign in →
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
