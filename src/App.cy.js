import App from "./App.js"

describe('<App />', () => {
    it('renders app and checks login page is present', () => {
        
        cy.mount(<App />);
    
        cy.get('h5').should('contain', 'Welcome Back, Login.');
        cy.get('form').should('be.visible');
      });

})