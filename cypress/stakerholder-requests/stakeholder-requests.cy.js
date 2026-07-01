const loginAsOperatore = function() {
  cy.visit('/')
  cy.get('[data-cy="login-username"]').clear().type('giuseppe')
  cy.get('[data-cy="login-password"]').clear().type('Giuseppe2024!')
  cy.get('[data-cy="login-submit"]').click()
}

describe('Richieste stakeholder', () => {

  paymentMethods.forEach((method) => {
    it(`Non mostrare `, () => {
      navigateToFirstAvailableStation()
      startCharging()
      navigateBackToActiveStation()
      stopCharging()
      payWithMethod(method)
      verifyPaymentRecap(method)
    })
  })
})