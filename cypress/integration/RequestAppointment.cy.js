import { BrowserRouter as Router } from 'react-router-dom';
import RequestAppointment from '../../src/components/RequestAppointment';

describe('RequestAppointment', () => {
  beforeEach(() => {
    cy.mount(
      <Router>
        <RequestAppointment />
      </Router>
    );
  });

  it('renders the component', () => {
    cy.get('h4').contains('Add Appointment');
  });

  it('renders the form fields', () => {
    cy.get('input[name="patientName"]').should('exist');
    
  });


});
