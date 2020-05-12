<p align="center">
    <img height="80" src="./client/src/assets/logo-dark.svg"/>
</p>

# Accept is a service running on the Ethereum network, serving as a peer-to-peer marketplace allowing users to exchange goods and services.

# Dechomai

![Build Status](https://codebuild.eu-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiYTMwcllJWkQxVlphbEpxYVZ1ck5JRWFzOUtFVVM0V2l0ZTdmOExDcnNIWGhNTjRTNmtGTkpZUTE1Rk91MmdrYVJaMHRwKzRuclQvYm9Yc21RY3JOU29VPSIsIml2UGFyYW1ldGVyU3BlYyI6IjhrNTc0K1hmS3Bzd0Jtd2oiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop)

## Contributing guidelines and instructions

Defined in [CONTRIBUTING.md](CONTRIBUTING.md)

## Configuration

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
