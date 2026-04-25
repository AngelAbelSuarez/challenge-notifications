# Integration Tests


## Setup

The integration tests require:

1. A PostgreSQL database server
2. The ability to create a database called `notifications_test` (or modify `.env.test` to use a different database name)

## Configuration

The test database is configured in `.env.test`. You can modify these settings to match your environment:

```bash
# Database Configuration for Testing
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PORT=5433
POSTGRES_DB_USER=postgres
POSTGRES_DB_PASSWORD=postgres
POSTGRES_DB_DATABASE=notifications_test
POSTGRES_DB_SYNC=true

```

## Running Tests

```bash
npm run test:e2e
```

## Test Structure

The integration tests are organized by controller:

### Auth
- `POST /auth/register`: Tests for registering a new user
- `POST /auth/login`: Tests for user authentication and token generation

### Users (Admin only)
- `POST /users`: Tests for creating a new user
- `GET /users`: Tests for retrieving all users
- `GET /users/:id`: Tests for retrieving a specific user by ID
- `PATCH /users/:id`: Tests for updating a user's information
- `DELETE /users/:id`: Tests for soft-deleting a user

### Notifications
- `POST /notifications`: Tests for sending notifications (Email, SMS, Push)
- `GET /notifications`: Tests for retrieving all notifications for the authenticated user
- `GET /notifications/:id`: Tests for retrieving a specific notification
- `PATCH /notifications/:id`: Tests for updating a notification (e.g., status)
- `DELETE /notifications/:id`: Tests for deleting a notification

Each test verifies both the HTTP response and that the database was updated correctly.


## Credentials (Admin)

- **Email**: `admin@admin.com`
- **Password**: `admin123`

