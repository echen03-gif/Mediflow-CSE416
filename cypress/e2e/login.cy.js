describe('Login Page and Navigation Tests', () => {
  it('successfully logs in a user and navigates through pages', () => {
    cy.visit("https://mediflow-lnmh.onrender.com/login");

    // Fill in the username and password fields
    cy.contains('label', 'Username').parent().find('input').type('testDoctor@gmail.com');
    cy.contains('label', 'Password').parent().find('input').type('testpassword');

    // Click the login button to submit the form
    cy.contains('button', 'Login').click();

    // Check if login was successful
    cy.url().should('include', '/main/schedule');

    // Navigate to Inventory page and verify URL
    cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Inventory').click();
    cy.url().should('include', '/main/inventory');
    
    // Navigate to Staff page and verify URL
    cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Staff').click();
    cy.url().should('include', '/main/staff');

    // Navigate to Rooms page and verify URL
    cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Rooms').click();
    cy.url().should('include', '/main/rooms');

    // Navigate to Inbox page and verify URL
    cy.get(':nth-child(6) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Inbox').click();
    cy.url().should('include', '/main/inbox');
  });

  it('searches for a staff member on the Staff page', () => {
    // Visit the staff page directly if not already there
    cy.visit('https://mediflow-lnmh.onrender.com/main/staff');

    // Enter a search term in the search input
    cy.get('[data-testid="staff-search-input"]').type('Dr. John Doe');

    // Verify the search results
    cy.get('[data-testid="staff-member-Dr. John Doe"]').should('exist');
  });
});
