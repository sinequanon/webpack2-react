import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const babelPath = path.resolve(__dirname, '..', '.babelrc')
const babelrc = fs.readFileSync(babelPath)
let babelOptions = {}

try {
  babelOptions = JSON.parse(babelrc)
} catch (e) {
  console.error('==> Error parsing .babelrc')
  console.error(e)
}
// remove es2015
babelOptions.presets.shift()

export default {
  entry : {
    app: [
      'react-hot-loader/patch',
      path.resolve(__dirname, '../src', 'client.js'),
    ]
  },
  output : {
    path: path.resolve(__dirname, '..', 'dist'),
    filename      : '[name].js',
    chunkFilename : '[id].js',
    // The logical path in the browser
    publicPath    : '/'
  },
  module : {
    rules : [
      {
        test    : /\.jsx?$/,
        exclude : /node_modules/,
        // Disable react hot module loading in PROD
        loader : 'babel',
        options : babelOptions
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({ 
      // In prod we want to serve the HTML pre-rendered via the server
      // so we want to emit the file outside the final /dist directory
      // otherwise the emitted 'index.html' file will be used instead
      // of the server pre-rendered file from express
      filename : 'index.html',
      // Inject assets at the bottom of the body tag. Value can also
      // be 'body'
      inject   : true,
      // emit the file only if it was changed
      cache    : true,
      // Source template to use for the emitted asset
      template : 'src/app.html',
    }),
  ]
}
