import { defineConfig } from 'cypress';

export default defineConfig({
	downloadsFolder: 'cypress/downloads',
	chromeWebSecurity: false,
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
	},
});
