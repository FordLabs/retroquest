import { defineConfig } from 'cypress';
import BrowserLaunchOptions = Cypress.BrowserLaunchOptions;

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
		// @ts-ignore
		mailHogUrl: 'http://localhost:8025',
		setupNodeEvents(on, config) {
			// implement node event listeners here
			addMatchImageSnapshotPlugin(on, config);

			on(
				'before:browser:launch',
				(browser, launchOptions: BrowserLaunchOptions) => {
					if (browser.name === 'chrome' && browser.isHeadless) {
						launchOptions.args.push('--window-size=1200,1000');
						launchOptions.args.push('--force-device-scale-factor=2');
					}

					if (browser.name === 'electron' && browser.isHeadless) {
						launchOptions.preferences.width = 1200;
						launchOptions.preferences.height = 1000;
						launchOptions.preferences.resizable = false;
					}

					if (browser.name === 'firefox' && browser.isHeadless) {
						launchOptions.args.push('--width=1200');
						launchOptions.args.push('--height=1000');
					}

					return launchOptions;
				}
			);
		},
	},
});
