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

  it('should load the home page', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com');
    cy.title().should('eq', 'Oishi Great - Home');
  });

  it('should navigate to the about page', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com');
    cy.get('#aboutTab').click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/about');
    cy.title().should('eq', 'Oishi Great - About');
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

    // Assuming the form submission redirects or shows a success message, you can check for that
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/location'); // Adjust if there's a redirect
    // Add any success message check here if applicable
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

  it('should load the online shop page and display products', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/onlineshop');
    cy.title().should('eq', 'Oishi Great - Online Shop');
    cy.contains('h1', 'MAIN PRODUCTS');
    cy.get('.imageBox').should('have.length.greaterThan', 0); // Check that products are displayed
  });

  it('should add a product to the cart', () => {
    cy.login('doe@gmail.com', '12345');
    cy.visit('https://oishi-great-stsweng.onrender.com/onlineshop');
    cy.get('.button-30').first().click(); // Click the 'Add to Cart' button of the first product
    cy.get('.bx-cart .numItems').should('contain', '1'); // Check if the cart item count increased
  });

  it('should open the cart pop-up and update cart quantities', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/onlineshop');
    cy.get('.button-30').first().click(); // Add first product to the cart
    cy.get('.bx-cart').click(); // Click the cart icon to open the cart pop-up
    
    // Increase the quantity
    cy.get('.quantity .plus').first().click();
    cy.get('.quantity span').eq(1).should('contain', '3'); // Check if the quantity increased
    
    // Decrease the quantity
    cy.get('.quantity .minus').first().click();
    cy.get('.quantity span').eq(1).should('contain', '2'); // Check if the quantity decreased
  });

  it('should enable the checkout button when there are items in the cart', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/onlineshop');
    cy.get('.button-30').first().click();
    cy.get('.bx-cart').click(); 
    cy.get('.checkOut').should('not.be.disabled');
  });

  it('should proceed to checkout from the cart pop-up and verify order in order history', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/onlineshop');
    cy.get('.button-30').first().click(); 
    cy.get('.bx-cart').click(); 
    cy.get('.checkOut').should('not.be.disabled').click(); 

    // Verify the order in the order history
    cy.visit('https://oishi-great-stsweng.onrender.com/orders');
    cy.get('#billingTable').should('exist');
    cy.get('#billingTable tbody tr').first().within(() => {
      cy.get('td').eq(1).should('contain', 'Thu Aug 01 2024'); // Check Date
      cy.get('td').eq(3).should('contain', 'Pending'); // Check Status
    });
  });

  it('should log out successfully', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com');
    cy.get('#userIcon').click(); // Click on the user icon to reveal the dropdown
    cy.get('#dropdownContent').invoke('show'); // Make the dropdown visible
    cy.get('#logoutLink').click(); // Click the logout link
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/login'); // Ensure redirection to the home page
    cy.contains('Login'); // Check that the user is logged out and the login link is visible
  });
});
