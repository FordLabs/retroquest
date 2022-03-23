# RetroQuest UI

The RetroQuest UI is developed using the [React Framework](https://reactjs.org/)

## Running Package Scripts

For the purpose of this documentation, we will assume you are using [Node Package manager](https://www.npmjs.com/), but
the commands are very similar using [Yarn Package Manager](https://yarnpkg.com/).

### Starting the Development Server

```
npm run start
```

This command will start the server. Navigate to http://localhost:3000/ to begin interacting on your desktop with the
app. The app will automatically reload if you change any of the source files.

### Testing Strategy
While not perfect, this site makes heavy use of automated testing.  Engineers are encouraged to follow a "test-first" or test driven development approach
to ensure confidence that the application works after a code change is made.  This code base incorporates the following types of testing:
- Unit - confirms that an isolated block of code works properly
- End to End - Simulates a user executing common tasks in a browser

### Unit Testing

This code base uses [Jest](https://jestjs.io/) for its unit testing framework.  Unit test cases are placed alongside src
files and follow the naming convention *.spec.ts.

```
npm run test:unit:ci
```

This command will execute the unit tests once and then terminate.

```
npm run test:unit:ui
```

This command will execute all the unit tests and then enter "watch mode" in which case it will execute any tests again where the code has changed.

### End to End Testing

This code base uses [Cypress](https://www.cypress.io/) to execute end to end tests as well as UI tests that require a browser to fully simulate.  Cypress tests take much
longer to run than Jest tests so it is recommended to use them sparingly.

Before starting your cypress tests, you must start the [springboot and react servers](../README.md#Running-the-Application).

To run end to end tests in headless mode:
```
npm run cy:run
```

To run end to end tests in supervised mode:
```
npm run cy:open
```

Note: Some operating systems will require additional libraries to be installed before Cypress can run.  See [Cypress System Requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements)
for more information

### Linting the Code base

```
npm run lint && npm run prettier && npm run stylelint
```

This command will lint the typescript codebase and report violations

```
npm run lint:fix && npm run prettier:fix && npm run stylelint:fix
```

This command will lint the typescript codebase and attempt to fix violations

## React Routing

Navigation through RetroQuest is managed by [React Router](https://reactrouter.com/).

| Path                           | Component    |
| ------------------------------ |--------------|
| create                         | CreatePage   |
| login                          | LoginPage    |
| login/:teamId                  | LoginPage    |
| team/:teamId                   | RetroPage    |
| team/:teamId/radiator          | RadiatorPage |
| team/:teamId/archives          | ArchivesPage |
