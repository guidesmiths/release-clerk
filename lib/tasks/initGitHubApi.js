var debug = require('debug')('release-clerk:tasks:initGithubApi')
var GitHubApi = require('github')
var _ = require('lodash')

module.exports = function initGithubApi(ctx, cb) {
    debug('Initialising github client')

    if (!_.has(ctx, 'config.github.headers.user-agent')) return cb(new Error('No user-agent specified in configuration'))
    ctx.github = new GitHubApi(ctx.config.github)

    debug('Authenticating github client')
    if (!_.has(ctx, 'config.github.token')) return cb(new Error('No token specified in configuration'))

    ctx.github.authenticate({ type: "oauth", token: ctx.config.github.token })

    cb(null, ctx)
}
