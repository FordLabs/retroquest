
## Welcome to RetroQuest!

![Build Status](https://github.com/fordlabs/retroquest/actions/workflows/build.yml/badge.svg?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=FordLabs_retroquest&metric=alert_status)](https://sonarcloud.io/dashboard?id=FordLabs_retroquest)

- [Request new features](https://github.com/FordLabs/retroquest/issues)
- [Contribute](https://github.com/FordLabs/retroquest/pulls)

RetroQuest is a website that enables teams to run retrospectives online and in a fun way. It is designed to accomodate both local and distributed teams.

### What is a Retro?
If you are unfamiliar with what a retrospective is, it is a meeting that is held at the end of each iteration on an Agile team. Retrospectives are designed to allow the team time to decompress and reflect upon what happened during the iteration and identify actions that can improve the team as a whole.

![](https://user-images.githubusercontent.com/6293337/55166030-c8ccc600-5144-11e9-9156-e44c4a565020.png)

### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.  

### Dependencies
What you need to install before building our project.  This guide will assume you have a basic understanding of Git operations.  

1. [OpenJDK11](https://openjdk.java.net/projects/jdk/11/)
2. [Lombok](https://projectlombok.org/)
3. [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) (Which is included in the desktop docker applications for Mac/Windows) or [Postgresql](https://www.postgresql.org/)
4. [Node.js](https://nodejs.org/en/)

### Build the Backend with Gradle
1. Open a terminal in the api directory (location of gradle.build)
2. Build the project with the following command: `./gradlew clean build withPostgres` This will trigger the backend tests to run.
  - If you do not wish to run the tests and only want to build the application, use `./gradlew clean assemble withPostgres`

Note: If you are using a different database, then choose the appropriate [withDB](https://github.com/rkennel/withDb) syntax

### Build the Frontend with npm
1. Open a terminal in the ui directory (location of package.json)
2. Run `npm install` to install the dependencies
3. Build the project with the following command: `npm run build`
  - This will place the compiled output into the `api/src/main/resources/static` and will be bundled in the next backend build

## Running the Application
Running the application locally can be done with either an H2 in-memory database or with a docker container of Postgresql.

### In-Memory
The simplest way to get the application spun up is by using the in-memory database via Gradle:
```
./gradlew bootRun
```
or
```
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun withH2
```

The schema produced for H2 may not conform exactly to the Postgresql schema used in production.

### Docker
Running the application locally with Postgresql requires a running instance of the Docker Postgresql container, which can be started from the ```./api``` directory:

```
docker-compose up
```  

Start the backend with Gradle:  
```
./gradlew bootRunDockerDb
```
or
```
SPRING_PROFILES_ACTIVE=dockerdb ./gradlew bootRun withPostgres
```
### Frontend
If you are only working on the backend, a static build will be accessible from [localhost:8080](http://localhost:8080) after running `npm run build`

From the ```./ui``` directory, start the frontend with npm for live development:  
```
npm run start
```

This will start the frontend with a proxy to direct all requests to localhost:8080 where the api is running. The application will start at [localhost:4200](http://localhost:4200)

## Tests

This project includes unit tests, API tests, and Cypress tests.

### API Tests

The following Gradle targets will run the various test suites:

```bash
# Java Unit Tests
./gradlew test
# API Level integration tests with and H2 database
./gradlew apiTest
# API Level integration tests with and production representative database
./gradlew apiTestDockerDb
```
### UI Tests
Navigate to the `ui` folder, making sure you've already followed the build steps for the frontend and run any of the following commands:

```bash
# Runs all tests and closes
npm run test:unit:ci
# Runs all tests.  Reruns tests if changes are made.
npm run test:unit
```

### E2E Tests
Start the database
```
cd ./api && docker-compose up
```
Start the backend application
```
./gradlew bootRunDockerDb
```
Start the frontend application
```
cd ./ui && npm run start
```
Run the end to end tests
```
cd ./ui && npm run cy:run
```
...Or to run the tests visually from the cypress tool (good for troubleshooting)
```
cd ./ui && npm run cy:open
```


## Connecting to the local Database
The application uses a Postgresql instance. The connection properties can be found in the application's property file.

## Contributing
Please read [CONTRIBUTING.md](/docs/CONTRIBUTING.md) for details on our code of conduct, and the process for contributing, including how to fork and submit pull requests.

## Built With
* [React](https://reactjs.org/) - Frontend Javascript framework
* [Node.js](https://nodejs.org/en/) - JavaScript runtime engine
* [Gradle](https://gradle.org/) - Dependency management
* [Spring](https://spring.io/) - Development framework


