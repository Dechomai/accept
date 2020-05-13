# Contributing

## Getting started

1.  Clone the repo:

2.  Set up your development environment:

    -   Install `node 12.*`
    -   Run `npm install` to install dependencies
    -   Install `docker`

3.  Configure app:

    -   Check [Configuration Section](#configuration) for configuration instructions
    -   Check `/.env.sample` file for required variables

4.  Start the app

    4.1 Working on client-side only

    ```
    docker-compose -f ./docker-compose.all.yml up
    ```

    4.2 Working on both

    1.  Start all app dependencies in a containers

        ```
        docker-compose -f ./docker-compose.yml up
        ```

    2.  Start app

        ```sh
        npm start
        ```

5.  Client-side development

    Check [client/README.md](client/README.md) for instructions

## Configuration

### Configurations options

| Environment variable                   | Command-line argument      | Format                              | Default value                            | Description                                |
| -------------------------------------- | -------------------------- | ----------------------------------- | ---------------------------------------- | ------------------------------------------ |
| `NODE_ENV`                             | `nodeEnv`                  | production/development/test         | development                              |                                            |
| `HOST`                                 | `ipAdress`                 | ipaddress                           | 0.0.0.0                                  | The IP address to bind.                    |
| `PORT`                                 | `port`                     | port                                | 7000                                     | The PORT to bind.                          |
| `COOKIE_SECRET`                        | `cookieSecret`             | String                              | super-secret                             | Secret used to sign cookies                |
| `LOG_LEVEL`                            | `logLevel`                 | error/warn/info/verbose/debug/silly | debug                                    | -                                          |
| `DEPLOY_ENV`                           | `deployEnv`                | String                              | develop                                  | Deployment environment name                |
| `DB_USERNAME`                          | `dbUsername`               | -                                   | -                                        | -                                          |
| `DB_PASSWORD`                          | `dbPassword`               | -                                   | -                                        | -                                          |
| `DB_HOST`                              | `dbHost`                   | String                              | localhost:27017                          | -                                          |
| `DB_NAME`                              | `dbName`                   | String                              | accept-dev-local                         | -                                          |
| `COGNITO_CLIENT_ID`                    | `cognitoClientId`          | String                              | [request](#request-configuration-values) | AWS Cognito "App client id"                |
| `COGNITO_CLIENT_SECRET`                | `cognitoClientSecret`      | String                              | [request](#request-configuration-values) | AWS Cognito "App client secret"            |
| `COGNITO_DOMAIN`                       | `cognitoDomain`            | String                              | [request](#request-configuration-values) | AWS Cognito "Domain name"                  |
| `COGNITO_REGION`                       | `cognitoRegion`            | String                              | [request](#request-configuration-values) | AWS Cognito Region                         |
| `COGNITO_USER_POOL_ID`                 | `cognitoUserPoolId`        | String                              | [request](#request-configuration-values) | AWS Cognito User Pool ID                   |
| `COGNITO_LOGIN_REDIRECT_URI`           | `cognitoLoginRedirectUri`  | url                                 | [request](#request-configuration-values) | AWS Cognito App Client LOGIN redirect_uri  |
| `COGNITO_LOGOUT_REDIRECT_URI`          | `cognitoLogoutRedirectUri` | url                                 | [request](#request-configuration-values) | AWS Cognito App Client LOGOUT redirect_uri |
| `CLOUDINARY_CLOUD_NAME`                | `cloudinaryName`           | String                              | [request](#request-configuration-values) | Cloudinary Clound name                     |
| `CLOUDINARY_API_KEY`                   | `cloudinaryApiKey`         | String                              | [request](#request-configuration-values) | Cloudinary API Key                         |
| `CLOUDINARY_API_SECRET`                | `cloudinaryApiSecret`      | String                              | [request](#request-configuration-values) | Cloudinary API Secret                      |
| `BLOCKCHAIN_HTTP_ADDRESS`              | `blockchainHttpAddress`    | String                              | [request](#request-configuration-values) | Blockchain address for HTTP provider       |
| `BLOCKCHAIN_WS_ADDRESS`                | `blockchainWsAddress`      | String                              | [request](#request-configuration-values) | Blockchain address for WebSocker provider  |
| `BLOCKCHAIN_TOKEN_CONTRACT_ADDRESS`    | `tokenContractAddress`     | String                              | [request](#request-configuration-values) | Token contract address                     |
| `BLOCKCHAIN_TOKEN_SPONSOR_ADDRESS`     | `tokenSponsorAddress`      | String                              | [request](#request-configuration-values) | Token Sponsor Public Address               |
| `BLOCKCHAIN_TOKEN_SPONSOR_PRIVATE_KEY` | `tokenSponsorPrivateKey`   | String                              | [request](#request-configuration-values) | Token Sponsor Private Key                  |

### How to configure

There are several ways to provide configuration options and variables.
_We're using `dotenv` + `convict`_

In the following order of precendence:

1.  Command line arguments.

    ```sh
    $ npm start --someVariable 10
    ```

2.  Environment variables.

    ```sh
    $ SOME_VARIABLE=10 npm start
    ```

3.  Variables defined in `/.env` file

    > preferred for local development

    eg. contents of `/.env` file

    ```
    SOME_VARIABLE=10
    ```

4.  Configuration in `/config/env/*.json` files

    > depends on environment name (`development` | `production` | `test`)

    eg. contents of development.json

    ```json
    {
        "someVariable": 10
    }
    ```

5.  Defaults specified in `/config/index.js` file as part of schema

    eg. schema definition

    ```javascript
        // ...
        someVariable: {
            doc: 'Some sample variable',
            format: Number,
            default: 10,
            arg: 'someVariable',
            env: 'SOME_VARIABLE'
        },
        // ...
    ```

## Request configuration values

Application depends on some live 3rd-party services. In order to develop locally
you'll need to provide these values.

Please contact [Placeholder Name placeholder@name.com](mailto:placeholer@name.com?subject=[GitHub]%20Request%20configuration%20values)

## Branching strategy

We'll use slightly modified `git flow`.

#### Please read and refer from now on to [Atlassian Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) and [Root](http://nvie.com/posts/a-successful-git-branching-model/)

1.  `master` - contains production-ready code, should be **always** clean and ready to be deployed to production environment
2.  `development` - contains complete code(no WIP code), only this branch will be merged to `master`
3.  `feature/*` - feature branches. Always created **from** develop

    > **MUST** contain issue ID and short description. eg.
    > `feature/123-some-short-description`

4.  `fix/*` - bugfix branches
    > **MUST** contain issue ID and short description. eg.
    > `fix/123-bug-description`

## Commit

1.  Make sure everything works as expected
2.  Make sure linter and tests pass
3.  Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). And don't forget to include ticket ID in commit message, if applicable. So that commit message will look like

```
#123 short commit summary in imperative form

detailed description, if necessary
```

## Pull Request

**TODO** complement

Before opening a pull request, make sure:

1.  Task is completed/implemented according to task description
2.  All existing unit tests pass, if applicable
3.  You've implemented unit tests for your task, if applicable
4.  You've run local build and tested your task there
5.  No lint errors, you did everything possible to reduce amount of warnings as much as possible
6.  Make sure there won't be any conflicts

    ```sh
    git checkout master
    git pull --rebase origin master
    git checkout feature/your-feature-branch-name
    git rebase master

    OR

    git checkout master
    git pull --rebase origin master
    git checkout feature/your-feature-branch-name
    git merge master --no-ff
    ```

Only then, feel free to open pull request.

Once PR is reviewed by required teammates, it will be merged back to develop.

> NOTE!
>
> We're **not using** fast-forward and squash when merging, use `--no-ff`, **DO NOT use `--squash` or `--ff`**

## CI Build

`Nodejs 8.10`, `npm`, `yarn`

```
- npm install
- npm run lint
- npm test
- cd client
- npm install
- npm run test
- cd ..
- npm run build:client
```

### Artifact

Should contain

```
package.json
package-lock.json
app.js
/app
/config
/public
/migrations
```

### Uploading Cognito Custom CSS

Add `COGNITO_CUSTOMIZER_ACCESS_KEY_ID`, `COGNITO_CUSTOMIZER_SECRET_ACCESS_KEY` and `COGNITO_REGION` in `.env` file **OR** specify those in your environment variables

```
npm run cognito:upload:customization
```

### Creating DB Migration

To create migration script run

```
node ./scripts/migrate.js create my-test-migration
```

this will create migration script `${date}-my-test-migration.js` in `./migrations` folder
