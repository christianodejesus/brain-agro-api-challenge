# Brain Agro API Challenge

This project was made as a tech challenge for compete in Serasa Experian backend developer position.

## Key Technologies

- [NodeJS](https://nodejs.org) NodeJS.
- [TypeScript](https://www.typescriptlang.org/) TypeScript lang.
- [NestJS](https://nestjs.com/) Node backend framework.
- [PostgreSQL](https://postgresql.org/) PostgreSQL database system.
- [Docker](https://docker.com/) Docker containers.
- [TDD] Tests Driven Development.

## Project setup

Download or clone API source code and follow above steps to setup local environment

```bash
# install project dependencies
$ yarn

# running local stack
$ yarn stack:up

# setup local database
$ yarn db:setup
```

## Compile and run the project

```bash
# development
$ yarn start

# watch mode
$ yarn start:watch

# production mode
$ yarn start:prod
```
With these steps the API is running locally on port 3000, then you can access the api under URL http://localhost:3000/v1.

- Access API health check endpoint (http://localhost:3000/v1/health)
- Access API Swagger documentation (http://localhost:3000/docs)
- Access API Swagger documentation json file (http://localhost:3000/docs/json)

## Running tests

### Note: to run tests properly, you need to setup local stack and database, see Project Setup section for this

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# all tests at once
$ yarn run test:all
```

## Available Online Version

Follow the links to access the API running online on AWS.

- [API Swagger Online Documentation](http://brain-agro-api-development-alb-848396433.us-east-2.elb.amazonaws.com/docs)
- [API Health Check Endpoint](http://brain-agro-api-development-alb-848396433.us-east-2.elb.amazonaws.com/v1/health)

#### All functional enpoints, route contracts and data structures can be found in online documentation

## Infrastructure Project for AWS

This is the repository for infrastructure project repository, when you can find the project used to raise up all infrastructure on AWS to run the online version of API.

- [https://github.com/christianodejesus/brain-agro-terraform](https://github.com/christianodejesus/brain-agro-terraform)

## About Author

- Github - [Christiano Marques](https://github.com/christianodejesus)
- Linkedin - [Professional Profile](https://www.linkedin.com/in/christiano-marques)
