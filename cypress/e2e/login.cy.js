describe('Login Page Tests', () => {
  it('successfully logs in a user', () => {
    cy.visit("https://mediflow-lnmh.onrender.com/login");

    // Fill in the username and password fields
    // The labels are associated with the input fields via the id attribute that Material-UI generates
    cy.contains('label', 'Username').parent().find('input').type('testDoctor@gmail.com');
    cy.contains('label', 'Password').parent().find('input').type('testpassword');

    // Click the login button to submit the form
    // Assuming the text of the button is unique enough to identify it
    cy.contains('button', 'Login').click();

    // Optional: add assertions to check if the navigation has occurred or if there's a login error
    cy.url().should('include', '/main/schedule'); // Checks if the URL includes the given string
    // OR

    cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Inventory').click();
    cy.url().should('include', '/main/inventory');
    

    cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Staff').click();
    cy.url().should('include', '/main/staff');

    cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Rooms').click();
    cy.url().should('include', '/main/rooms');

    cy.get(':nth-child(6) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').contains('Inbox').click();
    cy.url().should('include', '/main/inbox');
    
  });

  
});
