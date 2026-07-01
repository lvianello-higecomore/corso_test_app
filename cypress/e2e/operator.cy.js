// cypress/e2e/operator.cy.js

// --- HELPER FUNCTIONS ---

function loginAsOperator() {
  cy.visit('/')
  cy.get('[data-cy="login-username"]').clear().type('roberto')
  cy.get('[data-cy="login-password"]').clear().type('Roberto2024!')
  cy.get('[data-cy="login-submit"]').click()
  
  cy.url().should('include', '/operator')
}

function verifyNotificationVisible() {
  cy.get('[data-cy="notification-toast"]').should('be.visible')
}

// --- TEST SUITE ---

describe('Interfaccia Operatore di Sistema', () => {
  beforeEach(() => {
    // Il login e il caricamento iniziale vengono eseguiti prima di ogni singolo test (Standalone)
    loginAsOperator()
  })

  it('dovrebbe gestire un ticket di guasto e assegnarlo al manutentore più vicino', () => {
    // Naviga alla pagina di gestione dei ticket
    cy.get('[data-cy="nav-ticket"]').click()
    cy.url().should('include', '/operator/tickets')
    
    // Trova il manutentore più vicino per il primo ticket aperto
    cy.get('[data-cy^="find-nearest-"]').first().click()
    
    // Assegna il ticket al manutentore suggerito
    cy.get('[data-cy^="assign-ticket-"]').first().click()
    
    // Verifica che appaia la notifica di assegnazione del ticket
    verifyNotificationVisible()
  })

  it('dovrebbe ricevere una notifica quando una colonnina è offline da almeno 5 minuti', () => {
    // Mock del tempo — esclude requestAnimationFrame per non bloccare le transizioni Vue
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'])
    
    // Navighiamo alla dashboard in caso non ci fossimo
    cy.get('[data-cy="nav-dashboard"]').click()
    
    // Simuliamo l'offline della prima colonnina disponibile
    cy.get('[data-cy^="simulate-offline-"]').first().click()
    
    // Avanziamo il tempo di oltre 5 minuti (5 * 60 * 1000 = 300000 millisecondi)
    cy.tick(300000)
    
    // Verifica lo stato delle colonnine offline (soglia 5 minuti)
    cy.get('[data-cy="check-offline-btn"]').click()
    
    // Ripristina il clock per non interferire con eventuali animazioni UI del toast
    cy.clock().invoke('restore')
    
    // Verifica che appaia la notifica di segnalazione offline
    verifyNotificationVisible()
  })
})
