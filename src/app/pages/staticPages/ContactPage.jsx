import React from 'react';

const NAVY = '#0f1f3d';
const BLUE = '#0053a4';
const GOLD = '#c49422';

const CONTACTS = [
  {
    name: 'ENACT Program',
    role: 'General Inquiries & Technical Assistance',
    email: 'enact@brandeis.edu',
    bio: 'For general questions about the ENACT platform, technical support, or program information.',
    website: 'https://www.brandeis.edu/ethics/ENACT',
    websiteLabel: 'Learn about ENACT ↗',
  },
  {
    name: 'Melissa Stimell',
    role: 'Director, ENACT Program',
    email: 'stimell@brandeis.edu',
    bio: 'Professor of the Practice in the Legal Studies Program at Brandeis University, and Director of the International Center for Ethics, Justice and Public Life.',
  },
  {
    name: 'David J. Weinstein',
    role: 'Assistant Director, ENACT & Communications',
    email: 'djw@brandeis.edu',
    phone: '781-736-2115',
    bio: 'Assistant Director of ENACT and Communications for the International Center for Ethics, Justice and Public Life at Brandeis University.',
  },
];

function ContactCard({ contact }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 16 }}>
        <div style={{ minWidth: 48, height: 48, background: NAVY, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: GOLD, fontSize: '1.2rem' }}>👤</span>
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', color: NAVY, fontSize: '1.1rem', fontWeight: 700 }}>{contact.name}</h3>
          <p style={{ margin: 0, color: GOLD, fontSize: '0.85rem', fontWeight: 600 }}>{contact.role}</p>
        </div>
      </div>
      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 18px' }}>{contact.bio}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {contact.email && (
          <a href={`mailto:${contact.email}`}
            style={{ color: BLUE, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            ✉ {contact.email}
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
            style={{ color: '#555', fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            ☏ {contact.phone}
          </a>
        )}
        {contact.website && (
          <a href={contact.website} target="_blank" rel="noreferrer"
            style={{ color: BLUE, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            🔗 {contact.websiteLabel || contact.website}
          </a>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #162847 100%)`, padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', height: 2, width: 48, background: GOLD, marginBottom: 20 }} />
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Contact Us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto' }}>
            Have questions about ENACT? We're here to help.
          </p>
        </div>
      </section>

      {/* Contacts grid */}
      <section style={{ background: '#f5f7fa', padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {CONTACTS.map(c => <ContactCard key={c.name} contact={c} />)}
          </div>

          <div style={{ marginTop: 48, background: '#fff', borderRadius: 10, border: `1px solid ${GOLD}30`, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px', color: NAVY, fontSize: '1rem', fontWeight: 700 }}>Brandeis University — ENACT Program</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.88rem' }}>
                International Center for Ethics, Justice and Public Life<br />
                Brandeis University, Waltham, MA
              </p>
            </div>
            <a href="https://www.brandeis.edu/ethics/ENACT" target="_blank" rel="noreferrer"
              style={{ background: BLUE, color: '#fff', padding: '10px 22px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              Visit ENACT at Brandeis ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
