describe('ChargeGrid E2E', () => {
  it('visits / and verifies login form is visible', () => {
    cy.visit('/')
    cy.get('[data-cy="login-form"]').should('be.visible')
  })

  it('logs in as driver and verifies redirect', () => {
    cy.visit('/')
    cy.get('[data-cy="login-username"]').type('marco')
    cy.get('[data-cy="login-password"]').type('Marco2024!')
    cy.get('[data-cy="login-submit"]').click()
    cy.url().should('include', '/driver')
    cy.get('[data-cy="driver-dashboard"]').should('be.visible')
  })

  it('logs in as operator and verifies redirect', () => {
    cy.visit('/')
    cy.get('[data-cy="login-username"]').clear().type('roberto')
    cy.get('[data-cy="login-password"]').clear().type('Roberto2024!')
    cy.get('[data-cy="login-submit"]').click()
    cy.url().should('include', '/operator')
    cy.get('[data-cy="operator-dashboard"]').should('be.visible')
  })
})
