import Staff from '../../src/components/Staff';

describe('Staff', () => {
  beforeEach(() => {
    cy.mount(<Staff />);
  });

  it('renders the component', () => {
    cy.get('h4').contains('Staff');
  });

  it('renders the search bar', () => {
    cy.get('label').contains('Search Staff');
    cy.get('input[name="search"]').should('exist');
  });


  it('changes the search input when a new search is entered', () => {
    cy.get('input[name="search"]').as('searchInput');

    let initialSearch;
    cy.get('@searchInput').then(($input) => {
      initialSearch = $input.val();
    });

    cy.get('@searchInput').type('Doctor 1');

    cy.get('@searchInput').should(($input) => {
      expect($input.val()).not.to.eq(initialSearch);
    });
  });
});
