# Accept Pay

## Links

-   Jira https://jd.eleks.com/secure/RapidBoard.jspa?projectKey=ACPT&rapidView=923
-   Confluence https://cd.eleks.com/pages/viewpage.action?pageId=65317902
-   Repository https://gitlab2.eleks-software.local/accept/accept-pay
-   CI https://jksap.eleks-software.local/
-   Environments

    -   dev
        -   https://dev.accept.io/ - private network
        -   https://testnet.accept.io/ - ropsten network
    -   stage
    -   prod

## Contributing guidelines and instructions

Defined in [CONTRIBUTING.md](CONTRIBUTING.md)

## Configuration

There are several ways to provide configuration options and variables.
_We're using `dotenv` + `convict`_

In the following order of precendence:

1.  Command line arguments.

    ```sh
    $ yarn start --someVariable 10
    ```

2.  Environment variables.

    ```sh
    $ SOME_VARIABLE=10 yarn start
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
- yarn
- yarn lint
- yarn test
- cd client
- yarn
- yarn test
- cd ..
- yarn build:client
```

### Artifact

Should contain

```
package.json
yarn.lock
app.js
/app
/config
/public
```

### Uploading Cognito Custom CSS

Add `COGNITO_CUSTOMIZER_ACCESS_KEY_ID`, `COGNITO_CUSTOMIZER_SECRET_ACCESS_KEY` and `COGNITO_REGION` in `.env` file **OR** specify those in your environment variables

```
yarn cognito:upload:customization
```

### Creating DB Migration

To create migration script run

```
node ./scripts/migrate.js create my-test-migration
```

this will create migration script `${date}-my-test-migration.js` in `./migrations` folder
