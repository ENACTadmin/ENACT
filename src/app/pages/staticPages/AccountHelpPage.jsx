import React from 'react';

export default function AccountHelpPage() {
  return (
    <>
      <section id="content-help-section" className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">
              How to create a new account
            </div>
          </div>
        </div>
      </section>

      <br />

      <div className="section section__grey" data-aos="fade-up">
        <div className="container">
          <br />
          <h3>Create an Account &amp; Profile</h3>
          <hr />
          <video style={{ width: '100%' }} poster="/images/accountCreation.webp" controls>
            <source
              src="https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4"
              type="video/mp4"
            />
          </video>
          <br /><br />
        </div>
      </div>
    </>
  );
}
