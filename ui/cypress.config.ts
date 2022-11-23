import { defineConfig } from 'cypress';

export default defineConfig({
	downloadsFolder: 'cypress/downloads',
	screenshotsFolder: 'cypress/artifacts/screenshots',
	videosFolder: 'cypress/artifacts/videos',
	videoUploadOnPasses: false,
	chromeWebSecurity: false,
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
	},
});
