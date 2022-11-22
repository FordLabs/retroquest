import { defineConfig } from 'cypress';

const {
	addMatchImageSnapshotPlugin,
} = require('@simonsmith/cypress-image-snapshot/plugin');

export default defineConfig({
	downloadsFolder: 'cypress/downloads',
	screenshotsFolder: 'cypress/artifacts/screenshots',
	video: false,
	chromeWebSecurity: false,
	viewportWidth: 2000,
	viewportHeight: 1484,
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
		setupNodeEvents(on, config) {
			// implement node event listeners here
			addMatchImageSnapshotPlugin(on, config);
		},
	},
});
