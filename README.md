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

### Uploading Cognito Custom CSS

Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` in `.env` file **OR** specify those in your environment variables

```
yarn cognito:upload:customization
```
