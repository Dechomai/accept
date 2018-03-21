# Accept Pay

## Prerequisites

*   Install `node` and `yarn`
*   Run `yarn` to install dependencies
*   Install `docker`

## Configuration

TODO: add configuration instructions (dotenv + convict)

## Local development

1.  Start MongoDB

    ```
    docker-compose -f ./docker-compose.dev.yml up
    ```

    Or, if you're using locally installed version, just start `mongod`

2.  Start server
    ```
    yarn start
    ```
