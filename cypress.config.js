import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8008',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: false
  }
})
