# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

In your terminal enter next commands

1. `git clone https://github.com/NMakarevich/nodejs2022Q2-service`
2. `cd nodejs2022Q2-service`
3. `git chekout auth`

## Installing NPM modules

```
npm install
```

## Using .env

Create `.env` file using `.env.example` as example.

## Running application

1. Run Docker app
2. In terminal enter `docker-compose up`

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
