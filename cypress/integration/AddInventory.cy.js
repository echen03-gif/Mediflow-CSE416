import { BrowserRouter as Router } from 'react-router-dom';
import AddInventory from '../../src/components/mainPage/AddInventory';
import axios from 'axios';

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
  });


  
});
