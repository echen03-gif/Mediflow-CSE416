import { BrowserRouter } from 'react-router-dom';
import Inventory from '../../src/components/Inventory';

describe('Inventory', () => {
  beforeEach(() => {
    cy.mount(
        <BrowserRouter>
        <Inventory />
        </BrowserRouter>);
  });

  it('renders the component', () => {
    cy.get('h4').contains('Inventory');
  });

  it('renders the date picker', () => {
    cy.get('label').contains('Date');
    cy.get('input[type="date"]').should('exist');
  });

  it('renders the table', () => {
    cy.get('table').should('exist');
  });

 
});
