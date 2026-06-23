import React from 'react';

export default function ContactPage() {
  return (
    <>
      <section className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">Contact Us</div>
          </div>
        </div>
      </section>

      <br />

      <div className="section section__grey" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-sm-12" />
            <div className="col-md-8 col-sm-12">
              <h2>ENACT program contacts</h2>
              <hr />
              <p style={{ fontSize: 20 }}>
                For <b>technical assistance and general inquiries</b>, please email:{' '}
                <a href="mailto:enact@brandeis.edu">enact@brandeis.edu</a>
                <br />
                For more information about ENACT, checkout at:{' '}
                <a href="https://www.brandeis.edu/ethics/ENACT">https://www.brandeis.edu/ethics/ENACT</a>
              </p>
              <br />

              <h2>Melissa Stimell</h2>
              <hr />
              <p style={{ fontSize: 20 }}>
                Melissa Stimell is a Professor of the Practice in the Legal Studies Program at Brandeis
                University, and Director of the International Center for Ethics, Justice and Public Life.
                <br />
                Email: <a href="mailto:stimell@brandeis.edu">stimell@brandeis.edu</a>
              </p>
              <br />

              <h2>David J. Weinstein</h2>
              <hr />
              <p style={{ fontSize: 20 }}>
                David Weinstein is Assistant Director of ENACT and Communications for the International
                Center for Ethics, Justice and Public Life at Brandeis University.
                <br />
                Email: <a href="mailto:djw@brandeis.edu">djw@brandeis.edu</a>
                <br />
                Number: 781-736-2115
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
