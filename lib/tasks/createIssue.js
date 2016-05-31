var debug = require('debug')('release-clerk:tasks:createIssue')

module.exports = function createIssue(ctx, cb) {
    debug('Creating issue')

    var labels = ctx.params.labels ? ctx.params.labels.split(',') : []

    var issue = {
        user: ctx.config.issue.user,
        repo: ctx.config.issue.repository,
        title: ctx.params.title,
        body: ctx.issue.body,
        labels: ctx.config.issue.labels.concat(ctx.release.label).concat(labels)
    }

    if (ctx.params.debug) {
        console.log(issue)
        return cb(null, ctx)
    }

    ctx.github.issues.create(issue, function(err) {
        cb(err, ctx)
    })
}


