# RetroQuest Cypress Tests

This will show you how to properly set up and run the Cypress e2e tests.

## Setup and run:


### Start the API:
From the root directory:
```bash
# in-memory database
SPRING_PROFILES_ACTIVE=local,e2e-test ./gradlew bootRun withH2
```

### Start the frontend application:

From the ui folder:

```bash
# install and start up front-end app
npm install && npm run start
```

### Run Cypress tests:

From the ui folder:

```bash
# Run end-to-end tests in headless mode:
npm run cy:run
```
```bash
# Run end-to-end tests in supervised mode (good for troubleshooting):
npm run cy:open
```
