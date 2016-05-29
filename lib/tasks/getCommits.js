var debug = require('debug')('release-clerk:tasks:getCommits')
var _ = require('lodash')

module.exports = function getCommits(ctx, cb) {
    debug('Getting commits')
    var sha1, sha2

    if (ctx.release.type === 'first') {
        sha2 = ctx.params.currentReleaseSha
    } else if (ctx.release.type === 'update' || ctx.release.type === 're-release') {
        sha1 = ctx.params.previousReleaseSha
        sha2 = ctx.params.currentReleaseSha
    } else if (ctx.release.type === 'rollback') {
        sha1 = ctx.params.currentReleaseSha
        sha2 = ctx.params.previousReleaseSha
    }

    ctx.github.repos.getCommits({
        user: ctx.params.user,
        repo: ctx.params.repository,
        sha: sha2,
        per_page: ctx.config.github.pageSize
    }, function(err, data) {
        if (err) return cb(err)
        ctx.commits = []
        for (var i = 0; i < data.length && data[i].sha !== sha1; i++) {
            ctx.commits.push({
                message: data[i].commit.message,
                user: ctx.params.user,
                repository: ctx.params.repository,
                sha: data[i].sha,
                contact: _.get(data[i], 'commit.author.name') ||
                         _.get(data[i], 'commit.author.email') ||
                         _.get(data[i], 'commit.committer.name') ||
                         _.get(data[i], 'commit.committer.email'),
                date: _.get(data[i], 'commit.author.date') ||
                      _.get(data[i], 'commit.committer.date')
            })
        }
        ctx.truncated = i === data.length && /rel="next"/.test(data.meta.link)
        return cb(null, ctx)
    })
}
