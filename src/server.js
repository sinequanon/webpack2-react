import restify from 'restify'
import path from 'path'

const debug = require('debug')('server') /* eslint import/no-extraneous-dependencies : 0 */

const PORT = process.env.PORT || 8080

const app = restify.createServer()

if (process.env.NODE_ENV === 'production') {
  app.use(restify.gzipResponse())
  debug('Running PRODUCTION')
}

// Target the compiled output directory
const distDirectory = path.resolve(__dirname, '..', 'dist')
const assetsDirectory = path.resolve(__dirname, '..', 'dist', 'assets')

// Tell restify where to load static assets
app.get(/.*(png|jpg|gif)/, restify.serveStatic({ directory: assetsDirectory }))
app.get(/.*(js|css)/, restify.serveStatic({ directory: distDirectory }))
// Always return index.html to force in-browser rendering for various routes
app.get('/.*', restify.serveStatic({ directory: distDirectory, file: 'index.html' }))

app.listen(PORT, () => {
  debug('Restify listening on port %s', PORT)
})
