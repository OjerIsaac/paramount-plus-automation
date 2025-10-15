
## Paramount+ Automation API

A NestJS application for automating user management and payment card updates on Paramount+ using Puppeteer.

## Features
- User Management: Complete CRUD operations for users

- Secure Authentication: JWT token-based authentication for all endpoints

- Automation Engine: Puppeteer-based automation for Paramount+ card updates

- Robust Error Handling: Retry logic and comprehensive logging

- API Documentation: Swagger documentation for all endpoints
## Project setup
### Installation 
```bash
$ git clone git@github.com:OjerIsaac/paramount-plus-automation.git

```

```bash
$ cd paramount-plus-automation
```
### Install dependencies
```bash
$ npm install
```

### Set up environment Variables
```bash
$ cp .env.example .env
```
## Run the project

```bash
# development
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## API Documentation 
Once the application is running, access the interactive API documentation at:
http://localhost:300/api/docs