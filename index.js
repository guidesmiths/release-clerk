var debug = require('debug')('release-clerk:index')
var _ = require('lodash')
var async = require('async')
var defaults = require('./defaults')
var tasks = require('./lib/tasks')

function releaseClerk(params, cb) {

    var exit = setInterval(_.noop, Number.MAX_SAFE_INTEGER)

    var workflow = async.seq(
        tasks.validateParams,
        tasks.applyOverrides,
        tasks.initGitHubApi,
        tasks.determineReleaseType,
        tasks.getCommits,
        tasks.renderIssueBody,
        tasks.createIssue
    )

    workflow({ params: params, config: defaults }, function(err, ctx) {
        if (err) throw err
        exit.unref()
    })
}

module.exports = releaseClerk
