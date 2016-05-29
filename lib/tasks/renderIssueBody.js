var debug = require('debug')('release-clerk:tasks:renderIssueBody')
var fs = require('fs')
var path = require('path')
var Hogan = require('hogan.js')

module.exports = function renderIssueBody(ctx, cb) {
    debug('Rendering issue body parameters')

    var pathToTemplates = ctx.config.issue.templates ? path.resolve(process.cwd(), ctx.config.issue.templates) : path.resolve(__dirname, '../../templates')
    var pathToTemplate = path.join(pathToTemplates, ctx.release.type + '.hbs')
    debug('loading issue template from: %s', pathToTemplate)

    var template = fs.readFileSync(pathToTemplate).toString()
    ctx.issue = { body: Hogan.compile(template).render({
        summary: ctx.params.summary,
        commits: ctx.commits,
        truncated: ctx.truncated
    })}

    cb(null, ctx)
}


