// cypress/e2e/payments.cy.js

// --- HELPER FUNCTIONS ---

function loginAsDriver() {
  cy.visit('/')
  // Assicurati che lo stato venga resettato se il server non è riavviato (ma stiamo simulando un test E2E classico)
  // Per sicurezza, puliamo i campi e facciamo login
  cy.get('[data-cy="login-username"]').clear().type('marco')
  cy.get('[data-cy="login-password"]').clear().type('Marco2024!')
  cy.get('[data-cy="login-submit"]').click()
  cy.url().should('include', '/driver')
}

function navigateToFirstAvailableStation() {
  // Filtriamo per le colonnine disponibili per avere certezza di trovarne una libera
  cy.get('[data-cy="filter-disponibili"]').click()
  
  // Clicchiamo la prima colonnina disponibile (selezioniamo per data-cy che inizia con station-card)
  cy.get('[data-cy^="station-card-"]').first().click()
}

function startCharging() {
  // Clicchiamo il bottone di avvio
  cy.get('[data-cy="start-charging-btn"]').click()
  
  // Verifichiamo di essere tornati alla dashboard (o attendiamo che l'URL includa /driver)
  cy.url().should('match', /\/driver$/)
}

function navigateBackToActiveStation() {
  // Clicchiamo sul pulsante "Gestisci" del banner di sessione attiva
  cy.contains('Gestisci').first().click()
}

function stopCharging() {
  // Interrompiamo la ricarica
  cy.get('[data-cy="stop-charging-btn"]').click()
  
  // Verifichiamo di essere stati reindirizzati al riepilogo di pagamento
  cy.url().should('include', '/driver/payment/')
}

function payWithMethod(method) {
  // Selezioniamo il metodo di pagamento specificato
  cy.get(`[data-cy="payment-method-${method.toLowerCase()}"]`).click()
  
  // Effettuiamo il pagamento
  cy.get('[data-cy="pay-btn"]').click()
  
  // Verifichiamo il messaggio di successo
  cy.get('[data-cy="payment-success"]').should('be.visible')
  
  // Attendiamo che il redirect automatico ci riporti alla dashboard (timeout aumentato per il setTimeout di 3s)
  cy.url({ timeout: 5000 }).should('match', /\/driver$/)
}

function verifyPaymentRecap(method) {
  // Verifichiamo che l'ultima sessione nella cronologia mostri il metodo di pagamento corretto
  cy.get('[data-cy="session-history"] table tbody tr').first().within(() => {
    cy.get('td').eq(4).should('contain', `Pagato con ${method}`)
  })
}

// --- TEST SUITE ---

describe('Flusso di pagamento ricarica', () => {
  const paymentMethods = ['Mastercard', 'Visa', 'PayPal', 'Klarna', 'Satispay', 'SumUp']

  beforeEach(() => {
    // Eseguiamo il login come automobilista prima di ogni test
    loginAsDriver()
  })

  paymentMethods.forEach((method) => {
    it(`dovrebbe permettere una ricarica completa e il pagamento con ${method}`, () => {
      navigateToFirstAvailableStation()
      startCharging()
      navigateBackToActiveStation()
      stopCharging()
      payWithMethod(method)
      verifyPaymentRecap(method)
    })
  })
})
