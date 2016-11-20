import path from 'path'

import { appEntry, devServer, devtool, plugins, rules } from './webpack.common'

export default {
  entry: {
    app: appEntry,
    common: path.resolve(__dirname, '../src', 'common.js'),
  },
  devtool,
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    // The logical path in the browser
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules,
  },
  devServer,
  target: 'web',
  plugins,
}
