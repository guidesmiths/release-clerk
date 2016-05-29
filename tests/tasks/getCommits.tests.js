var assert = require('chai').assert
var _ = require('lodash')
var getCommits = require('../../lib/tasks/getCommits')

describe('Get Commits', function() {

    it('should get all commits for first release', function(done) {
        getCommits({ github: github, release: { type: 'first' }, config: { github: { pageSize: 25 } }, params: { currentReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.commits.length, 3)

            assert.equal(ctx.commits[0].sha, 'foo')
            assert.equal(ctx.commits[0].message, 'one')
            assert.equal(ctx.commits[0].contact, 'Rod')
            assert.equal(ctx.commits[0].date, '2016-05-29T07:22:14.234Z')

            assert.equal(ctx.commits[1].sha, 'bar')
            assert.equal(ctx.commits[1].message, 'two')
            assert.equal(ctx.commits[1].contact, 'Jane')
            assert.equal(ctx.commits[1].date, '2016-05-28T07:22:14.234Z')

            assert.equal(ctx.commits[2].sha, 'baz')
            assert.equal(ctx.commits[2].message, 'three')
            assert.equal(ctx.commits[2].contact, 'Freddy')
            assert.equal(ctx.commits[2].date, '2016-05-27T07:22:14.234Z')

            assert.equal(ctx.truncated, false)

            done()
        })
    })

    it('should get no commits for re-release release', function(done) {
        getCommits({ github: github, release: { type: 're-release' }, config: { github: { pageSize: 25 } }, params: { currentReleaseSha: 'foo', previousReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.commits.length, 0)

            assert.equal(ctx.truncated, false)

            done()
        })
    })

    it('should get selected commits for update release', function(done) {
        getCommits({ github: github, release: { type: 'update' }, config: { github: { pageSize: 25 } }, params: { currentReleaseSha: 'foo', previousReleaseSha: 'baz' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.commits.length, 2)

            assert.equal(ctx.commits[0].sha, 'foo')
            assert.equal(ctx.commits[1].sha, 'bar')

            assert.equal(ctx.truncated, false)

            done()
        })
    })

    it('should get selected commits for rollback release', function(done) {
        getCommits({ github: github, release: { type: 'rollback' }, config: { github: { pageSize: 25 } }, params: { currentReleaseSha: 'baz', previousReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.commits.length, 2)

            assert.equal(ctx.commits[0].sha, 'foo')
            assert.equal(ctx.commits[1].sha, 'bar')

            assert.equal(ctx.truncated, false)

            done()
        })
    })

    it('should report truncated results', function(done) {
        getCommits({ github: github, release: { type: 'first' }, config: { github: { pageSize: 1 } }, params: { currentReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.commits.length, 1)

            assert.equal(ctx.commits[0].sha, 'foo')
            assert.equal(ctx.commits[0].message, 'one')
            assert.equal(ctx.commits[0].contact, 'Rod')
            assert.equal(ctx.commits[0].date, '2016-05-29T07:22:14.234Z')

            assert.equal(ctx.truncated, true)
            done()
        })
    })

    it('should report errors', function(done) {
        getCommits({ github: github, release: { type: 'update' }, config: { github: { pageSize: 25 } }, params: { currentReleaseSha: 'err', previousReleaseSha: 'foo' }}, function(err, ctx) {
            assert(err)
            assert.equal(err.message, 'Oh Noes!')
            done()
        })
    })

    var github = {
        repos: {
            getCommits: function(options, cb) {
                if (!options.sha || options.sha === 'foo') return cb(null, _.extend(_.slice([
                    {
                        sha: 'foo',
                        commit: {
                            message: 'one',
                            committer: {
                                name: 'Rod',
                                date: '2016-05-29T07:22:14.234Z'
                            }
                        }
                    },
                    {
                        sha: 'bar',
                        commit: {
                            message: 'two',
                            author: {
                                name: 'Jane',
                                date: '2016-05-28T07:22:14.234Z'
                            }
                        }
                    },
                    {
                        sha: 'baz',
                        commit: {
                            message: 'three',
                            committer: {
                                name: 'Freddy',
                                date: '2016-05-27T07:22:14.234Z'
                            }
                        }
                    }
                ], 0, options.per_page), { meta: { link: options.per_page === 1 ? 'rel="next"' : '' } }))
                if (options.sha === 'err') return cb(new Error('Oh Noes!'))
            }
        }
    }
})