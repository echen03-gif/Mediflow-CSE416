import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from '../../src/components/MainPage';

describe('MainPage', () => {
  beforeEach(() => {
    cy.mount(
      <Router>
        <MainPage />
      </Router>
    );
  });

  it('renders the component', () => {
    cy.get('h5').contains('MediFlow');
  });

  it('renders the navigation links', () => {
    cy.get('div').contains('Schedule');
    cy.get('div').contains('Inventory');
    cy.get('div').contains('Staff');
    cy.get('div').contains('Rooms');
    cy.get('div').contains('Inbox');
  });

  it('navigates to the  page when the  link is clicked', () => {
    
    cy.get('div').contains('Schedule').click();
    cy.get('div').contains('Rooms').click();
    cy.get('div').contains('Inventory').click();
    cy.get('div').contains('Staff').click();
   
  });


});
