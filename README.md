# Release Clerk
A command line utility for posting release notes as issues to a github shared repository. This is especially useful in a continuous deployment / micro-service environment, where developers release at will, making it difficult to keep track of what changes have been rolled out to, or back from, production.

## Usage
```bash
npm i release-clerk
node_modules/.bin/release-clerk --help

Usage: release-clerk [options]

  Options:

     h, --help                          output usage information
    -V, --version                       output the version number
    -c --config [string]                path to config file
    -r --repository [string]            repository of the project being released
    -u --user [string]                  user/organisation of the project being released
    -p --previous-release-sha [string]  last commit sha of the previous release (if any)
    -q --current-release-sha [string]   last commit sha sha this release
    -t --title [string]                 issue title
    -s --summary [string]               issue summary
```

## Configuration
Release Clerk will attempt to load configuration from config.json and config.js in the current working directory. You can specify this path using the ```--config``` command line argument. At a minimum you need to provide

2. An api token to authenticate the github client. See https://help.github.com/articles/creating-an-access-token-for-command-line-use
1. A user-agent for the github client. This should be user github username.
3. The user and repository you want to post release notes to.

Minimum configuration in config.js

```js
module.exports = {
    github: {
        token: "your github api token"
        headers: {
            'user-agent': 'your github username'
        }
    },
    issues: {
        user: 'organisation or github username',
        repository: 'repository where releases will be recorded'
    }
}
```

### Full Configuration
```js
module.exports = {
    github: {
        version: "3.0.0",
        debug: false,
        host: "api.github.com",
        timeout: 25000,
        pageSize: 25,
        token: "your github api token"
        headers: {
            'user-agent': 'your github username'
        }
    },
    issues: {
        user: 'organisation or github username',
        repository: 'repository where releases will be recorded',
        labels: ['LABEL 1', 'LABEL 2'],
        templates: '/path/to/custom/templates'
    }
}

