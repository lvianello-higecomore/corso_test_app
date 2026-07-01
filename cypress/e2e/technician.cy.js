// cypress/e2e/technician.cy.js

// --- HELPER FUNCTIONS ---

function loginAsTechnician() {
  cy.visit('/')
  // Effettuiamo il login come manutentore (tecnico) usando i dati di test
  cy.get('[data-cy="login-username"]').clear().type('giuseppe')
  cy.get('[data-cy="login-password"]').clear().type('Giuseppe2024!')
  cy.get('[data-cy="login-submit"]').click()
  
  // Verifichiamo il corretto reindirizzamento alla dashboard del tecnico
  cy.url().should('include', '/technician')
}

function verifyTicketsSortedDescending() {
  const priorities = [];
  cy.get('[data-cy-priority^="ticket-priority-"]').each(($el) => {
    const match = $el.attr('data-cy-priority').match(/ticket-priority-(alta|media|bassa)/);
    if (match) {
      priorities.push(match[1]);
    }
  }).then(() => {
    cy.log('Priorities found in order:', priorities.join(', '));
    // verify priority order: alta > media > bassa
    for (let i = 0; i < priorities.length - 1; i++) {
      const currentPriority = priorities[i];
      const nextPriority = priorities[i + 1];
      expect(currentPriority).to.be.oneOf(['alta', 'media', 'bassa']);
      expect(nextPriority).to.be.oneOf(['alta', 'media', 'bassa']);
      
      // Check that the current priority is not less important than the next one
      const priorityOrder = { 'alta': 1, 'media': 2, 'bassa': 3 };
      expect(priorityOrder[currentPriority]).to.be.at.most(priorityOrder[nextPriority]);
    }
  });
}

function openFirstTicket() {
  // Clicchiamo sulla prima card dei ticket visibile per aprirne i dettagli
  cy.get('[data-cy^="ticket-card-"]').first().click()
  cy.url().should('include', '/technician/ticket/')
}

function updateTicketStatus(newStatusValue) {
  // Modifichiamo il valore della select e inviamo l'aggiornamento
  cy.get('[data-cy="status-select"]').select(newStatusValue)
  cy.get('[data-cy="update-status-btn"]').click()
}

function verifyNotificationVisible() {
  // Verifichiamo che il banner di notifica di sistema appaia come feedback dell'azione
  cy.get('[data-cy="notification-toast"]').should('be.visible')
}

// --- TEST SUITE ---

describe('Interfaccia Manutentore (Tecnico)', () => {
  beforeEach(() => {
    // Il login e il caricamento iniziale vengono eseguiti prima di ogni singolo test (Standalone)
    loginAsTechnician()
  })

  it('dovrebbe mostrare i ticket assegnati in ordine decrescente di importanza', () => {
    // Questo test verifica che la lista ticket sia ordinata da alta a bassa priorità
    verifyTicketsSortedDescending()
  })

  it('dovrebbe mostrare una notifica cambiando lo stato in "Risolto"', () => {
    openFirstTicket()
    updateTicketStatus('risolto')
    verifyNotificationVisible()
  })

  it('dovrebbe mostrare una notifica cambiando lo stato in "Assistenza Necessaria"', () => {
    openFirstTicket()
    updateTicketStatus('assistenza_necessaria')
    verifyNotificationVisible()
  })

  it('dovrebbe mostrare una notifica cambiando lo stato in "Falso Allarme"', () => {
    openFirstTicket()
    updateTicketStatus('falso_allarme')
    verifyNotificationVisible()
  })
})
