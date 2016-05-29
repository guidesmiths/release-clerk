var debug = require('debug')('release-clerk:tasks:validateParams')
var fs = require('fs')
var path = require('path')
var format = require('util').format
var async = require('async')

module.exports = function validateParams(ctx, cb) {
    debug('Validating parameters')
    async.series([checkRequired, checkConfig], function(err) {
        return cb(err, ctx)
    })

    function checkRequired(cb) {
        var required = ['user', 'repository', 'currentReleaseSha', 'title']
        async.eachSeries(required, function(field, cb) {
            if (!ctx.params[field]) return cb(new Error(format('%s is required', field)))
            cb()
        }, cb)
    }

    function checkConfig(cb) {
        if (!ctx.params.config) return cb()
        var configPath = path.resolve(ctx.params.config)
        if (fs.existsSync(configPath)) return cb()
        cb(new Error(format('%s does not exists', configPath)))
    }

}
