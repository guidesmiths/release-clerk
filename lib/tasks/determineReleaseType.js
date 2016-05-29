var debug = require('debug')('release-clerk:tasks:determineReleaseType')
var async = require('async')
var _ = require('lodash')

module.exports = function determineReleaseType(ctx, cb) {
    debug('Determining release type')

    getCommitDates(function(err, commits) {
        if (err) cb(err)
        else if (!ctx.params.previousReleaseSha) {
            debug('Setting release type to: first')
            cb(null, _.extend(ctx, { release: { type: 'first', label: 'First Release' } } ))
        } else if (ctx.params.previousReleaseSha === ctx.params.currentReleaseSha) {
            debug('Setting release type to: re-release')
            cb(null, _.extend(ctx, { release: { type: 're-release', label: 'Re-Release' } } ))
        } else if (commits.previous && new Date(commits.previous) > new Date(commits.current)) {
            debug('Setting release type to: rollback')
            cb(null, _.extend(ctx, { release: { type: 'rollback', label: 'Rollback' } } ))
        } else {
            debug('Setting release type to: update')
            cb(null, _.extend(ctx, { release: { type: 'update', label: 'Update' } } ))
        }
    })

    function getCommitDates(cb) {
        var getCommitDate = _.curry(_getCommitDate)
        async.parallel({
            previous: getCommitDate(ctx.params.previousReleaseSha),
            current: getCommitDate(ctx.params.currentReleaseSha)
        }, cb)
    }

    function _getCommitDate(sha, cb) {
        if (!sha) return cb()
        debug('Getting commit %s', sha)
        ctx.github.repos.getCommit({
            user: ctx.params.user,
            repo: ctx.params.repository,
            sha: sha
        }, function(err, data) {
            if (err) return cb(err)
            cb(null, data.commit.committer.date)
        })
    }
}
