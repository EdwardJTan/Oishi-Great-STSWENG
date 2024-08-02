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

    cy.visit('https://oishi-great-stsweng.onrender.com/orders');
    cy.get('#billingTable').should('exist');
    cy.get('#billingTable tbody tr').first().within(() => {
      cy.get('td').eq(1).should('contain', 'Fri Aug 02 2024'); 
      cy.get('td').eq(3).should('contain', 'Pending'); 
    });
  });

  it('should log out successfully', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com');
    cy.get('#userIcon').click(); 
    cy.get('#dropdownContent').invoke('show'); // Make the dropdown visible
    cy.get('#logoutLink').click(); 
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/login'); 
    cy.contains('Login'); 
  });

  it('should update the account details successfully', () => {
    cy.visit('https://oishi-great-stsweng.onrender.com/editaccountdetails');

    cy.get('input[name="firstName"]').clear().type('Jane');
    cy.get('input[name="lastName"]').clear().type('Smith');
    cy.get('input[name="username"]').clear().type('janesmith'); 

    cy.get('button').contains('Save Changes').click();

    //Check if form fields have been updated
    cy.visit('https://oishi-great-stsweng.onrender.com/editaccountdetails');
    cy.get('input[name="firstName"]').should('have.value', 'Jane');
    cy.get('input[name="lastName"]').should('have.value', 'Smith');
    cy.get('input[name="username"]').should('have.value', 'janesmith');
  });

});

describe('Sidebar Navigation Tests', () => {
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
    cy.visit('https://oishi-great-stsweng.onrender.com/myaccount');
  });

  it('should navigate to dashboard', () => {
    cy.get('.sidebar a.dashboard').click();
    cy.url().should('include', '/myaccount');
  });

  it('should navigate to orders page', () => {
    cy.get('.sidebar a.orders').click();
    cy.url().should('include', '/orders');
    cy.contains('Order History');
  });

  it('should navigate to addresses page', () => {
    cy.get('.sidebar a.addresses').click();
    cy.url().should('include', '/useraddress');
  });

  it('should navigate to payment methods page', () => {
    cy.get('.sidebar a.payment-methods').click();
    cy.url().should('include', '/payment');
    cy.contains('Payment Methods');
  });

  it('should navigate to account', () => {
    cy.get('.sidebar a.account-details').click();
    cy.url().should('include', '/editaccountdetails');
  });

  it('should log out successfully from the sidebar', () => {
    cy.get('.sidebar').within(() => {
      cy.get('.logout').click(); 
    });

    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/login'); 
    cy.contains('Login'); 
  });
});

describe('Dashboard Navigation Tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // Clear cookies and local storage before each test to ensure a fresh session
    cy.clearCookies();
    cy.clearLocalStorage();

    // Log in before each test and go to my account page
    cy.login('doe@gmail.com', '12345');
    cy.visit('https://oishi-great-stsweng.onrender.com/myaccount');
  });
  
  it('should send the user to the users order history', () => {
    cy.contains('Orders');
    cy.get("[onclick=\"window.location.href='/orders'\"]").click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/orders');
    cy.contains('Order History');
  })

  it('should send the user the user address', () => {
    cy.contains('Addresses');
    cy.get("[onclick=\"window.location.href='/useraddress'\"]").click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/useraddress');
    cy.contains('BILLING ADDRESS');
    cy.contains('SHIPPING ADDRESS');
  })

  it('should send the user to the payment methods', () => {
    cy.contains('Payment Methods');
    cy.get("[onclick=\"window.location.href='/payment'\"]").click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/payment');
    cy.contains('Payment Methods');
  })
  
  it('should send the user to account details', () => {
    cy.contains('Account Details');
    cy.get("[onclick=\"window.location.href='/editaccountdetails'\"]").click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/editaccountdetails');
    cy.contains('Password change');
  });

  it('should logout the user using the logout option in the user dashboard', () => {
    cy.contains('Logout');
    cy.get('.account-options > #logoutLink').click();
    cy.url().should('eq', 'https://oishi-great-stsweng.onrender.com/login');
    cy.contains('Login');
  });
});
