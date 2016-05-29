var debug = require('debug')('release-clerk:tasks:createIssue')

module.exports = function createIssue(ctx, cb) {
    debug('Creating issue')

    ctx.github.issues.create({
        user: ctx.config.issue.user,
        repo: ctx.config.issue.repository,
        title: ctx.params.title,
        body: ctx.issue.body,
        labels: ctx.config.issue.labels.concat(ctx.release.label)
    }, function(err) {
        cb(err, ctx)
    })
}


