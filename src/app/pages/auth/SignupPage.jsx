import React from 'react';

export default function SignupPage() {
  return (
    <section className="section section__grey" data-aos="fade-up" style={{ height: '100%', paddingTop: '8%' }}>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Sign Up</h5>

                {/* POST directly to Express auth route */}
                <form className="form-signin" action="/signup" method="post">
                  <div className="form-label-group">
                    <input
                      type="text"
                      name="email"
                      id="Username"
                      className="form-control"
                      placeholder="Username"
                      required
                      autoFocus
                    />
                    <label htmlFor="Username">Email</label>
                  </div>

                  <div className="form-label-group">
                    <input
                      type="password"
                      name="password"
                      id="inputPassword"
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="inputPassword">Password</label>
                  </div>
                  <br />

                  <input
                    name="submit"
                    className="btn btn-lg btn-primary btn-block text-uppercase"
                    value="sign up"
                    type="submit"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
