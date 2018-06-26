# Contributing

## Getting started

1.  Clone the repo:

    ```sh
    git clone git@gitlab2.eleks-software.local:accept/accept-pay.git
    ```

2.  Set up your development environment:

    -   Install `node 8.10` and `yarn`
    -   Run `yarn` to install dependencies
    -   Install `docker`

3.  Configure app:

    -   Check [README.md](README.md) for configuration instructions
    -   Check `/.env.sample` file for required variables

4.  Start the app

    4.1 Working on client-side only

    ```
    docker-compose -f ./docker-compose.all.yml up
    ```

    4.2 Working on both

    1.  Start all app dependencies in a containers

        ```
        docker-compose -f ./docker-compose.dev.yml up
        ```

    2.  Start app

        ```sh
        yarn start
        ```

5.  Client-side development

    Check [client/README.md](client/README.md) for instructions

## Branching strategy

We'll use slightly modified `git flow`.

#### Please read and refer from now on to [Atlassian Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) and [Root](http://nvie.com/posts/a-successful-git-branching-model/)

1.  `master` - contains production-ready code, should be **always** clean and ready to be deployed to production environment
2.  `development` - contains complete code(no WIP code), only this branch will be merged to `master`
3.  `feature/*` - feature branches. Always created **from** develop

    > **MUST** contain issue ID and short description. eg.
    > `feature/ACPT-000-some-short-description`

4.  `fix/*` - bugfix branches
    > **MUST** contain issue ID and short description. eg.
    > `fix/ACPT-000-bug-description`

## Commit

1.  Make sure everything works as expected
2.  Make sure linter and tests pass
3.  Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). And don't forget to include ticket ID in commit message, if applicable. So that commit message will look like

```
ACPT-000 short commit summary in imperative form

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
