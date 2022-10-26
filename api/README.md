# RetroQuest API

> The RetroQuest API is developed using the [Springboot Framework](https://spring.io/projects/spring-boot) 
and [Java](https://www.java.com/en/).

---

## Dependencies

- Java JDK.
    - Version 8 and newer is supported, though Java 17 is preferred. RetroQuest 
      itself uses Java 17, but the Gradle wrapper will handle downloading a compatible 
      JDK to run tasks for you.
- The ability to run a local database for development
  - We include a docker-compose.yml file in the `api/` subfolder to run a local Postgres database. You may use this file
    with your containerization tool of choice (docker, podman) or run a local database through any other means.
  - You may also use H2 (in-memory), eliminating the need for any external tool to run your database.
- Email server of your choosing (optional). See [docs]() to setup email server or disable email.

Optional:
- Email server of your choosing
    - If you would like the ability to have users reset their password, recover team names associated 
      with the team email addresses, and reset their team emails, an email server is required. 
      See [below](https://github.com/FordLabs/retroquest/blob/main/api/README.md#how-to-set-up-your-email-server-optional) to see how to set up an email server.

---

## Start the API

Running the application locally can be done with either an H2 in-memory database or with a docker container of
Postgresql.

### With an In-Memory Database

The simplest way to get the application spun up is by using the in-memory database via Gradle:

```
./gradlew bootRun
```

or

```
SPRING_PROFILES_ACTIVE=local ./gradlew bootRun withH2
```

The schema produced for H2 may not conform exactly to the Postgresql schema used in production.

#### For Cypress E2E tests: 
_To properly run **Cypress E2E tests**, include the local and e2e-test profiles and run against a clean db_:

```
SPRING_PROFILES_ACTIVE=local,e2e-test ./gradlew bootRun withH2
```

### With a Postgres Database

Running the application locally with Postgresql requires a running instance of the Docker Postgresql container, which
can be started from the ```./api``` directory.

The connection properties can be found in the application's property file.

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

If you would prefer not to use Docker or alternatives, you can run a Postgres database through any other means. Ensure
your database's login credentials match what is defined in `api/src/main/resources/application-dockerdb.properties`.

## Build the API with Gradle

1. Open a terminal in the root directory
2. Build the project with the following command: `./gradlew api:clean api:build api:withPostgres` This will trigger the
   backend tests to run.

- If you do not wish to run the tests and only want to build the application,
  use `./gradlew api:clean api:assemble api:withPostgres`

Note: If you are using a different database, then choose the appropriate [withDB](https://github.com/rkennel/withDb)
syntax

---

## API Tests

The following Gradle targets will run the various test suites:

```bash
# Java Unit Tests
./gradlew test
# API Level integration tests with and H2 database
./gradlew apiTest
# API Level integration tests with and production representative database
./gradlew apiTestDockerDb
```

---

## How to set up your email server (optional)
> If you would like the ability to have users reset their password, recover team names associated
with the team email addresses, and reset their team emails, an email server is required

To set up your email server, update the following variables in application.yml:
- `spring.mail.host` - email server host (default is a fake url - replace with your email server host)
- `spring.mail.port` - email server port (default 25)
- `app-base-url` - the root of your ui app, used in the reset emails as the base of the reset link.
- `retroquest.email.from-address` - the email users will receive mail from
- `retroquest.email.is-enabled` - whether email is enabled. Default is true. Changing to false will hide all email specific UI components and turn off the ability to send emails.
- `retroquest.email.reset.token-lifetime-seconds` - the amount of time before reset email links expire (default is 600 seconds -- 10 minutes)
- `retroquest.password.reset.token-lifetime-seconds` - the amount of time before reset password links expire (default is 600 seconds -- 10 minutes)
