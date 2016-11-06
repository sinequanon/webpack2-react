import path from 'path'

import { appEntry, babelOptions, styleLoader, plugins, rules } from './webpack.common'

export default {
  entry : {
    app: appEntry,
    common : path.resolve(__dirname, '../src', 'vendor.js')
  },
  output : {
    path: path.resolve(__dirname, '..', 'dist'),
    filename      : '[name].js',
    chunkFilename : '[id].js',
    // The logical path in the browser
    publicPath    : '/'
  },
  resolve : {
    modules : [ 'node_modules' ]
  },
  module : {
    rules : rules
  },
  target: 'web',
  plugins: plugins
}
