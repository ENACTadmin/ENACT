import React, { useEffect, useState } from 'react';

function ProfileCard({ profile }) {
  const lastName = profile.userName?.split(' ').pop() || '';
  return (
    <div className="col-md-3 col-sm-6 col-12 mb-4">
      <div className="card h-100 shadow-sm text-center p-3">
        <img
          src={profile.profilePicURL || '/images/defaultProfile.webp'}
          alt={profile.userName}
          className="rounded-circle mx-auto mb-2"
          style={{ width: 90, height: 90, objectFit: 'cover' }}
        />
        <h6 className="mb-1">{profile.userName}</h6>
        {profile.affiliation && (
          <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{profile.affiliation}</p>
        )}
        {profile.department && (
          <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{profile.department}</p>
        )}
        {profile.state && (
          <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{profile.state}</p>
        )}
        <div className="mt-auto pt-2">
          <a href={`/profile/view/${profile._id}`} className="btn btn-outline-primary btn-sm me-1">
            Profile
          </a>
          {profile.linkedInURL && (
            <a href={profile.linkedInURL} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm me-1">
              LinkedIn
            </a>
          )}
          {profile.personalWebsiteURL && (
            <a href={profile.personalWebsiteURL} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm">
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FacultyListPage() {
  const [staff, setStaff] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v0/faculty-list')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setStaff(data.staff || []); setFaculty(data.faculty || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase();
  const filteredFaculty = faculty.filter(p =>
    !q ||
    p.userName?.toLowerCase().includes(q) ||
    p.affiliation?.toLowerCase().includes(q) ||
    p.state?.toLowerCase().includes(q) ||
    p.department?.toLowerCase().includes(q)
  );

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-4">Failed to load faculty: {error}</div>;

  return (
    <>
      <section className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">ENACT Faculty Fellows</div>
          </div>
        </div>
      </section>

      <section className="section section__grey">
        <div className="section__content section__content--fluid-width section__content--padding--small">

          {staff.length > 0 && (
            <>
              <h3 data-aos="fade-up">ENACT Staff</h3>
              <hr />
              <div className="row">
                {staff.map(p => <ProfileCard key={p._id} profile={p} />)}
              </div>
              <br /><br />
            </>
          )}

          <h3 data-aos="fade-up">Faculty Fellows</h3>
          <hr />

          <div className="mb-4" style={{ maxWidth: 400 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, institution, or state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {filteredFaculty.length === 0 ? (
            <p>No faculty match your search.</p>
          ) : (
            <div className="row">
              {filteredFaculty.map(p => <ProfileCard key={p._id} profile={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
