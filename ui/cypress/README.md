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

### Start the email interceptor:

We use [cypress-mailhog](https://github.com/SMenigat/cypress-mailhog#readme) in order to intercept and
test emails sent from RetroQuest within the Cypress tests. You will need to have docker setup for this.

See https://docs.docker.com/ in order to install docker if not already setup on your machine.

From the cypress folder:

```bash
# to start mailhog
docker-compose up
```

```bash
# to stop mailhog
docker-compose down
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
