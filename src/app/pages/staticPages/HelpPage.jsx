import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function HelpPage() {
  const { user } = useAuth();
  const loggedIn = user?.loggedIn;
  const isFacultyOrAdmin = user?.status === 'faculty' || user?.status === 'admin';

  return (
    <>
      <section className="section">
        <div className="section__content section__content--full-width">
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">Help</div>
          </div>
        </div>
      </section>

      <br />

      <div className="section section__grey" data-aos="fade-up">
        <div className="container">
          {loggedIn ? (
            <div className="row">
              <div className="col-md-3 col-sm-12" />
              <div className="col-md-6 col-sm-12">
                {isFacultyOrAdmin && (
                  <>
                    <h3>Faculty Tutorial</h3>
                    <hr />
                    <video style={{ width: '100%' }} controls>
                      <source
                        src="https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Faculty+Overview+Video.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <br /><br />
                  </>
                )}

                <h3>Intro Videos</h3>
                <hr />
                <video style={{ width: '100%' }} poster="/images/introVideo.webp" controls>
                  <source
                    src="https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4"
                    type="video/mp4"
                  />
                </video>
                <br /><br />

                <h3>Create an Account &amp; Profile</h3>
                <hr />
                <video style={{ width: '100%' }} poster="/images/accountCreation.webp" controls>
                  <source
                    src="https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4"
                    type="video/mp4"
                  />
                </video>
                <br /><br />

                <h3>Uploading ENACT Resource</h3>
                <hr />
                <video style={{ width: '100%' }} controls>
                  <source
                    src="https://enact-resources.s3.us-east-2.amazonaws.com/Uploading+ENACT+Resources+(with+subtitles).mp4"
                    type="video/mp4"
                  />
                </video>
                <br /><br />

                <h3>Viewing and Creating ENACT Events</h3>
                <hr />
                <video style={{ width: '100%' }} controls>
                  <source
                    src="https://enact-resources.s3.us-east-2.amazonaws.com/Viewing+and+Creating+ENACT+Events+(with+subtitles).mp4"
                    type="video/mp4"
                  />
                </video>
                <br /><br />
              </div>
            </div>
          ) : (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <p style={{ fontSize: 'large' }}>
                Please <a href="/login">log in</a> to view the help videos.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
