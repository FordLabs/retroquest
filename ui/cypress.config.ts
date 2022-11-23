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

			on('before:browser:launch', (browser, launchOptions) => {
				if (browser.name === 'chrome' && browser.isHeadless) {
					// fullPage screenshot size is 1200x1000 on non-retina screens
					// and 2800x2400 on retina screens
					launchOptions.args.push('--window-size=1200,1000');

					// force screen to be non-retina (1200x1000 size)
					launchOptions.args.push('--force-device-scale-factor=1');

					// force screen to be retina (2800x2400 size)
					// launchOptions.args.push('--force-device-scale-factor=2')
				}

				if (browser.name === 'electron' && browser.isHeadless) {
					// fullPage screenshot size is 1200x1000
					launchOptions.preferences.width = 1200;
					launchOptions.preferences.height = 1000;
					launchOptions.args.push('--window-size=1200,1000');
					launchOptions.args.push('--force-device-scale-factor=1');
				}

				if (browser.name === 'firefox' && browser.isHeadless) {
					// menubars take up height on the screen
					// so fullPage screenshot size is 1400x1126
					launchOptions.args.push('--width=1200');
					launchOptions.args.push('--height=1000');
				}

				return launchOptions;
			});
		},
	},
});
