var debug = require('debug')('release-clerk:tasks:applyOverrides')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')

module.exports = function applyOverrides(ctx, cb) {
    debug('Applying configuration overrides')
    var overrides = load(ctx.params.config) || load('config.json') || load('config.js') || {}
    cb(null, _.merge(ctx, { config: overrides }))
}

function load(filename) {
    if (!filename) return
    var resolved = path.resolve(filename)
    debug('Attempting to load overrides from %s', resolved)
    return fs.existsSync(resolved) ? require(resolved) : undefined
}
