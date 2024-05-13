describe('Login Page and Navigation Tests', () => {

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
    cy.get('[data-testid="date-input"]').should('be.visible');
    cy.get('[data-testid="add-room-button"]').should('be.visible');
  });

  it('changes the date and checks room availability indicators', () => {
    cy.visit('/main/rooms');

    // Change the date
    const newDate = '2024-06-15';
    cy.get('[data-testid="date-input"]').invoke('val', '').type(newDate);
    cy.get('[data-testid="date-input"]').should('have.value', newDate);

    // Verify room availability indicators
    cy.get('[data-testid^="room-availability-"]').each(($el) => {
      cy.wrap($el).should('have.css', 'background-color').and('match', /(green|red)/);
    });
  });

  // it('navigates to add room page for admin users', () => {
  //   // Assuming the user is an admin
  //   cy.visit('/main/rooms');

  //   // Click Add Room button
  //   cy.get('[data-testid="add-room-button"]').should('be.visible').click();
  //   cy.url().should('include', '/main/addroom');
  // });

});
