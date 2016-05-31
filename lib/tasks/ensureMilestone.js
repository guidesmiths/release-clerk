var debug = require('debug')('release-clerk:tasks:ensureMilestone')

module.exports = function ensureMilestone(ctx, cb) {
    debug('Ensuring milestone')
    if (!ctx.params.milestone) return cb(null, ctx)

    ctx.github.issues.createMilestone({
        user: ctx.params.user,
        repo: ctx.params.repository,
        title: ctx.params.milestone
    }, function(err) {
        if (err && err.code !== 422) return cb(err)
        cb(null, ctx)
    })

}
