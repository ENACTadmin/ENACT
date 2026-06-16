import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ResourceCard({ resource }) {
  return (
    <div className="shadow-sm card-body border-0" style={{ borderRadius: 30 }} data-aos="fade-up">
      <h3 style={{ marginLeft: 10, paddingBottom: 4 }}>{resource.name}</h3>
      <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,155)', marginBottom: 6 }} />
      <div className="card-text">
        <ul className="list-group" style={{ marginBottom: 20 }}>
          <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
            <h5 style={{ display: 'inline' }}>Description:</h5> {resource.description}
          </li>
          <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
            <h5 style={{ display: 'inline' }}>State:</h5> {resource.state}
          </li>
          <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
            <h5 style={{ display: 'inline' }}>Institution:</h5> {resource.institution}
          </li>
          {resource.ownerName && (
            <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
              <h5 style={{ display: 'inline' }}>Author:</h5> {resource.ownerName}
            </li>
          )}
          <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
            <h5 style={{ display: 'inline' }}>Topic(s)/Issue(s):</h5> {Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags}
          </li>
        </ul>
        <div className="list-group-item" style={{ fontSize: 'large', color: 'white', background: '#0053a4', display: 'flex', justifyContent: 'center', width: 260 }}>
          <a style={{ color: 'white' }} href={resource.uri} target="_blank" rel="noreferrer">Download Resource</a>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, loggedIn }) {
  const showFull = loggedIn || event.visibility === 'public';
  const description = showFull
    ? event.description
    : (event.description.split('.')[0] + '...');

  return (
    <div className="card border-0" style={{ borderRadius: 30 }} data-aos="fade-up">
      <div className="shadow-sm card-body">
        <h3 style={{ marginLeft: 10 }}>{event.title}</h3>
        <div className="card-text">
          <ul className="list-group">
            <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
              <div className="row">
                <div className="col-md-9 col-sm-12">
                  <h5 style={{ display: 'inline', fontWeight: 650 }}>Description:</h5> {description}
                </div>
                <div className="col-md-3 col-sm-12 align-self-center">
                  <img
                    src={event.imageURL || '/images/enact-logo.webp'}
                    alt={event.title}
                    style={{ objectFit: 'cover', maxWidth: '100%', borderRadius: 20 }}
                  />
                </div>
              </div>
            </li>

            {showFull ? (
              <>
                {event.start && (
                  <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
                    <h5 style={{ display: 'inline', fontWeight: 650 }}>Date: </h5>
                    {new Date(event.start).toLocaleDateString()}
                  </li>
                )}
                {event.uri && (
                  <div className="list-group-item" style={{ fontSize: 'large', color: 'white', background: '#0053a4', display: 'flex', justifyContent: 'center', width: 260, marginTop: 30 }}>
                    <a style={{ color: 'white' }} href={event.uri} target="_blank" rel="noreferrer">View Event</a>
                  </div>
                )}
              </>
            ) : (
              <li className="list-group-item borderless box-padding bg-transparent" style={{ fontSize: 'large' }}>
                <h5 style={{ display: 'inline' }}>To view details, <a href="/login" className="btn btn-sm btn-warning">Click to Login</a></h5>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Carousel({ imagePaths, labelPaths }) {
  const [active, setActive] = useState(0);

  if (!imagePaths || imagePaths.length === 0) return null;

  return (
    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        {imagePaths.map((src, i) => (
          <div key={i} className={`carousel-item${i === active ? ' active' : ''}`}>
            <img src={src} style={{ width: '100%', height: 480, objectFit: 'contain' }} className="d-block w-100" alt="" />
            {labelPaths[i] && (
              <div className="carousel-caption d-none d-md-block"
                style={{ right: '1%', left: '1%', color: 'black', backgroundColor: 'white', opacity: 0.95, borderRadius: 15, padding: '4%' }}>
                <p style={{ fontSize: 'large', lineHeight: '110%' }}>{labelPaths[i]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={() => setActive(i => (i - 1 + imagePaths.length) % imagePaths.length)}>
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={() => setActive(i => (i + 1) % imagePaths.length)}>
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const topRef = useRef(null);
  const getStartedRef = useRef(null);
  const eventsRef = useRef(null);
  const videoRef = useRef(null);

  const loggedIn = user?.loggedIn;
  const status = user?.status;

  useEffect(() => {
    fetch('/api/v0/home-data')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ resources: [], events: [], imagePaths: [], labelPaths: [], cookieDismissed: false }));
  }, []);

  useEffect(() => {
    if (data?.cookieDismissed) setDismissed(true);
  }, [data]);

  useEffect(() => {
    if (window.AOS) window.AOS.init();
  }, [data]);

  function handleDismiss() {
    setDismissed(true);
    document.cookie = `notificationDismissed=true; path=/; max-age=${60 * 60 * 24 * 30}`;
  }

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!data) return null;

  const { resources, events, imagePaths, labelPaths } = data;

  return (
    <div ref={topRef}>
      {/* Sticky header banner */}
      <header className="header header--sticky">
        <div className="header__content header__content--fluid-width">
          <a className="header__logo-title" href="/">
            <div className="card-body" style={{ backgroundColor: 'transparent' }}>
              <img style={{ height: 70, width: 70 }} src="/images/enact-logo.webp" alt="ENACT logo" />
            </div>
          </a>
          <a className="header__logo-title-1" href="/">
            THE ABRAHAM FEINBERG EDUCATIONAL<br />NETWORK FOR ACTIVE CIVIC TRANSFORMATION
            <p style={{ fontSize: 'small' }}>a national program based at Brandeis University</p>
          </a>
        </div>
        {!dismissed && (
          <div id="notification" className="alert alert-warning alert-dismissible fade show" role="alert" style={{ marginTop: 20 }}>
            <strong>OPPORTUNITY:</strong> Apply for the ENACT Faculty Fellowship{' '}
            <a href="https://www.brandeis.edu/enact/grants-fellowships/index.html" target="_blank" rel="noreferrer">here</a>,
            or nominate a candidate by emailing{' '}
            <a href="mailto:ENACT@brandeis.edu">ENACT@brandeis.edu</a>.
            <button type="button" className="close" aria-label="Close" onClick={handleDismiss}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </header>

      {/* Intro section */}
      <section id="content-enact-front-intro" className="section section--intro section__grey" data-aos="fade-down" data-aos-duration="600">
        <div className="section__content section__content--full-width" style={{ fontWeight: 750 }}>
          <div className="intro">
            <div className="intro__content" data-aos="fade-right" data-aos-duration="600">
              <div className="intro__description" style={{ color: 'black', lineHeight: '120%' }}>
                <b style={{ color: '#0053a4' }}>
                  ENACT: The Abraham Feinberg Educational Network for Active Civic Transformation
                </b>{' '}
                is a national, non-partisan program based at{' '}
                <a href="https://www.brandeis.edu">Brandeis University</a>, engaging undergraduates at
                colleges and universities in state-level legislative change.
                {!loggedIn && (
                  <> <a id="not-logged-learn-more" href="https://www.enactnetwork.org/about" className="btn btn-sm btn-warning">Learn More</a></>
                )}
                <br />
                {(loggedIn && status === 'student') || !loggedIn ? (
                  <>
                    <b style={{ color: '#FF9912' }}>- ENACT Students &amp; Alumni: </b>
                    search student work. Network with students and alumni.
                    {!loggedIn && (
                      <> <a id="not-logged-login" href="/login" className="btn btn-sm btn-warning">Click to Login</a></>
                    )}
                    <br />
                  </>
                ) : null}
                {((loggedIn && (status === 'faculty' || status === 'admin')) || !loggedIn) && (
                  <>
                    <b style={{ color: '#FF9912' }}>- ENACT Faculty Fellows: </b>
                    access ENACT teaching resources and student work.<br />
                  </>
                )}
                {!loggedIn && (
                  <b style={{ color: '#FF9912' }}>- Public: </b>
                )}
                {!loggedIn && ' access student work on bills from across the U.S., including op-eds, issue research and more.'}
                {loggedIn && status === 'TA' && (
                  <>
                    <b style={{ color: '#FF9912' }}>- TA: </b>
                    help instructor review/upload resources or post events.<br />
                  </>
                )}
              </div>

              <div className="form-demo">
                {loggedIn ? (
                  (status === 'admin' || status === 'faculty' || status === 'TA') ? (
                    <>
                      <a href="/courses"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Courses &#xf02d;</button></a>
                      <a href="/search/"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Search Resources &#xf002;</button></a>
                      <a href="/resources/view/faculty"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Guide For Faculty &#xf14e;</button></a>
                    </>
                  ) : (
                    <>
                      <a href="/search/"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Search Resources &#xf002;</button></a>
                      <a href="/networking"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Networking &#xf08c;</button></a>
                    </>
                  )
                ) : (
                  <>
                    <a href="/search/"><button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>Search Resources &#xf002;</button></a>
                    <button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }} onClick={() => scrollTo(getStartedRef)}>Get Started &#8595;</button>
                  </>
                )}
                <button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }} onClick={() => scrollTo(eventsRef)}>Upcoming Events &#8595;</button>
                <button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }} onClick={() => scrollTo(videoRef)}>Intro Video &#8595;</button>
                <a href="https://www.brandeis.edu/enact/news-updates/index.html" target="_blank" rel="noreferrer">
                  <button className="form-demo__large fa" style={{ fontSize: 'large', fontWeight: 680 }}>News&amp;Updates &#xf002;</button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 100 }} ref={getStartedRef} />
      </section>

      {/* Who we are section */}
      <section id="content-enact-program-intro" className="section section__grey">
        <br /><br /><br />
        <h2 className="section__title section__title--centered">Who we are &amp; What you can do</h2>
        <br /><br /><br />
        <div className="section__content section__content--fluid-width section__content--padding--small">
          <div className="grid grid--3col">
            <div className="grid__item shadow-sm partners__slide__grey" style={{ minHeight: 500 }} data-aos="fade-up">
              <h3 className="grid__title"><span>What We Do</span></h3>
              <p className="grid__text" style={{ fontSize: 'larger', lineHeight: '145%' }}>
                The <b style={{ color: '#0053a4' }}>ENACT: The Abraham Feinberg Educational Network for Active Civic Transformation</b> is a
                national program engaging undergraduates at colleges and universities in state-level legislative change by
                learning to work with legislators, staffers, and community organizations to advance policy. It is becoming a
                major voice in addressing challenges to American democracy by engaging young people around the country in civic
                activism built on knowledge, cooperation, justice and integrity.
              </p>
            </div>

            <div className="grid__item shadow-sm partners__slide__grey" style={{ minHeight: 500, backgroundColor: 'black' }} data-aos="fade-up">
              <Carousel imagePaths={imagePaths} labelPaths={labelPaths} />
            </div>

            <div className="grid__item shadow-sm partners__slide__grey" style={{ minHeight: 500 }} data-aos="fade-up">
              <h3 className="grid__title"><span>The ENACT Model</span></h3>
              <p className="grid__text" style={{ fontSize: 'large', lineHeight: '140%' }}>
                <b style={{ color: '#0053a4' }}>• Workshop</b>: ENACT launched with a workshop at Brandeis University in
                May 2016. Under the leadership of the program's academic director, ENACT Fellows shared ideas and worked on course development.
                <br />
                <b style={{ color: '#0053a4' }}>• Courses</b>: In ENACT courses students learn about participating in the
                legislative and advocacy process at the state level, with a substantial hands-on component in which they engage directly in that process.
                <br />
                <b style={{ color: '#0053a4' }}>• Online Network</b>: The ENACT Network is a national in-person and online
                network of students, faculty, activists and legislators. It is a strategic and information hub for state-level
                players that enables them to connect with counterparts throughout the country.
              </p>
            </div>
          </div>
          <div className="clear" />
        </div>
      </section>

      {/* Public resources section */}
      <section id="content-enact-public-resources" className="section diagonal-gradient">
        <div className="section__content section__content--fluid-width section__content--padding">
          <h2 className="section__title section__title--centered1" style={{ color: 'white' }} data-aos="fade-up">
            Public resources
          </h2>
          <br /><br /><br />
          {resources.length === 0 ? (
            <div className="shadow-sm card-body text-center" style={{ borderRadius: 30 }}>
              <h4>No resource available yet</h4>
            </div>
          ) : (
            resources.slice(0, 3).map((r, i) => (
              <React.Fragment key={r._id || i}>
                <ResourceCard resource={r} />
                <br />
              </React.Fragment>
            ))
          )}
          <br /><br />
          {status === 'admin' && (
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <a href="/resources/manage/public">
                <button className="btn btn-lg btn-light">Manage Displayed Resources</button>
              </a>
            </div>
          )}
          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <a href="/search/"><button className="btn btn-lg btn-light">Find More Resources</button></a>
          </div>
          <br />
          <div className="clear" />
        </div>
      </section>

      {/* Events section */}
      <section id="content-enact-events" className="section section__grey">
        <div style={{ paddingTop: 0 }} ref={eventsRef} />
        <section className="section__content section__content--fluid-width">
          <br /><br /><br />
          <h2 className="section__title section__title--centered" data-aos="fade-up">Events</h2>
          <br /><br /><br />
          {events.length > 0 ? (
            events.map((e, i) => (
              <React.Fragment key={e._id || i}>
                <EventCard event={e} loggedIn={loggedIn} />
                {i < events.length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            <div className="shadow-sm card-body text-center" style={{ borderRadius: 30 }}>
              <h4>No events available yet</h4>
            </div>
          )}
          <br /><br /><br />
          <div className="text-center" data-aos="fade-up" style={{ paddingBottom: 80 }} data-aos-delay="100">
            <a href="/events"><button className="btn btn-lg btn-primary">View Upcoming &amp; Past Events</button></a>
          </div>
        </section>
      </section>

      {/* Join Us (non-logged-in only) */}
      {!loggedIn && (
        <section id="content-enact-join-us" className="section diagonal-gradient">
          <br /><br /><br />
          <h2 className="section__title section__title--centered1" style={{ color: 'white' }} data-aos="fade-up">Join Us</h2>
          <br /><br /><br />
          <div className="section__content section__content--fluid-width section__content--padding--small">
            <div className="grid grid--2col">
              <div className="grid__item partners__slide__grey" style={{ height: 480 }} data-aos="fade-up">
                <h2 className="grid__title"><b>For Students</b></h2>
                <p className="grid__text" style={{ fontSize: 'larger', lineHeight: '150%' }}>
                  • Are you a student in an ENACT course? Contact your professor for the PIN you need to login,
                  create a profile. You will then be able to access all resources, and upload your own work.
                  Already have a profile? Login above to gain full access to the site.
                  <br /><br />
                  • Are you an alum of an ENACT course? If you do not already have a profile, contact{' '}
                  <a href="mailto:enact@brandeis.edu">ENACT@brandeis.edu</a> to request a pin.
                </p>
              </div>
              <div className="grid__item partners__slide__grey" style={{ height: 480 }} data-aos="fade-up">
                <div>
                  <h2 className="grid__title"><b>For Professors</b></h2>
                  <p className="grid__text" style={{ fontSize: 'larger', lineHeight: '135%' }}>
                    • Are you an ENACT Faculty Fellow? Login above to gain full access to the site.
                    <br />
                    • Are you interested in teaching an ENACT course? Contact{' '}
                    <a href="mailto:enact@brandeis.edu">ENACT@brandeis.edu</a>
                  </p>
                </div>
                <div>
                  <h2 className="grid__title"><b>For Public</b></h2>
                  <p className="grid__text" style={{ fontSize: 'larger', lineHeight: '135%' }}>
                    • Are you an interested member of the public? Search publicly available resources created by
                    ENACT students from across the United States. You can browse, enter a keyword in the search
                    box, or search using any or all of the categories below.
                  </p>
                </div>
              </div>
            </div>
            <div className="clear" />
          </div>
        </section>
      )}

      {/* Intro Videos */}
      <section
        id="content-enact-intro-video"
        className={loggedIn ? 'section diagonal-gradient' : 'section section__grey'}
        ref={videoRef}
      >
        <section className="section__content section__content--fix-width">
          <br /><br /><br />
          <h2
            className="section__title section__title--centered"
            style={loggedIn ? { color: 'white' } : {}}
            data-aos="fade-up"
          >
            Intro Videos
          </h2>
          <div className="row">
            <div className="column">
              <h3 style={{ textAlign: 'center', color: loggedIn ? 'white' : undefined }}>What is ENACT?</h3>
              <video style={{ width: 600, height: 400 }} controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Updated+Video+2.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="column">
              <h3 style={{ textAlign: 'center', color: loggedIn ? 'white' : undefined }}>A Brief Tour of enactnetwork.org</h3>
              <video style={{ width: 600, height: 400 }} poster="/images/introVideo.webp" controls>
                <source src="https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <br /><br /><br />
          <div className="text-center" style={{ paddingBottom: loggedIn ? 0 : 0 }}>
            <button className={`btn btn-lg ${loggedIn ? 'btn-light' : 'btn-primary'}`} onClick={() => scrollTo(topRef)}>
              Back to Top
            </button>
          </div>
          <br /><br /><br />
        </section>
      </section>

      <style>{`
        .column { float: left; width: 50%; padding: 10px; }
        .row:after { content: ""; display: table; clear: both; }
        @media screen and (max-width: 1200px) { .column { width: 100%; } }
      `}</style>
    </div>
  );
}
