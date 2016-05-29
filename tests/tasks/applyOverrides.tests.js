var assert = require('chai').assert
var path = require('path')
var fs = require('fs')
var applyOverrides = require('../../lib/tasks/applyOverrides')

describe('Apply Overrides', function() {

    var originalCwd

    before(function() {
        originalCwd = process.cwd()
        restoreConfigJson()
        process.chdir(path.resolve('tests/data/applyOverrides'))
    })

    after(function() {
        restoreConfigJson()
        process.chdir(originalCwd)
    })

    it('should load config from specified js file', function(done) {
        applyOverrides({ params: { config: 'custom.js'}}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.config.source, 'custom.js')
            done()
        })
    })

    it('should load config from specified json file', function(done) {
        applyOverrides({ params: { config: 'custom.json'}}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.config.source, 'custom.json')
            done()
        })
    })

    it('should load config from config json by default', function(done) {
        restoreConfigJson()
        applyOverrides({ params: {}}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.config.source, 'config.json')
            done()
        })
    })

    it('should load config from config js by default', function(done) {
        archiveConfigJson()
        applyOverrides({ params: {}}, function(err, ctx) {
            assert.ifError(err)
            assert.equal(ctx.config.source, 'config.js')
            restoreConfigJson()
            done()
        })
    })

    function restoreConfigJson() {
        if (fs.existsSync('config.json.bak')) fs.renameSync('config.json.bak', 'config.json')
    }

    function archiveConfigJson() {
        if (fs.existsSync('config.json')) fs.renameSync('config.json', 'config.json.bak')
    }
})