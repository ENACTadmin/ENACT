import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function EventCard({ event, isPast }) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const fmt = d => d.toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  });

  return (
    <div className="col-md-4 col-sm-12 mb-4">
      <div className="card h-100 shadow-sm">
        {event.imageURL && (
          <img src={event.imageURL} className="card-img-top" alt={event.title}
            style={{ height: 180, objectFit: 'cover' }} />
        )}
        <div className="card-body">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text text-muted" style={{ fontSize: '0.85rem' }}>
            {fmt(start)} &ndash; {fmt(end)}
          </p>
          <p className="card-text">{event.description}</p>
          {event.uri && (
            <a href={event.uri} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm">
              Learn More
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { user } = useAuth();
  const [future, setFuture] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/v0/events')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setFuture(data.future || []); setPast(data.past || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-4">Failed to load events: {error}</div>;

  return (
    <>
      <section className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">ENACT Events</div>
          </div>
        </div>
      </section>

      <section className="section section__grey">
        <div className="section__content section__content--fluid-width section__content--padding--small">
          {future.length > 0 ? (
            <>
              <h3 data-aos="fade-up">Upcoming Events</h3>
              <hr />
              <div className="row">
                {future.map(ev => <EventCard key={ev._id} event={ev} />)}
              </div>
              <br />
            </>
          ) : (
            <div data-aos="fade-up">
              <h3>Upcoming Events</h3>
              <hr />
              <p style={{ fontSize: 'large' }}>No upcoming events at this time.</p>
            </div>
          )}

          {past.length > 0 && (
            <>
              <h3 data-aos="fade-up">Past Events</h3>
              <hr />
              <div className="row">
                {past.map(ev => <EventCard key={ev._id} event={ev} isPast />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
