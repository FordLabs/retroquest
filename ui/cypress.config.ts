import { defineConfig } from 'cypress';

const {
	addMatchImageSnapshotPlugin,
} = require('@simonsmith/cypress-image-snapshot/plugin');

export default defineConfig({
	downloadsFolder: 'cypress/downloads',
	screenshotsFolder: 'cypress/artifacts/screenshots',
	video: false,
	chromeWebSecurity: false,
	viewportWidth: 1200,
	viewportHeight: 1000,
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
		setupNodeEvents(on, config) {
			// implement node event listeners here
			addMatchImageSnapshotPlugin(on, config);
		},
	},
});
