describe('End to End Component Testing', () => {

  beforeEach(() => {
    // Restore session before each test
    cy.session('loginSession', () => {
      cy.request('POST', `${Cypress.env('backendUrl')}/login`, {
        username: 'testadmin@gmail.com',
        password: 'testpassword'
      }).then((response) => {
        // Save the token and user ID to session storage
        window.sessionStorage.setItem('token', response.body.token);
        window.sessionStorage.setItem('user', response.body.user);
      });
    });
  });

  it('successfully logs in a user and navigates through pages', () => {
    cy.visit('/main/schedule');

    // Check if login was successful and main page is loaded
    cy.url().should('include', '/main/schedule');

    // Navigate to Inventory page and verify URL
    cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root')
      .contains('Inventory').click();
    cy.url().should('include', '/main/inventory');
    
    // Navigate to Staff page and verify URL
    cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root')
      .contains('Staff').click();
    cy.url().should('include', '/main/staff');

    // Navigate to Rooms page and verify URL
    cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root')
      .contains('Rooms').click();
    cy.url().should('include', '/main/rooms');

    // Navigate to Inbox page and verify URL
    cy.get(':nth-child(6) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root')
      .contains('Inbox').click();
    cy.url().should('include', '/main/inbox');
  });

  it('successfully searches for a staff member', () => {
    cy.visit('/main/staff');
    cy.url().should('include', '/main/staff');
    
    // Enter a search term in the search input
    cy.get('[data-testid="staff-search-input"]').type('testDoctor');

    // Verify the search results
    cy.get('[data-testid="staff-member-testDoctor"]').should('exist');
  });

  it('successfully loads the Rooms page and verifies UI elements', () => {
    cy.visit('/main/rooms');

    // Check if the Rooms page has loaded
    cy.url().should('include', '/main/rooms');
    cy.contains('Room Availability');
    cy.get('#date').should('be.visible');
    cy.get('.css-gcpdnc > .MuiButton-root').should('be.visible');
  });

  it('changes the date and checks room availability indicators', () => {
    cy.visit('/main/rooms');

    // Change the date
    const newDate = '2024-06-15';
    cy.get('#date').invoke('val', '').type(newDate);
    cy.get('#date').should('have.value', newDate);

    // Verify room availability indicators
    cy.get('[data-testid^="room-availability-"]').each(($el) => {
      cy.wrap($el).should('have.css', 'background-color');
    });
  });

  it('navigates to add room page for admin users', () => {
    // Assuming the user is an admin
    cy.visit('/main/rooms');

    // Click Add Room button
    cy.get('.css-gcpdnc > .MuiButton-root').should('be.visible').click();
    cy.url().should('include', '/main/addroom');
  });

  it('successfully loads the Inbox page and verifies UI elements', () => {
    cy.visit('/main/inbox');

    // Check if the Inbox page has loaded
    cy.url().should('include', '/main/inbox');
    cy.contains('Chat Inbox');
    cy.get('[data-testid="general-inbox-tab"]').should('be.visible');
    cy.get('[data-testid="process-inbox-tab"]').should('be.visible');
  });

  it('switches between General and Process Inbox tabs', () => {
    cy.visit('/main/inbox');

    // Switch to Process Inbox
    cy.get('[data-testid="process-inbox-tab"]').click();
    cy.get('[data-testid="process-inbox-tab"]').should('have.css', 'font-weight', '700'); // Check bold font weight
    cy.get('[data-testid="general-inbox-tab"]').should('have.css', 'font-weight', '400'); // Check normal font weight

    // Switch back to General Inbox
    cy.get('[data-testid="general-inbox-tab"]').click();
    cy.get('[data-testid="general-inbox-tab"]').should('have.css', 'font-weight', '700'); // Check bold font weight
    cy.get('[data-testid="process-inbox-tab"]').should('have.css', 'font-weight', '400'); // Check normal font weight
  });

  it('navigates to chat screen on user click', () => {
    cy.visit('/main/inbox');

    // Click on the first user in the list
    cy.get('[data-testid="user-row"]').first().click();
    cy.url().should('include', '/main/chatscreen/');
  });

  it('successfully loads the Profile page and verifies UI elements', () => {
    cy.visit('/main/profile');

    // Check if the Profile page has loaded
    cy.url().should('include', '/main/profile');
    cy.contains('Weekly Schedule');
    cy.get('[data-testid="profile-avatar"]').should('be.visible');
    cy.get('[data-testid="upload-button"]').should('be.visible');
  });


  it('verifies user information', () => {
    cy.visit('/main/profile');

    // Verify user details
    cy.get('[data-testid="user-name"]').should('contain', 'testAdmin');
    cy.get('[data-testid="user-role"]').should('contain', 'admin');
    cy.get('[data-testid="user-email"]').should('contain', 'testadmin@gmail.com');
  });

  it('successfully loads the AddItem page and verifies UI elements', () => {
    cy.visit('/main/additem');

    // Check if the AddItem page has loaded
    cy.url().should('include', '/main/additem');
    cy.contains('Add Equipment');
    cy.get('[data-testid="equipment-id"]').should('be.visible');
    cy.get('[data-testid="name"]').should('be.visible');
    cy.get('[data-testid="type"]').should('be.visible');
    cy.get('[data-testid="status"]').should('be.visible');
    cy.get('[data-testid="location"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
  });

  it('fills out the form fields', () => {
    cy.visit('/main/additem');

    // Fill out the form fields
    cy.get('[data-testid="equipment-id"]').type('12345');
    cy.get('[data-testid="name"]').type('X-Ray Machine');

    cy.get('[data-testid="location"]').type('Room 101');

 
  });

  it('successfully loads the AddRoom page and verifies UI elements', () => {
    cy.visit('/main/addroom');

    // Check if the AddRoom page has loaded
    cy.url().should('include', '/main/addroom');
    cy.contains('Add Room');
    cy.get('[data-testid="room-number"]').should('be.visible');
    cy.get('[data-testid="room-type"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
  });

  it('fills out the form field', () => {
    cy.visit('/main/addroom');

    // Fill out the form fields
    cy.get('[data-testid="room-number"]').type('301');
    cy.get('[data-testid="room-type"]').click().get('[data-value="General"]').click();


  });

  it('successfully loads the AddInventory page and verifies UI elements', () => {
    cy.visit('/main/addinventory');

    // Check if the AddInventory page has loaded
    cy.url().should('include', '/main/addinventory');
    cy.contains('Add Inventory Item');
    cy.get('[data-testid="item-name"]').should('be.visible');
    cy.get('[data-testid="location"]').should('be.visible');
    cy.get('[data-testid="category"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
  });

  it('fills out the form fields', () => {
    cy.visit('/main/addinventory');

    // Fill out the form fields
    cy.get('[data-testid="item-name"]').type('Defibrillator');
    cy.get('[data-testid="category"]').click().get('[data-value="Category 1"]').click();

 
  });
  it('successfully loads the AddStaff page and verifies UI elements', () => {
    cy.visit('/main/addstaff');

    // Check if the AddStaff page has loaded
    cy.url().should('include', '/main/addstaff');
    cy.contains('Add Staff Member');
    cy.get('[data-testid="first-name"]').should('be.visible');
    cy.get('[data-testid="last-name"]').should('be.visible');
    cy.get('[data-testid="email"]').should('be.visible');
    cy.get('[data-testid="password"]').should('be.visible');
    cy.get('[data-testid="date-of-birth"]').should('be.visible');
    cy.get('[data-testid="position"]').should('be.visible');

  });

  it('fills out the form and submits', () => {
    cy.visit('/main/addstaff');

    // Fill out the form fields
    cy.get('[data-testid="first-name"]').type('John');
    cy.get('[data-testid="last-name"]').type('Doe');
    cy.get('[data-testid="email"]').type('johndoe@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="date-of-birth"]').type('1980-01-01');
    cy.get('[data-testid="position"]').click().get('[data-value="Doctor"]').click();
    cy.get('[data-testid="admin-switch"]').click();

    // Fill out shifts
    cy.get('[data-testid="MondayShiftStart"]').type('08:00');
    cy.get('[data-testid="MondayShiftEnd"]').type('16:00');
    cy.get('[data-testid="TuesdayShiftStart"]').type('08:00');
    cy.get('[data-testid="TuesdayShiftEnd"]').type('16:00');

  });

  

});
