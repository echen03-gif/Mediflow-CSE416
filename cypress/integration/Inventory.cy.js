import Inventory from '../../src/components/Inventory';

describe('Inventory', () => {
  beforeEach(() => {
    cy.mount(<Inventory />);
  });

  it('renders the component', () => {
    cy.get('h4').contains('Inventory');
  });

  it('renders the search bar', () => {
    cy.get('label').contains('Search');
    cy.get('input[name="search"]').should('exist');
  });

  it('renders the date picker', () => {
    cy.get('label').contains('Date');
    cy.get('input[type="date"]').should('exist');
  });

  it('renders the table', () => {
    cy.get('table').should('exist');
  });

  it('renders the correct number of rows', () => {
    cy.get('tbody tr').should('have.length', 2);
  });

  it('renders the correct product data', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(1).should('contain', 'CT Machine');
      cy.get('td').eq(2).should('contain', 'Building A');
      cy.get('td').eq(3).should('contain', '1');
      cy.get('td').eq(4).should('contain', 'Radiology');
    });
  });

  it('renders the pagination', () => {
    cy.get('div[role="listbox"]').should('exist');
  });

  it('changes the date when a new date is picked', () => {
    cy.get('input[type="date"]').as('datePicker');

    let initialDate;
    cy.get('@datePicker').then(($input) => {
      initialDate = $input.val();
    });

    cy.get('@datePicker').type('{selectall}2022-12-31');

    cy.get('@datePicker').should(($input) => {
      expect($input.val()).not.to.eq(initialDate);
    });
  });
});
