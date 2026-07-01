const loginAsAdmin = function() {
  cy.visit('/')
  cy.get('[data-cy="login-username"]').clear().type('admin');
  cy.get('[data-cy="login-password"]').clear().type('Admin2024!');
  cy.get('[data-cy="login-submit"]').click();
}

describe('Richieste stakeholder', () => {

});