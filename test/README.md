# Integration Tests


## Setup

The integration tests require:

1. A PostgreSQL database server
2. The ability to create a database called `usersdb_test` (or modify `.env.test` to use a different database name)

## Configuration

The test database is configured in `.env.test`. You can modify these settings to match your environment:

```bash
# Database Configuration for Testing
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=usersdb_test
DATABASE_SYNC=true

# API Configuration
DRAGONBALL_API_URL='https://dragonball-api.com/api/characters'
```

## Running Tests

```bash
npm run test:e2e
```

## Test Structure

The integration tests are organized by endpoint:

- `POST /users`: Tests for creating a new user
- `GET /users`: Tests for retrieving all users
- `GET /users/:id`: Tests for retrieving a user with their Dragon Ball Z details
- `PATCH /users/:id`: Tests for updating a user with their Dragon Ball Z details
- `DELETE /users/:id`: Tests for deleting a user

Each test verifies both the HTTP response and that the database was updated correctly.

## Mocking

