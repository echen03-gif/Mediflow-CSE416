import Rooms from '../../src/components/Rooms';

describe('Rooms', () => {


  it('renders various component', () => {

    cy.mount(<Rooms />)

    cy.get('h4').contains('Room Availability');
   
    cy.get('table').should('exist');
    
  });



  it('renders the correct room data', () => {

    cy.mount(<Rooms />)

    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', '0');
      cy.get('td').eq(1).should('contain', 'Radiology');
    });
  });

  it('changes the date when a new date is picked', () => {
    // Get the date picker
    cy.mount(<Rooms />)
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
