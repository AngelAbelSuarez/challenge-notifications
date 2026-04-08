# Backend Challenge

## Description

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/8Vocs9Wi1dzq3hdj7Xm8N6/N9MMdbw5wW2iDNfKkgAq7C/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/8Vocs9Wi1dzq3hdj7Xm8N6/N9MMdbw5wW2iDNfKkgAq7C/tree/main)

[![Coverage Status](https://coveralls.io/repos/github/AngelAbelSuarez/Backend-Challenge-Nest/badge.svg)](https://coveralls.io/github/AngelAbelSuarez/Backend-Challenge-Nest)

## Features

- Create new Users with their Dragon Ball ids
- Get Users list 
- Get User by id with also get their Dragon Ball character data from dragon ball api
- Update user
- Delete user

## Pre-Requisites

- Docker installed without SUDO Permission
- Docker compose installed without SUDO
- Ports free: 3000 and 5432

## How to run the APP

```bash
# permissions
$ chmode 711 ./up_dev.sh

# start app
$ ./up_dev.sh
```

## How to run the tests

```bash
# permissions
$ chmode 711 ./up_test.sh

# start test
$ ./up_test.sh
```


## Areas to imporve 

- A hash must be generated for the password.
- Deployment could be done.

## Techs

- Nest: 11.0.16
- Node: 22.14.0
- TypeORM
- Postgres

## Decision made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- TypeORM: Because it is the already integrated ORM in the Nest Framework and it is the most popular ORM so it is easy to find fixes and people that know how to use it.
- Docker: To make portable.
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.
- CircleCI: To automate the testing process and the deployment process.
- Coveralls: To automate the coverage process.

## Route

- Local: [API Swagger](http://localhost:3000/docs)

## Env vars should be defined 
To find example of the values you can use .env.example

# challenge-notificaciones
