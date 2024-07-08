describe('Oishi Great Website Tests', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Home.html');
  });

  it('should navigate through the navigation bar', () => {
    cy.get('#homeTab .tabsName').click();
    cy.url().should('include', 'Oishi%20Great%20-%20Home.html');

    cy.get('#aboutTab .tabsName').click();
    cy.url().should('include', 'Oishi%20Great%20-%20About.html');

    cy.get('#prodTab .tabsName').click();
    cy.url().should('include', 'Oishi%20Great%20-%20Product.html');

    cy.get('#locTab .tabsName').click();
    cy.url().should('include', 'Oishi%20Great%20-%20Location.html');

    // Navigate to the online shop page
    cy.get('#tabs-icon a').eq(0).click();
    cy.url().should('include', 'Oishi%20Great%20-%20OnlineShop.html');

    // Navigate to the login page
    cy.get('#tabs-icon a').eq(1).click();
    cy.url().should('include', 'Oishi%20Great%20-%20Login.html');
  });

  it('should display Home page content correctly', () => {
    cy.title().should('eq', 'Oishi Great - Home');

    cy.get('.home-intro h1').should('contain.text', 'The Most Reliable Water Refilling Service in Cubao');
    cy.get('.learn-button').click();
    cy.url().should('include', 'Oishi%20Great%20-%20About.html');
  });

  it('should display About page content correctly', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20About.html');
    
    cy.title().should('eq', 'Oishi Great - About');
    cy.get('#history-content h1').should('contain.text', 'History');
    cy.get('#history-content p').should('contain.text', 'Since 2012, Oishi Great is a water refilling service');

    cy.get('#services-content h1').should('contain.text', 'Services');
    cy.get('#services-content p').should('contain.text', 'At Oishi Great, we prioritize the health and safety of our customers');
  });

  it('should display Products page content correctly', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Product.html');

    cy.title().should('eq', 'Oishi Great - Product');
    cy.get('#5gal-img').should('be.visible');
    cy.get('#1000ml-img').should('be.visible');
    cy.get('#500ml-img').should('be.visible');
    cy.get('#350ml-img').should('be.visible');
  });

  it('should display Location page content correctly', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Location.html');

    cy.title().should('eq', 'Oishi Great - Location');
    cy.get('iframe').should('have.attr', 'src').and('include', 'https://www.google.com/maps');

    cy.get('input[name="Name"]').type('Test User');
    cy.get('input[name="Contact Number"]').type('09123456789');
    cy.get('textarea[name="Inquiry"]').type('This is a test inquiry.');
    cy.get('input[type="submit"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Form submitted successfully!');
    });
  });

  it('should display the login form correctly', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Login.html');
    cy.title().should('eq', 'Oishi Great - Home');

    // Check email field
    cy.get('.field.email .input-area input[type="text"]').should('be.visible');
    cy.get('.field.email .input-area .icon.fas.fa-envelope').should('be.visible');
    
    // Check password field
    cy.get('.field.password .input-area input[type="password"]').should('be.visible');
    cy.get('.field.password .input-area .icon.fas.fa-lock').should('be.visible');

    // Check forgot password link
    cy.get('.pass-txt a').should('have.attr', 'href', '#');

    // Check login button
    cy.get('input[type="submit"]').should('be.visible').and('have.value', 'Login');

    // Check signup link
    cy.get('.sign-txt a').should('be.visible').and('have.attr', 'style', 'cursor: pointer;');
  });

  it('should show error messages for empty fields', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Login.html');

    // Try to submit the form without filling in the fields
    cy.get('input[type="submit"]').click();

    // Check error messages
    cy.get('.field.email .error.error-txt').should('contain.text', "Email can't be blank");
    cy.get('.field.password .error.error-txt').should('contain.text', "Password can't be blank");
  });

  it('should allow navigation to signup page', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Login.html');

    // Click the signup link
    cy.get('.sign-txt a').click();
    cy.url().should('include', 'Oishi%20Great%20-%20Signup.html');
  });

  it('should fill and submit the login form', () => {
    cy.visit('http://127.0.0.1:8080/Oishi%20Great%20-%20Login.html');

    // Fill in the email and password fields
    cy.get('.field.email .input-area input[type="text"]').type('test@example.com');
    cy.get('.field.password .input-area input[type="password"]').type('password123');

    // Submit the form
    cy.get('input[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Login successful!');
    });
  });
});
