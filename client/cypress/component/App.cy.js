import React from 'react'
import App from '../../src/App.js'

describe('<App />', () => {
  it('renders', () => {
    
    cy.mount(<App />)
  })
})