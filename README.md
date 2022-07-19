# Capstone: Restaurant Reservation System

Deployed Link: [https://retaurant-res-front-end.herokuapp.com/dashboard]
Back-end Deployed link: [https://restautarant-res-back-end.herokuapp.com/reservations]

## Languages and Technologies Used

* HTML
* React
* Node.js
* Express
* Knex
* Bootstrap


This repository is set up as a *monorepo*, meaning that the frontend and backend projects are in one repository. This allows you to open both projects in the same editor.


| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./back-end`     | The backend project, which runs on `localhost:6001` by default.  |
| `./front-end`    | The frontend project, which runs on `localhost:3000` by default. |

## Examples and Screenshots
### /Dashboard

>A user will see the list of available tables and reservations based on the date perameter.


[![Screen-Shot-2022-07-18-at-10-28-51-PM.png](https://i.postimg.cc/zDwnpZpV/Screen-Shot-2022-07-18-at-10-28-51-PM.png)](https://postimg.cc/Sjs2NPBh)

### /reservations/1:reservationId/seat

>A user you will be able to choose what table to seat the reservation at.

[![Screen-Shot-2022-07-18-at-10-34-06-PM.png](https://i.postimg.cc/RV5vS2zQ/Screen-Shot-2022-07-18-at-10-34-06-PM.png)](https://postimg.cc/G9QWz7tH)

### /reservations/:reservationId/edit

>A user will be able to edit an existing reservation

[![Screen-Shot-2022-07-18-at-10-37-08-PM.png](https://i.postimg.cc/sDN9GPwc/Screen-Shot-2022-07-18-at-10-37-08-PM.png)](https://postimg.cc/zVTR9hmb)

### /reservations/new

>A user will be able to create a new reservation that fit in the restaurants operation hours

[![Screen-Shot-2022-07-18-at-10-40-19-PM.png](https://i.postimg.cc/0QhK2Z8M/Screen-Shot-2022-07-18-at-10-40-19-PM.png)](https://postimg.cc/G8JmXFTd)

### /search

>A user will be able to search for existing reservations using a matchin phone number

[![Screen-Shot-2022-07-18-at-10-42-02-PM.png](https://i.postimg.cc/P56x5KyX/Screen-Shot-2022-07-18-at-10-42-02-PM.png)](https://postimg.cc/tsxyr38w)

### /Tables/new

>A user will be able to create a new table

[![Screen-Shot-2022-07-18-at-10-43-46-PM.png](https://i.postimg.cc/xT6Yv8zg/Screen-Shot-2022-07-18-at-10-43-46-PM.png)](https://postimg.cc/XpBT3Vxy)

## Database setup

1. Set up four new ElephantSQL database instances - development, test, preview, and production - by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
1. After setting up your database instances, connect DBeaver to your new database instances by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests. You have seen unit and integration tests in previous projects.
End-to-end tests use browser automation to interact with the application just like the user does.
Once the tests are passing for a given user story, you have implemented the necessary functionality.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

- `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
- `npm run test:3:backend` runs only the backend tests for user story 3.
- `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

Since tests take time to run, you might want to consider running only the tests for the user story you're working on at any given time.

Once you have all user stories complete, you can run all the tests using the following commands:

- `npm test` runs _all_ tests.
- `npm run test:backend` runs _all_ backend tests.
- `npm run test:frontend` runs _all_ frontend tests.
- `npm run test:e2e` runs only the end-to-end tests.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.

> **Hint**: If you stop the tests before they finish, it can leave the test database in an unusual state causing the tests to fail unexpectedly the next time you run them. If this happens, delete all tables in the test database, including the `knex_*` tables, and try the tests again.

### Frontend test timeout failure

Running the frontend tests on a resource constrained computer may result in timeout failures.

If you believe your implementation is correct, but needs a bit more time to finish, you can update the `testTimeout` value in `front-end/e2e/jest.config.js`. A value of 10000 or even 12000 will give each test a few more seconds to complete.

#### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.

The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.
