import React, { useEffect, useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function toLocalTime(timezone, time) {
  try {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const base = new Date();
    const [h, m] = time.split(':').map(Number);
    base.setHours(h, m, 0, 0);
    const courseStr = base.toLocaleString('en-US', { timeZone: timezone });
    const courseMs = new Date(courseStr).getTime();
    const srcMs = base.getTime();
    const diff = srcMs - courseMs;
    const localMs = base.getTime() + diff;
    return new Date(localMs).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return time;
  }
}

export default function CourseSchedulePage() {
  const [courses, setCourses] = useState([]);
  const [courseTimes, setCourseTimes] = useState([]);
  const [userTz, setUserTz] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    fetch('/api/v0/courses/schedule')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(data => { setCourses(data.courses || []); setCourseTimes(data.courseTimes || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const timesForCourseAndDay = (courseId, day) =>
    courseTimes.filter(ct => String(ct.courseId) === String(courseId) && ct.day === day);

  const asyncCourses = courses.filter(c => c.asynchronous || c.undecided);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-4">Failed to load schedule: {error}</div>;

  return (
    <>
      <section className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">Schedule of Current ENACT Courses</div>
            <h3>
              # course(s) in session: <b><i>{courses.length}</i></b>
            </h3>
            {userTz && (
              <h4>
                Current Timezone: <b><i>{userTz}</i></b> (Course times adjusted to your timezone)
              </h4>
            )}
          </div>
        </div>
      </section>

      <section className="section section__grey">
        <div className="section__content section__content--fluid-width section__content--padding--small">
          <div className="container">
            {/* Day-based grid */}
            <div className="row days-row mb-2">
              {DAYS.map(d => (
                <div key={d} className="col"><h5>{d}</h5></div>
              ))}
            </div>

            {courses.map(course => (
              <div key={course._id} className="row mb-3">
                {DAYS.map(day => {
                  const slots = timesForCourseAndDay(course._id, day);
                  return (
                    <div key={day} className="col">
                      {slots.map((ct, i) => (
                        <div key={i} className="shadow-sm card-body mb-2">
                          <h6 style={{ display: 'inline' }}>{course.courseName}</h6>
                          <br />
                          <a href={`/profile/view/${course.ownerId}`}>{course.instructor}</a>
                          <br />
                          <small>Semester: {course.year} {course.semester}</small>
                          <br />
                          <small>State: {course.state}</small>
                          <br />
                          <small>
                            {toLocalTime(course.timezone, ct.startTime)}
                            {' '}to{' '}
                            {toLocalTime(course.timezone, ct.endTime)}
                          </small>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Async / TBD courses */}
            {asyncCourses.length > 0 && (
              <div className="mt-4">
                <h4 className="text-center">List of Current ENACT Asynchronous/TBD Courses</h4>
                <div className="list-group">
                  {asyncCourses.map(course => (
                    <div key={course._id} className="list-group-item">
                      <h5 className="mb-1">{course.courseName}</h5>
                      <p className="mb-1">Instructor: {course.instructor}</p>
                      <p className="mb-1">Institution: {course.institution}</p>
                      <p className="mb-1">State: {course.state}</p>
                      <small>
                        {course.asynchronous
                          ? 'This course is asynchronous.'
                          : 'Meeting times for this course are to be determined.'}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <br />
            <h5 className="text-center">
              ENACT Courses From Other Semesters:{' '}
              <a href="/courses/pastList">Course List</a>
            </h5>
          </div>
        </div>
      </section>
    </>
  );
}
