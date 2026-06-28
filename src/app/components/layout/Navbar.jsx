import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, loading } = useAuth();
  const loggedIn = user?.loggedIn;
  const status = user?.status;
  const courses = user?.courses || [];

  function handleLogout(e) {
    e.preventDefault();
    window.location.href = '/logout';
  }

  if (loading) return null;

  return (
    <header className="header react-nav"
      style={{ position: 'relative', background: '#0a1628', boxShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
      <style>{`
        /* ── Scoped React navbar overrides ── */
        .react-nav .header__menu > ul > li > a,
        .react-nav .header__menu ul li a.header-link {
          color: rgba(255,255,255,0.85) !important;
        }
        .react-nav .header__menu > ul > li > a:hover,
        .react-nav .header__menu ul li a.header-link:hover {
          color: #fff !important;
        }
        /* Sub-menu dropdown dark theme */
        .react-nav .header__menu .sub-menu,
        .react-nav .header__menu .dropdown-menu {
          background: #0a1628 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-top: none !important;
        }
        .react-nav .header__menu .sub-menu li a,
        .react-nav .header__menu .dropdown-menu li a {
          color: rgba(255,255,255,0.78) !important;
        }
        .react-nav .header__menu .sub-menu li a:hover,
        .react-nav .header__menu .dropdown-menu li a:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.07) !important;
        }
        /* Keep LOGIN button white-on-blue */
        .react-nav .header__menu > ul > li.header__btn--signup > a {
          color: #fff !important;
          background-color: #0053a4 !important;
        }
        /* Divider line between top-level items */
        .react-nav .header__menu > ul > li {
          border-right: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>
      <div className="header__content header__content--fluid-width">
        <Link className="header__logo-title" to="/">
          <div className="card-body" style={{ backgroundColor: 'transparent' }}>
            <div className="card-text">
              <img style={{ height: 50, width: 50 }} src="/images/enact-logo.webp" alt="ENACT logo" />
            </div>
          </div>
        </Link>

        <nav className="header__menu">
          <ul>
            {/* Home */}
            <li>
              <a className="header-link" id="home-link" href="#">Home</a>
              <ul className="sub-menu">
                <li><Link className="header-link" to="/">ENACT Resources</Link></li>
                <li>
                  <a className="header-link" href="https://www.brandeis.edu/enact/index.html" target="_blank" rel="noreferrer">
                    ENACT Program
                  </a>
                </li>
              </ul>
            </li>

            {!loggedIn ? (
              <>
                {/* Impact */}
                <li>
                  <a className="header-link" id="impact" href="#">Impact</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/resources/view/facultyResearch">Faculty Research</a></li>
                    <li><a className="header-link" href="/resources/view/inTheNews">In the News</a></li>
                  </ul>
                </li>

                {/* Resources */}
                <li>
                  <a className="header-link" href="#">Resources</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/search/">Search Resources</a></li>
                  </ul>
                </li>

                {/* Networking */}
                <li>
                  <a className="header-link" href="/networking">Networking</a>
                </li>

                {/* Courses & Events */}
                <li>
                  <a className="header-link" href="#">Courses &amp; Events</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/courses/schedule">Course Schedule</a></li>
                    <li><a className="header-link" href="/events">Events</a></li>
                    <li>
                      <a className="header-link" href="https://www.brandeis.edu/enact/news-updates/index.html" target="_blank" rel="noreferrer">
                        News &amp; Updates
                      </a>
                    </li>
                  </ul>
                </li>

                {/* About */}
                <li><a className="header-link" href="/about">About</a></li>
              </>
            ) : (
              <>
                {/* Impact (admin only) */}
                {status === 'admin' && (
                  <li>
                    <a className="header-link" href="#">Impact</a>
                    <ul className="sub-menu">
                      <li><a className="header-link" href="/resources/view/facultyResearch">Faculty Research</a></li>
                      <li><a className="header-link" href="/resources/view/inTheNews">In the News</a></li>
                    </ul>
                  </li>
                )}

                {/* Resources */}
                <li>
                  <a className="header-link" href="#">Resources</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/search/">Search Resources</a></li>
                    <li><a className="header-link" href="/resources/view/student-guide">Advice &amp; Tips for Students</a></li>

                    {(status === 'faculty' || status === 'admin') && (
                      <li><a className="header-link" href="/resource/review">Approve resources</a></li>
                    )}

                    {/* Upload class resources dropdown */}
                    {courses.length === 1 ? (
                      <li>
                        <a className="header-link" href={`/resource/upload/course/${courses[0]._id}`}>
                          Upload class resources
                        </a>
                      </li>
                    ) : courses.length > 1 ? (
                      <li>
                        <a className="header-link" href="#">Upload Class Resources</a>
                        <ul className="dropdown-menu dropdown-menu-right">
                          {courses.map(c => (
                            <li key={c._id}>
                              <a className="header-link" href={`/resource/upload/course/${c._id}`}>
                                {c.courseName.length <= 15 ? c.courseName : c.courseName.substring(0, 15) + '...'}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : null}

                    {(status === 'faculty' || status === 'admin') && (
                      <>
                        <li><a className="header-link" href="/resource/upload/faculty">Upload faculty resources</a></li>
                        <li><a className="header-link" href="/resources/view/faculty">Faculty resources</a></li>
                      </>
                    )}

                    <li><a className="header-link" href="/resources/view/favorite">My favorites</a></li>
                    <li><a className="header-link" href="/resources/view/private">My resources</a></li>
                  </ul>
                </li>

                {/* Networking */}
                <li>
                  <a className="header-link" href="#">Networking</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/networking">Networking</a></li>
                    <li><a className="header-link" href="/profiles/view/faculty">Faculty &amp; Staff</a></li>
                  </ul>
                </li>

                {/* Courses & Events */}
                <li>
                  <a className="header-link" href="#">Courses &amp; Events</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/courses/schedule">Course Schedule</a></li>
                    <li><a className="header-link" href="/courses">Course Management</a></li>
                    {courses.map(c => (
                      <li key={c._id}>
                        <a className="header-link" href={`/course/view/${c._id}/10`}>
                          - {c.courseName.length <= 20 ? c.courseName : c.courseName.substring(0, 16) + '...'}
                        </a>
                      </li>
                    ))}
                    <li><option disabled>─────────────</option></li>
                    <li><a className="header-link" href="/events">Events</a></li>
                    <li>
                      <a className="header-link" href="https://www.brandeis.edu/enact/news-updates/index.html" target="_blank" rel="noreferrer">
                        News &amp; Updates
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Admin menu */}
                {status === 'admin' && (
                  <li>
                    <a className="header-link" href="#">Admin</a>
                    <ul className="sub-menu">
                      <li><a className="header-link" href="/resource/approve/public">Approve all resources</a></li>
                      <li><a className="header-link" href="/tag/approve">Approve new topic(s)</a></li>
                      <li><a className="header-link" href="/resources/manage/public">Manage homepage rsrc(s)</a></li>
                      <li><a className="header-link" href="/profile/create/faculty">Set up a new faculty</a></li>
                      <li><a className="header-link" href="/course/join">Join a course</a></li>
                      <li><a className="header-link" href="/profiles/view/all">View all profiles</a></li>
                      <li><a className="header-link" href="/course/create">Create Course (Faculty)</a></li>
                    </ul>
                  </li>
                )}

                {/* Help & About */}
                <li>
                  <a className="header-link" href="#">Help &amp; About</a>
                  <ul className="sub-menu">
                    {(status === 'faculty' || status === 'admin') && (
                      <li><a className="header-link" href="/resources/view/faculty">Guide for faculty</a></li>
                    )}
                    <li><a className="header-link" href="/help">How-to videos</a></li>
                    <li><a className="header-link" href="/about">About</a></li>
                    <li><a className="header-link" href="/contact">Contact</a></li>
                  </ul>
                </li>
              </>
            )}

            {/* Login / Account */}
            <li className="header-link">
                <Link
                  className="header__btn--signup"
                  style={{ backgroundColor: '#0053a4', color: 'white', textTransform: 'uppercase' }}
                  to="/login"
                >
                  Login
                </Link>
              ) : (
                <>
                  <a className="header-link" href="#">Account</a>
                  <ul className="sub-menu">
                    <li><a className="header-link" href="/profile/update">Update profile</a></li>
                    <li><a className="header-link" href="/messages/view/all">Messages</a></li>
                    <li>
                      <a style={{ color: 'red', fontWeight: 'bold' }} href="/logout" onClick={handleLogout}>
                        Log out
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
