describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3500/');
    });
  
    it('checks the logo in the header', () => {
      cy.get('header.header').within(() => {
        cy.get('.header__logo-title').should('have.attr', 'href', '/')
          .find('img').should('have.attr', 'src', '/images/enact-logo.webp');
      });
    });
  
    it('checks the navbar functionality', () => {
      cy.get('nav').should('be.visible');
      cy.get('#home-link').should('contain', 'Home');
    });
  
    it('checks links available when not logged in', () => {
      // Impact Links
      cy.get('#impact').should('contain', 'Impact').parent().within(() => {
        cy.get('#faculty-research').should('contain', 'Faculty Research');
        cy.get('#in-the-news').should('contain', 'In the News');
      });
  
      // Resources Links
      cy.get('#resources-menu').should('contain', 'Resources').parent().within(() => {
        cy.get('#search-resources').should('contain', 'Search Resources');
      });
  
      // Networking Link
      cy.get('#networking').should('contain', 'Networking');
  
      // Courses & Events Links
      cy.get('#courses-events').should('contain', 'Courses & Events').parent().within(() => {
        cy.get('#course-schedule').should('contain', 'Course Schedule');
        cy.get('#events').should('contain', 'Events');
        cy.get('#news-updates').should('contain', 'News & Updates');
      });
  
      // About Link
      cy.get('#about').should('contain', 'About');

      // Login button
      cy.get('a.header__btn--signup[href="/login"]').should('contain', 'Login').and('have.css', 'background-color', 'rgb(0, 83, 164)');
    });

    it('checks the footer functionality', () => {
        cy.get('footer#footer').should('be.visible');
    // Verify the h5 element by id
    cy.get('h5#footer-cc').should('contain', 'Copyright')
      .and('contain', new Date().getFullYear());
 
      });


  it('checks that all public sections are present and visible', () => {
    // Array of expected section IDs
    const sectionIds = [
      'content-enact-front-intro',
      'content-enact-program-intro',
      'content-enact-public-resources',
      'content-enact-events',
      'content-enact-join-us',
      'content-enact-intro-video',
    ];

    // Loop through each section ID and check that it is visible
    sectionIds.forEach(id => {
      cy.get(`section#${id}`).should('be.visible');
    });
  });
  });
  

  describe('About Page', () => {
    beforeEach(() => {
      // Visit the about page URL, adjust the path as needed
      cy.visit('http://localhost:3500/about');
    });
  
    it('checks all sections with IDs starting with "content-" and their immediate children', () => {
      // Array of expected section IDs
      const sectionIds = [
        'content-about-qoute',
        'content-about-intro',
        'content-about-staff',
      ];
  
      // Loop through each section ID and check for its presence and children
      sectionIds.forEach(id => {
        cy.get(`section#${id}`).should('be.visible');
      });
    });
  });




  describe('Login Page', () => {
    beforeEach(() => {
      // Visit the login page URL (adjust the path as needed)
      cy.visit('http://localhost:3500/login');
    });
  
    it('should have a login form ', () => {
      // Confirm the presence of the login form by checking the form class
      cy.get('form.form-signin').should('be.visible');

    });

    it('should have a login form with email', () => {
      // Confirm the presence of the login form by checking the form class
      cy.get('form.form-signin').should('be.visible');
  
      // Check for the email/username input field
      cy.get('form.form-signin input[name="email"]').should('exist').and('be.visible');
    });

    it('should have a login form with with email and password', () => {
      // Confirm the presence of the login form by checking the form class
      cy.get('form.form-signin').should('be.visible');
  
      // Check for the email/username input field
      cy.get('form.form-signin input[name="email"]').should('exist').and('be.visible');
  
      // Check for the password input field
      cy.get('form.form-signin input[name="password"]').should('exist').and('be.visible');
  
    
    });


    it('should have a login form with with submit', () => {
      // Confirm the presence of the login form by checking the form class
      cy.get('form.form-signin').should('be.visible');
  
      // Check for the email/username input field
      cy.get('form.form-signin input[name="email"]').should('exist').and('be.visible');
  
      // Check for the password input field
      cy.get('form.form-signin input[name="password"]').should('exist').and('be.visible');

       // Check the presence of the "submit" button
       cy.get('form.form-signin input[type="submit"]').should('have.value', 'sign in').and('be.visible');
  
    
    });
  });

  describe('Contact Page', () => {
    beforeEach(() => {
      // Visit the contact page URL, adjust the path as needed
      cy.visit('http://localhost:3500/contact');
    });
  
    it('should display the "Contact Us" title', () => {
      // Verify the presence of the "Contact Us" title in the masthead
      cy.get('div.section__title.section__title--centered').should('contain', 'Contact Us');
    });
  
    it('should display correct contact information', () => {
      // Confirm the ENACT program email link is present
      cy.get('a[href="mailto:enact@brandeis.edu"]').should('contain', 'enact@brandeis.edu');
  
      // Verify the link to the ENACT program page is present
      cy.get('a[href="https://www.brandeis.edu/ethics/ENACT"]').should('contain', 'brandeis.edu/ethics/ENACT');
  
      // Confirm Melissa Stimell's email is present
      cy.get('a[href="mailto:stimell@brandeis.edu"]').should('contain', 'stimell@brandeis.edu');
  
      // Confirm David J. Weinstein's email and contact number are present
      cy.get('a[href="mailto:djw@brandeis.edu"]').should('contain', 'djw@brandeis.edu');
      cy.contains('Number: 781-736-2115').should('be.visible');
    });
  });

  describe('Create Account Page Video and Help Section', () => {
    beforeEach(() => {
      // Visit the page URL, adjust the path as needed
      cy.visit('http://localhost:3500/accountHelp');
    });
  
    it('should display the video for creating an account', () => {
      // Verify that the instructional video is present and has the correct source URL
      cy.get('video').should('have.attr', 'controls');
      cy.get('video source[type="video/mp4"]').should('have.attr', 'src', 'https://enact-resources.s3.us-east-2.amazonaws.com/Create+an+Account+and+Profile+(with+captions).mp4');
    });
  
    it('should contain an element with the id "content-help-section"', () => {
      // Verify that an element with the id "content-help-section" is present
      cy.get('#content-help-section').should('exist').and('be.visible');
    });
  });
  
  
  
  