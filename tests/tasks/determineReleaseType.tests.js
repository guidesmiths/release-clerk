var assert = require('chai').assert
var determineReleaseType = require('../../lib/tasks/determineReleaseType')

describe('Determine Release Type', function() {

    it('should recognise first releases', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.release.type, 'first')
            assert.equal(ctx.release.label, 'First Release')
            done()
        })
    })

    it('should recognise re-releases', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'foo', previousReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.release.type, 're-release')
            assert.equal(ctx.release.label, 'Re-Release')
            done()
        })
    })

    it('should recognise updates', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'foo', previousReleaseSha: 'bar' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.release.type, 'update')
            assert.equal(ctx.release.label, 'Update')
            done()
        })
    })

    it('should recognise rollbacks', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'bar', previousReleaseSha: 'foo' }}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.release.type, 'rollback')
            assert.equal(ctx.release.label, 'Rollback')
            done()
        })
    })

    it('should report commits that do not exist (1 of 3)', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'err' }}, function(err, ctx) {
            assert(err)
            assert.equal(err.message, 'Oh Noes!')
            done()
        })
    })

    it('should report commits that do not exist (2 of 3)', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'err', previousReleaseSha: 'err' }}, function(err, ctx) {
            assert(err)
            assert.equal(err.message, 'Oh Noes!')
            done()
        })
    })

    it('should report commits that do not exist (2 of 3)', function(done) {
        determineReleaseType({ github: github, params: { currentReleaseSha: 'err', previousReleaseSha: 'bar' }}, function(err, ctx) {
            assert(err)
            assert.equal(err.message, 'Oh Noes!')
            done()
        })
    })

    var github = {
        repos: {
            getCommit: function(options, cb) {
                if (options.sha === 'foo') return cb(null, { commit: { committer: { date: new Date('2016-05-29T07:22:14.234Z')}}})
                if (options.sha === 'bar') return cb(null, { commit: { committer: { date: new Date('2016-05-28T07:22:14.234Z')}}})
                if (options.sha === 'err') return cb(new Error('Oh Noes!'))
            }
        }
    }
})