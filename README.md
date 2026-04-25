# Backend Challenge

## Description

This project is a robust **Notification Service** built with **NestJS**. It is designed to centralize and manage alert delivery through multiple channels, including **Email**, **SMS**, and **Push Notifications**. The architecture follows development best practices, allowing for easy extension of new providers and efficient management of notification logs.

The system includes a complete REST API for user and notification management, protected by authentication and fully documented with Swagger.


## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/8Vocs9Wi1dzq3hdj7Xm8N6/QYYM67YbhV513WFpr7MqSY/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/8Vocs9Wi1dzq3hdj7Xm8N6/QYYM67YbhV513WFpr7MqSY/tree/main)

[![Coverage Status](https://coveralls.io/repos/github/AngelAbelSuarez/challenge-notifications/badge.svg?branch=main)](https://coveralls.io/github/AngelAbelSuarez/challenge-notifications?branch=main)

## Features

- Authentication:
    - Register
    - Login
- User(Role: ADMIN only): 
    - Create a user 
    - List all users
    - get by id user
    - Update a user
    - Delete a user
- Notification(Role: All): 
    - Create new notification
    - List all notifications own by user
    - Update own notification the user
    - Delete own notification the user


## Pre-Requisites

- Docker installed without SUDO Permission
- Docker compose installed without SUDO
- Ports free: 3000, 5432 and 5433

## How to run the APP

```bash
# permissions
$ chmod 711 ./up_dev.sh

# start app
$ ./up_dev.sh
```

## How to run the tests

```bash
# permissions
$ chmod 711 ./up_test.sh

# start test
$ ./up_test.sh
```

## Areas to improve
- Implement states in notifications (PENDING, SENT, FAILED).
- Implementar estados en las notificaciones (PENDING, SENT, FAILED).
- Increase coverage with unit tests for notification providers.
- Deployment could be done.

## Techs

- **Node**: 22.14.0
- **Core**: [NestJS](https://nestjs.com/) (11.0.16)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)
- **Testing**: [Jest](https://jestjs.io/) & Supertest
- **Containers**: [Docker](https://www.docker.com/) & Docker Compose
- **CI/CD**: CircleCI & Coveralls


## Decisions made

- **Clean Architecture**: To be able to handle further changes in the future in a proper way.
- **Strategy Pattern**: Separates notification logic, keeps the code cleaner, and makes it easy to add new notification channels without changing the main logic.
- **TypeORM**: Because it is the already integrated ORM in the Nest Framework and it is the most popular ORM so it is easy to find fixes and people that know how to use it.
- **Docker**: To make portable.
- **Jest/Testing/E2E**: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.
- **CircleCI**: To automate the testing process and the deployment process.
- **Coveralls**: To automate the coverage process.



## Routes

- Local: [API Swagger](http://localhost:3000/docs)

## Credentials (Admin)

- **Email**: `admin@admin.com`
- **Password**: `admin123`

## Environment Variables
Example values can be found in `.env.example`.


## Strategy Pattern

```text
Client (API)
          │
          ▼
    NotificationsService (Context)
          │
          ▼
    NotificationProvider (Interface)
     ├── EmailProvider ──► Send Email
     ├── SMSProvider ────► Send SMS
     └── PushProvider ───► Send Push
