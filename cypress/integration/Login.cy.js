import React from 'react';
import LoginPage from '../../src/components/LoginPage';  // Adjust path as necessary
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Mount the component before each test
    cy.mount(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LoginPage />
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  // Page Load Test
  it('should load the login page', () => {
    cy.contains('Welcome Back');
    cy.get('[data-testid="username-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('contain', 'Login');
  });

  // Input Validation Test
  it('should show error message on empty input', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-error"]').should('contain', 'Invalid Input');
  });

  // Successful Login Test
  it('should login successfully with correct credentials', () => {
    // Mocking a successful login response
    cy.intercept('POST', '**/login', { 
      statusCode: 200,
      body: {
        success: true,
        token: 'mocked_token',
        user: 'mocked_user',
        name: 'Mock User',
        profilePic: '/path/to/mock.jpg'
      }
    }).as('loginRequest');

    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      // Simulate navigation check by checking session storage or other side effects
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('token')).to.eq('mocked_token');
      });
    });
  });

  // Failed Login Test
  it('should show error message on failed login', () => {
    // Mocking a failed login response
    cy.intercept('POST', '**/login', { 
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('[data-testid="username-input"]').type('wronguser');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest');
    cy.get('[data-testid="login-error"]').should('contain', 'Error, please try again!');
  });

  // Forgot Password Navigation Test
  it('should navigate to forgot password page', () => {
    cy.get('[data-testid="forgot-password-button"]').click();
    // Simulate navigation by checking the component state or other side effects
    cy.location('pathname').should('eq', '/forgot-password');
  });
});
