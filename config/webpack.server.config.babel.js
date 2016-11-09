import fs from 'fs'
import path from 'path'

module.exports = {

  entry: path.resolve(__dirname, '..', 'src', 'server.js'),

  output: {
    path: path.resolve(__dirname, '..', 'tmp'),
    filename: 'server.bundle.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, '../node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce((ext, mod) => ({
    ...ext,
    [mod]: `commonjs ${mod}`
  }), {}),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }

}
