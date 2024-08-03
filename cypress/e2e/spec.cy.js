describe('Oishi Great Web App E2E Tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // Clear cookies and local storage before each test to ensure a fresh session
    cy.clearCookies();
    cy.clearLocalStorage();

    // Log in before each test
    cy.login('doe@gmail.com', '12345');
  });

  

  it('should navigate to the location page and submit the contact form', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com');
    cy.get('#locTab').click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/location');
    cy.title().should('eq', 'Oishi Great - Location');

    // Fill out and submit the contact form
    cy.get('input[name="Name"]').type('John Doe');
    cy.get('input[name="Contact Number"]').type('1234567890');
    cy.get('textarea[name="Inquiry"]').type('This is a test inquiry.');
    cy.get('input[type="submit"]').click();


    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/location');
  });

   it('should load the login page', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/login');
    cy.contains('header', 'Login');
  });

  it('should successfully log in with valid credentials (doe@gmail.com)', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/login');
    cy.get('input[name="email"]').type('doe@gmail.com');
    cy.get('input[name="password"]').type('12345');
    cy.get('input[type="submit"]').click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/');
    cy.title().should('eq', 'Oishi Great - Home');
  });

  it('should successfully log in with valid credentials (smith@gmail.com)', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/login');
    cy.get('input[name="email"]').type('smith@gmail.com');
    cy.get('input[name="password"]').type('12345');
    cy.get('input[type="submit"]').click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/');
    cy.title().should('eq', 'Oishi Great - Home');
  });

  it('should display an error message for invalid login', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/login');
    cy.get('input[name="email"]').type('invalid-email@example.com');
    cy.get('input[name="password"]').type('invalid-password');
    cy.get('input[type="submit"]').click();
    cy.contains('Invalid email or password');
  });

  

  it('should log out successfully from the sidebar', () => {
    cy.get('.sidebar').within(() => {
      cy.get('.logout').click(); 
    });

    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/login'); 
    cy.contains('Login'); 
  });
});


