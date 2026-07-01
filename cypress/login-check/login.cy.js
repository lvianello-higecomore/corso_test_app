describe('ChargeGrid Login Tests', () => {

  it('Login con Credenziali vuote', () => {
    cy.visit('/Login')
    cy.get('[data-cy="login-username"]').clear()
    cy.get('[data-cy="login-password"]').clear()
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-error"]').should('be.visible')
  });

  it('Login con username errato', () => {
    cy.visit('/Login')
    cy.get('[data-cy="login-username"]').clear().type('cavallo')
    cy.get('[data-cy="login-password"]').clear().type('Roberto2024!')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-error"]').should('be.visible')
  });

  it('Login con password errata', () => {
    cy.visit('/Login')
    cy.get('[data-cy="login-username"]').clear().type('roberto')
    cy.get('[data-cy="login-password"]').clear().type('!')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-error"]').should('be.visible')
  });

  it('Login con password in lower case', () => {
    cy.visit('/Login')
    cy.get('[data-cy="login-username"]').clear().type('roberto')
    cy.get('[data-cy="login-password"]').clear().type('roberto2024!')
    cy.get('[data-cy="login-submit"]').click()
    cy.get('[data-cy="login-error"]').should('be.visible')
  });

});
