var assert = require('chai').assert
var _ = require('lodash')
var validateParams = require('../../lib/tasks/validateParams')

describe('Validate Params', function() {

    var params = { config: 'custom.json', title: '_', 'user': '_', 'repository': '_', 'currentReleaseSha': '_' }

    it('should ensure custom config exists when specified', function(done) {
        validateParams({ params: _.extend({ config: 'custom.json' }, params)}, function(err, ctx) {
            assert(err)
            assert(/\/custom.json does not exists$/.test(err.message))
            done()
        })
    })

    _.each(['user', 'repository', 'currentReleaseSha', 'title'], function(field) {

        it('should ensure ' + field + ' is specified', function(done) {
            validateParams({ params: _.omit(params, field)}, function(err, ctx) {
                assert(err)
                assert.equal(err.message, field + ' is required')
                done()
            })
        })
    })
})