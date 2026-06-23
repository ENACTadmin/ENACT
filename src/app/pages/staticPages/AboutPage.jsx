import React from 'react';

const ENACT_STAFF = [
  {
    photo: '/images/PhotoForAbout/stimell.webp',
    name: 'Melissa Stimell',
    title: 'Academic Program Director',
    bio: 'Melissa Stimell is a Professor of the Practice in the Legal Studies Program at Brandeis University, and Director of the International Center for Ethics, Justice and Public Life.',
    height: 725,
    imgHeight: 250,
  },
  {
    photo: '/images/PhotoForAbout/DavidWeinstein.webp',
    name: 'David J. Weinstein',
    title: 'Assistant Director',
    bio: 'David Weinstein is Assistant Director of ENACT and Communications for the International Center for Ethics, Justice and Public Life at Brandeis University.',
    height: 725,
    imgHeight: 250,
    delay: 200,
  },
  {
    photo: '/images/PhotoForAbout/JayKaufman.webp',
    name: 'Jay Kaufman',
    title: 'Distinguished Legislative Mentor',
    bio: 'Jay R. Kaufman served in the Massachusetts House of Representatives from 1995 through 2018, and is capping a career in leadership education by launching a new non-profit organization to provide leadership education, mentoring, and professional development support.',
    height: 725,
    imgHeight: 250,
    delay: 400,
  },
  {
    photo: '/images/PhotoForAbout/RobGlover.webp',
    name: 'Rob Glover',
    title: 'Fellow for Course Resources',
    bio: 'Robert W. Glover is an Associate Professor of Political Science and Honors, a joint appointment in the Department of Political Science and the Honors College at the University of Maine.',
    height: 725,
    imgHeight: 250,
    delay: 600,
  },
];

const PLATFORM_STAFF = [
  [
    {
      photo: '/images/PhotoForAbout/TimHickey.webp',
      name: 'Timothy J. Hickey',
      title: 'Technology Advisor (2020.5 - Present)',
      bio: 'Timothy J. Hickey is a Professor of Computer Science and Chair of Computer Science at Brandeis University.',
      delay: 200,
    },
    {
      photo: '/images/PhotoForAbout/HanyuDu.webp',
      name: 'Hangyu Du',
      title: 'Software Developer (2020 - 2021)',
      bio: 'Hangyu Du is one of the core developers of this digital platform. He is a fan of machine learning. He also enjoys coding and creating end-to-end user-interface programs from scratch.',
      delay: 400,
    },
    {
      photo: '/images/PhotoForAbout/HuiyanZhang.webp',
      name: 'Huiyan Zhang',
      title: 'Software Developer (2020 - 2021)',
      bio: 'Huiyan Zhang is one of the core developers of this platform. She developed several core functions.',
      delay: 600,
    },
  ],
  [
    {
      photo: '/images/PhotoForAbout/ElainaPevide.webp',
      name: 'Elaina Pevide',
      title: 'Student Delegate (2020.5 - Present)',
      bio: 'Elaina Pevide is the ENACT student delegate.',
      delay: 800,
    },
    {
      photo: '/images/PhotoForAbout/EmilyFishman.webp',
      name: 'Emily Fishman',
      title: 'Resource Support (2020.10 - Present)',
      bio: 'Emily Fishman provides resource support for the ENACT platform. She participated in the ENACT course at Brandeis University in Spring 2020. Emily is interested in global health and health policy.',
      delay: 0,
    },
    {
      photo: '/images/PhotoForAbout/BeneeHershon.webp',
      name: 'Benée Hershon',
      title: 'Resource Support (2020.10 - Present)',
      bio: 'Benée Hershon is resource support for this platform. Benée participated in the ENACT course at Brandeis University in Spring 2020. She currently works in the Sustainable Agriculture field and is interested in environmental policy.',
      delay: 200,
    },
  ],
  [
    {
      photo: '/images/PhotoForAbout/LouisePei.webp',
      name: 'Louise Pei',
      title: 'Software Developer (2021.1 - present)',
      bio: 'Louise Pei is one of the core developers of this digital platform. Louise loves website development, and has helped with website maintenance.',
      delay: 400,
    },
    {
      photo: '/images/PhotoForAbout/AaronPortman.webp',
      name: 'Aaron Portman',
      title: 'Software Developer (2021.4 - 2021.7)',
      bio: 'Aaron Portman is the student developer of this platform.',
      delay: 600,
    },
    {
      photo: '/images/PhotoForAbout/BishalBaral.webp',
      name: 'Bishal Baral',
      title: 'Software Developer (2021.12 - present)',
      bio: 'Bishal is one of the core developers of this platform. He enjoys building software and writing efficient programs.',
      delay: 600,
    },
  ],
  [
    {
      photo: '/images/PhotoForAbout/KiyaGedamu.webp',
      name: 'Kiya Gedamu',
      title: 'Software Engineer (2026.5 - present)',
      bio: 'Kiya is a Software Engineer on the ENACT digital platform team.',
      delay: 0,
    },
    {
      photo: '/images/PhotoForAbout/NayeliNaranjo.webp',
      name: 'Nayeli Naranjo',
      title: 'Software Engineer (2026.6 - present)',
      bio: 'Nayeli is a Software Engineer on the ENACT digital platform team.',
      delay: 200,
    },
  ],
];

function StaffCard({ member, imgHeight = 100, cardHeight = 525 }) {
  return (
    <div
      className="partners__slide grid__item"
      style={{ height: cardHeight }}
      data-aos="fade-up"
      data-aos-delay={member.delay || 0}
    >
      <div className="card-body" style={{ borderRadius: 30 }}>
        <img
          className="d-flex mr-3"
          src={member.photo}
          alt={member.name}
          style={{ width: '100%', height: imgHeight, objectFit: 'contain' }}
        />
        <br />
        <h4 style={{ textAlign: 'center' }}>{member.name}</h4>
        <h5 style={{ textAlign: 'center' }}>{member.title}</h5>
        <hr />
        <p style={{ fontSize: 'larger' }}>{member.bio}</p>
        <br />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero quote */}
      <section id="content-about-quote" className="section">
        <div className="section__content section__content--full-width" style={{ height: 300 }}>
          <div className="jumbotron masthead text-center">
            <div className="section__title section__title--centered">About US</div>
            <h3>
              "The most important office, and the one which all of us can and should fill, is that of
              private citizen."
              <br />– Louis D. Brandeis
            </h3>
          </div>
        </div>
      </section>

      {/* Mission, intro videos, about, model, connect, funders, history */}
      <section id="content-about-intro" className="section section__grey">
        <br /><br />
        <div className="section__content section__content--fluid-width section__content--padding--small">

          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>MISSION</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            ENACT is a non-partisan program, based at{' '}
            <a href="https://www.brandeis.edu">Brandeis University</a>, addressing challenges to
            American democracy by engaging young people around the country in state-level legislative
            change based on a shared commitment to knowledge, cooperation, justice and integrity.
          </p>

          <br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>INTRO VIDEOS</b></h3>
          <hr data-aos="fade-up" />
          <div className="grid--2col">
            <div className="grid__item">
              <h3 data-aos="fade-up" style={{ textAlign: 'center' }}>What is ENACT?</h3>
              <video style={{ width: 600, height: 400 }} controls>
                <source
                  src="https://enact-resources.s3.us-east-2.amazonaws.com/ENACT+Updated+Video+2.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="grid__item">
              <h3 data-aos="fade-up" style={{ textAlign: 'center' }}>A Brief Tour of enactnetwork.org</h3>
              <video style={{ width: 600, height: 400 }} poster="/images/introVideo.webp" controls>
                <source
                  src="https://enact-resources.s3.us-east-2.amazonaws.com/Getting+to+Know+Enact+(With+Captions).mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          <br /><br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>ABOUT</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            Is government dysfunctional? Can change come through the legislative process? Brandeis
            University namesake Louis D. Brandeis suggested that the states can be "laboratories of
            democracy." ENACT: The Educational Network for Active Civic Transformation, a national
            program based at Brandeis University's{' '}
            <a href="https://www.brandeis.edu/ethics/">
              International Center for Ethics, Justice and Public Life
            </a>
            , takes inspiration in part from that idea.
            <br /><br />
            At the core of ENACT are courses taught by{' '}
            <a href="/profiles/view/faculty">ENACT Faculty Fellows</a> at colleges and universities
            across the country, supported by a national in-person and online network connecting the
            faculty and staff in those courses with each other. Students learn through direct
            engagement in the work of advancing legislation: researching the issues being debated,
            meeting with community organizations, and traveling to the state capital to meet with
            legislators. They develop sophisticated understandings of the political domain, learn to
            distill political information, and acquire political efficacy. Many ENACT alumni go on to
            pursue public service and public office.
            <br /><br />
            Participating schools represent a diverse range of higher education institutions. They are
            linked through an online network that enhances student learning, connects them with people
            active in the field, and provides an opportunity for ENACT faculty and students to inspire
            and instruct others who are committed to engaging in effective, ethical state-level
            legislative change.
          </p>

          <br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>THE ENACT MODEL</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            <b>- Workshop:</b> Under the leadership of the program's academic director, ENACT Fellows
            meet in person to share ideas and work on course development. In-person and virtual
            meetings continue on an ongoing basis.
            <br /><br />
            <b>- Courses:</b> In ENACT courses undergraduates learn about the legislative process at
            the state level, with a substantial hands-on component in which they engage directly in
            that process. See the full list of{' '}
            <a href="https://www.brandeis.edu/ethics/enact/people/faculty-fellows.html">
              ENACT schools.
            </a>
            <br /><br />
            <b>- Online Network:</b> The enactnetwork.org digital resource sharing platform is a key
            component of the ENACT Network, a national in-person and online network of students,
            faculty, activists and legislators.
            <br /><br />
            <b>- Other Initiatives:</b> ENACT supports pilot projects and other initiatives related to
            its mission. For example, in 2019-20 ENACT partnered with the Heller School for Social
            Policy and Management to pilot the{' '}
            <a href="https://www.brandeis.edu/ethics/ENACT/enactlabornetwork.html">
              ENACT Labor Network
            </a>
            .
          </p>

          <br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>HOW TO CONNECT</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            Join our mailing list for news and updates: email request to{' '}
            <a href="mailto:ENACT@brandeis.edu">ENACT@brandeis.edu</a>
            <br />
            - Follow us on Twitter:{' '}
            <a href="https://twitter.com/enactnational">@ENACTnational</a>
            <br />
            - Explore resources at{' '}
            <a href="https://www.ENACTnetwork.org">www.ENACTnetwork.org</a>
          </p>

          <br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>FUNDERS</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            ENACT was made possible by a generous gift from International Center for Ethics, Justice
            and Public Life Board member Norbert Weissberg and his wife, former Board member Judith
            Schneider. ENACT has also received support from the Rice Family Foundation, and from
            Ethics Center Board member Mark Friedman. In 2019, ENACT was awarded a multi-year grant
            from the Teagle Foundation's "Education for American Civic Life" initiative.
          </p>

          <br /><br />
          <h3 data-aos="fade-up" style={{ fontWeight: 500 }}><b>HISTORY</b></h3>
          <hr data-aos="fade-up" />
          <p style={{ fontSize: 'x-large' }} data-aos="fade-up">
            In the spring semester of the 2009-10 academic year, Melissa Stimell, Professor of the
            Practice in Legal Studies at Brandeis University embarked on an experiment with 13
            dedicated Brandeis University undergraduate students and the logistical, financial and
            intellectual support of the International Center for Ethics, Justice and Public Life, and
            the Legal Studies Program at Brandeis University.
            <br /><br />
            Together they created "Advocacy for Policy Change," a course, that combines an
            investigation of the ethical dilemmas that arise in the process of lawmaking with
            hands-on advocacy work at the state level.
            <br /><br />
            In 2015 a generous gift from International Center for Ethics, Justice and Public Life
            Board member Norbert Weissberg and his wife, former Board member Judith Schneider, enabled
            the national expansion of this course. This new program,{' '}
            <a href="https://www.brandeis.edu/ethics/ENACT/index.html">
              ENACT: The Educational Network for Active Civic Transformation
            </a>
            , built upon the original vision for the Center, which was inspired and supported by
            Abraham Feinberg, the father of Judith Schneider.
            <br /><br />
            Brandeis has now helped to launch programs in{' '}
            <a href="https://www.brandeis.edu/ethics/ENACT/ENACTschools.html">
              colleges and universities located in or near state capitals across the United States
            </a>
            , and has built a national network of students, faculty, activists and legislators.
          </p>
        </div>
      </section>

      {/* Staff section */}
      <section id="content-about-staff" className="section diagonal-gradient">
        <div className="section__content section__content--fluid-width section__content--padding">
          <h2 className="section__title section__title--centered" style={{ color: 'whitesmoke' }}>
            ENACT Staff
          </h2>
          <br />

          {/* Core staff — 4-col grid */}
          <div className="grid grid--4col">
            {ENACT_STAFF.map(m => (
              <StaffCard key={m.name} member={m} imgHeight={m.imgHeight} cardHeight={m.height} />
            ))}
          </div>
          <div className="partners__pagination" />
          <div className="clear" />

          <br /><br /><br /><br />
          <h2 className="section__title section__title--centered" style={{ color: 'whitesmoke' }}>
            ENACT Digital Platform Staff
          </h2>
          <br />

          {/* Platform staff — 3-col grids per era */}
          {PLATFORM_STAFF.map((group, gi) => (
            <React.Fragment key={gi}>
              <div className="grid grid--3col">
                {group.map(m => (
                  <StaffCard key={m.name} member={m} />
                ))}
              </div>
              <div className="partners__pagination" />
              <div className="clear" />
              <br /><br /><br /><br />
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
}
