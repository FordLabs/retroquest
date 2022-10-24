# RetroQuest UI

> The RetroQuest UI is developed using the [React Framework](https://reactjs.org/).

---
## Dependencies
- NodeJS.
	- Version 16 and newer is supported.
- Npm or Yarn

---

## Running Package Scripts

For the purpose of this documentation, we will assume you are using [Node Package manager](https://www.npmjs.com/), but
the commands are very similar using [Yarn Package Manager](https://yarnpkg.com/).

---

### Starting the Development Server

From the `./ui` directory run the following commands.

Install:
```
npm install
```

Start:

This command will start the server. Navigate to http://localhost:3000/ to begin interacting with the
retroquest app. The app will automatically reload if you change any of the source files.

This will also set up a proxy to direct all requests to localhost:8080 where the api is running.

```
npm run start
```

Build:

This will place the compiled output into the `api/src/main/resources/static` and will be bundled in the next backend
build.

```
npm run build
```

---
### Testing Strategy
Engineers are encouraged to follow a "test-first" or test driven development approach
to ensure confidence that the application works after a code change is made.

This code base incorporates the following types of testing:
- Unit - confirms that an isolated block of code works properly
- End to End - Simulates a user executing common tasks in a browser

#### Unit Testing

This code base uses [Jest](https://jestjs.io/) for its unit testing framework.  Unit test cases are placed alongside src
files and follow the naming convention *.spec.ts.

```bash
# Runs all tests and closes
npm run test:unit:ci
```

```bash
# Runs all tests in watch mode.  Reruns tests if changes are made.
npm run test:unit
```

#### End-to-End Testing

This code base uses [Cypress](https://www.cypress.io/) to execute end to end tests as well as UI tests that require a browser to fully simulate.  Cypress tests take much
longer to run than Jest tests so it is recommended to use them when a unit test cannot easily or fully test the functionality in question.

Before starting your cypress tests, you must start the [springboot and react servers](../README.md#Running-the-Application).

```bash
# Run end-to-end tests in headless mode:
npm run cy:run
```
```bash
# Run end-to-end tests in supervised mode:
npm run cy:open
```

Note: Some operating systems will require additional libraries to be installed before Cypress can run. See [Cypress System Requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements)
for more information

---

### Linting the Code base

```bash
# This command will lint the typescript codebase and report violations:
npm run lint && npm run prettier && npm run stylelint
```
```bash
# This command will lint the typescript codebase and attempt to fix violations:
npm run lint:fix && npm run prettier:fix && npm run stylelint:fix
```

---

### Git pre-commit hooks

If installed properly, husky should be running linting and applicable ui unit tests pre-commit.

---

## React Routing

Navigation through RetroQuest is managed by [React Router](https://reactrouter.com/).

Below are all of the routes within retroquest:

| Path                         |     | Component                       |
|------------------------------|-----|---------------------------------|
| create                       |     | CreateTeamPage                  |
| login                        |     | LoginPage                       |
| login/:teamId                |     | LoginPage                       |
| team/:teamId                 |     | RetroPage                       |
| team/:teamId/radiator        |     | RadiatorPage                    |
| team/:teamId/archives        |     | ArchivesPage                    |
| /email/reset                 | *** | ChangeTeamDetailsPage           |
| /password/reset              | *** | ResetPasswordPage               |
| /password/reset/expired-link | *** | ExpiredResetPasswordLinkPage    |
| /email/reset/expired-link    | *** | ExpiredResetBoardOwnersLinkPage |
| /request-password-reset      | *** | PasswordResetRequestPage        |
| /recover-team-name           | *** | RecoverTeamNamePage             |
| /*                           |     | ErrorPage                       |

*** hide if [email is disabled]()

---

## Set up Analytics (optional)
You can add google analytics, hotjar, and more by adding the config scripts to the `public/analytics.js` file.
This file is already loaded into `index.html`.
