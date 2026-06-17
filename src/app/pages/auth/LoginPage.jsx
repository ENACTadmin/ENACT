import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {

  return (
    <section className="section section__grey" data-aos="fade-up" style={{ height: '140%', paddingTop: '8%' }}>
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Log In</h5>

                {/* POST directly to Express — no need to intercept in React */}
                <form className="form-signin" action="/login" method="post">
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

                  Forgot Password? <a href="/reset">Click here to recover account</a>
                  <br /><br />

                  <input
                    name="submit"
                    className="btn btn-lg btn-primary btn-block text-uppercase"
                    value="sign in"
                    type="submit"
                  />

                  <h5 className="text-center">Or</h5>

                  <a href="/auth/google" className="btn btn-lg btn-warning btn-block text-uppercase">
                    <i className="fa fa-google mr-2" /> Sign in with Google
                  </a>

                  <hr className="my-4" />
                  <h5 className="card-title text-center">Sign Up</h5>
                  <p className="text-center" style={{ marginBottom: '1rem' }}>
                    New ENACT members create a new account below
                  </p>

                  <Link to="/signup" className="btn btn-lg btn-primary btn-block text-uppercase">
                    Sign Up
                  </Link>
                  <br />

                  <p className="text-center" style={{ marginBottom: '1rem' }}>
                    Need Help? Look at our onboarding video
                  </p>
                  <video style={{ width: '100%' }} poster="/images/accountCreation.webp" controls>
                    <source
                      src="https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4"
                      type="video/mp4"
                    />
                  </video>

                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <a href="/accountHelp">Account Help Video Link</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
