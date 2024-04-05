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

  it('changes the date when a new date is picked', () => {
    cy.get('input[type="date"]').as('datePicker');

    let initialDate;
    cy.get('@datePicker').then(($input) => {
      initialDate = $input.val();
    });

    cy.get('@datePicker').type('2022-12-31');

    cy.get('@datePicker').should(($input) => {
      expect($input.val()).not.to.eq(initialDate);
    });
  });
});
