import path from 'path'

import { appEntry, babelOptions, styleLoader, plugins } from './webpack.common'

const IS_PROD = process.env.NODE_ENV === 'production'

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
    rules : [
      {
        test    : /\.jsx?$/,
        exclude : /node_modules/,
        loader : 'babel',
        options : babelOptions
      },
      {
        test   : /\.s?css$/,
        loader : styleLoader
      },
      {
        // Image assets
        test   : [/\.png/, /\.jpg$/, /\.gif$/],
        // Any image assets will be autoconverted to inline base64
        // unless they are over the limit specified in the query
        // parameter. If the assets is over the limit, the
        // file-loader takes over and will emit the file using the
        // naming pattern specified. name options include [path]
        // [name] [hash] [ext] In the case below, we are telling
        // the loader to emit the file in the static directory
        // using the file name followed by the hash and extension.
        loader : 'url?limit=1&name=static/[name]-[hash].[ext]'
      }
    ]
  },
  target: 'web',
  plugins: plugins
}
