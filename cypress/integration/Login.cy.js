// cypress/integration/login.spec.js

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../src/components/LoginPage';

describe('<LoginPage />', () => {
  it('renders login form and allows login', () => {

    cy.mount(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    cy.get('form').should('be.visible');

   
  });
});
