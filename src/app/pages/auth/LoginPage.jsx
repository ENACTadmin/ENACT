import React from 'react';
import { Link } from 'react-router-dom';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

export default function LoginPage() {
  return (
    <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '40px 40px 36px', maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/images/enact-logo.webp" alt="ENACT" style={{ height: 48, marginBottom: 12 }} />
          <h1 style={{ color: NAVY, fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px' }}>Welcome back</h1>
          <p style={{ color: '#888', fontSize: '0.88rem', margin: 0 }}>Sign in to your ENACT account</p>
        </div>

        <form action="/login" method="post">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#444', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Email</label>
            <input type="text" name="email" id="Username" placeholder="your@email.edu" required autoFocus
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 7, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', color: '#444', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input type="password" name="password" id="inputPassword" placeholder="••••••••" required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 7, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 20, textAlign: 'right' }}>
            <a href="/reset" style={{ color: BLUE, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
          </div>

          <input name="submit" type="submit" value="Sign in"
            style={{ width: '100%', padding: '11px', background: BLUE, color: '#fff', border: 'none', borderRadius: 7, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 12 }} />

          <a href="/auth/google"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '11px', background: '#f5f5f5', color: '#333', border: '1px solid #e0e0e0', borderRadius: 7, fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', marginBottom: 24, boxSizing: 'border-box' }}>
            <img src="https://www.google.com/favicon.ico" alt="" style={{ width: 16, height: 16 }} />
            Sign in with Google
          </a>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: 12 }}>New to ENACT?</p>
            <Link to="/signup"
              style={{ display: 'block', width: '100%', padding: '10px', background: NAVY, color: '#fff', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', boxSizing: 'border-box' }}>
              Create an account →
            </Link>
            <div style={{ marginTop: 14 }}>
              <Link to="/accountHelp" style={{ color: BLUE, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                Need help creating an account? Watch the guide
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
