import { BrowserRouter as Router } from 'react-router-dom';
import AddInventory from '../../src/components/AddInventory';

describe('AddInventory', () => {
  beforeEach(() => {
    cy.mount(
      <Router>
        <AddInventory />
      </Router>
    );
  });

  it('renders the component', () => {
    cy.get('h6').contains('Add Inventory Item');
  });

  it('renders the form fields', () => {
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="quantity"]').should('exist');
  });

  it('changes the input values when new values are entered', () => {
    cy.get('input[name="name"]').type('New Item');
    cy.get('input[name="quantity"]').type('10');
    
  });

  it('submits the form', () => {
    cy.get('button[type="submit"]').click();
  });
});
