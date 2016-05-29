var assert = require('chai').assert
var path = require('path')
var renderIssueBody = require('../../lib/tasks/renderIssueBody')

describe('Render Issue Body', function() {

    var originalCwd

    before(function() {
        originalCwd = process.cwd()
    })

    afterEach(function() {
        process.chdir(originalCwd)
    })

    it('should render first release with default template', function(done) {
        renderIssueBody({ release: { type: 'first' }, params: { summary: 'Foo' }, config: { issue: {} }, commits: [{
            sha: 'foo',
            message: 'one',
            contact: 'Rod',
            date: '2016-05-29T07:22:14.234Z',
            user: 'guidesmiths',
            repository: 'rascal'
        }] }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, [
                '### Foo',
                '',
                'The following commits were included in this release:',
                '',
                '| Message | Contact | Date |',
                '|---------|---------|------|',
                '| [one](https://github.com/guidesmiths/rascal/commit/foo) | Rod | 2016-05-29T07:22:14.234Z |',
                '',
                '',
                ''
            ].join('\n'))
            done()
        })
    })

    it('should render first release with default template when truncated', function(done) {
        renderIssueBody({ release: { type: 'first' }, params: { summary: 'Foo' }, config: { issue: {} }, commits: [{
            sha: 'foo',
            message: 'one',
            contact: 'Rod',
            date: '2016-05-29T07:22:14.234Z',
            user: 'guidesmiths',
            repository: 'rascal'
        }],
        truncated: true }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, [
                '### Foo',
                '',
                'The following commits were included in this release:',
                '',
                '| Message | Contact | Date |',
                '|---------|---------|------|',
                '| [one](https://github.com/guidesmiths/rascal/commit/foo) | Rod | 2016-05-29T07:22:14.234Z |',
                '',
                '**Commit history was truncated**',
                ''
            ].join('\n'))
            done()
        })
    })

    it('should render first release with custom template', function(done) {
        process.chdir(path.resolve('tests/data'))
        renderIssueBody({ release: { type: 'first' }, params: { summary: 'Foo' }, config: { issue: { templates: 'renderIssueBody'} }, commits: [{
            sha: 'foo',
            message: 'one',
            contact: 'Rod',
            date: '2016-05-29T07:22:14.234Z',
            user: 'guidesmiths',
            repository: 'rascal'
        }],
        truncated: true }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, 'Custom Template')
            done()
        })
    })

    it('should render re-release with default template', function(done) {
        renderIssueBody({ release: { type: 're-release' }, params: { summary: 'Foo' }, config: { issue: {} }, commits: [] }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, [
                '### Foo',
                '',
                'Re-released',
                ''
            ].join('\n'))
            done()
        })
    })

    it('should render update with default template', function(done) {
        renderIssueBody({ release: { type: 'update' }, params: { summary: 'Foo' }, config: { issue: {} }, commits: [{
            sha: 'foo',
            message: 'one',
            contact: 'Rod',
            date: '2016-05-29T07:22:14.234Z',
            user: 'guidesmiths',
            repository: 'rascal'
        }] }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, [
                '### Foo',
                '',
                'The following commits were included in this release:',
                '',
                '| Message | Contact | Date |',
                '|---------|---------|------|',
                '| [one](https://github.com/guidesmiths/rascal/commit/foo) | Rod | 2016-05-29T07:22:14.234Z |',
                '',
                '',
                ''
            ].join('\n'))
            done()
        })
    })

    it('should render rollback with default template', function(done) {
        renderIssueBody({ release: { type: 'rollback' }, params: { summary: 'Foo' }, config: { issue: {} }, commits: [{
            sha: 'foo',
            message: 'one',
            contact: 'Rod',
            date: '2016-05-29T07:22:14.234Z',
            user: 'guidesmiths',
            repository: 'rascal'
        }] }, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.issue.body, [
                '### Foo',
                '',
                'The following commits were rolled back in this release:',
                '',
                '| Message | Contact | Date |',
                '|---------|---------|------|',
                '| [one](https://github.com/guidesmiths/rascal/commit/foo) | Rod | 2016-05-29T07:22:14.234Z |',
                '',
                '',
                ''
            ].join('\n'))
            done()
        })
    })
})