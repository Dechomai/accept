# Accept Pay

## Links

*   Jira **TODO**
*   Confluence **TODO**
*   Repository https://gitlab2.eleks-software.local/accept/accept-pay
*   CI **TODO** _when available_
*   Environments **TODO**

    *   dev
    *   stage
    *   prod

## Prerequisites _(for local development)_

*   Install `node` and `yarn`
*   Run `yarn` to install dependencies
*   Install `docker`

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

## Local development

1.  Start MongoDB

    ```
    docker-compose -f ./docker-compose.dev.yml up
    ```

    Or, if you're using locally installed version, just start your `mongod`

2.  Start server
    ```
    yarn start
    ```

## CI Build

```
yarn
yarn lint
```
