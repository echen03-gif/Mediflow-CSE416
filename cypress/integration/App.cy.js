import App from "../../src/App"
import LoginPage from '../../src/components/LoginPage';

describe('<App />', () => {
    it('renders app and checks login page is present', () => {
        
        cy.mount(<App />);
    
        cy.get('h5').should('contain', 'Welcome Back');
        cy.get('form').should('be.visible');
      });

})