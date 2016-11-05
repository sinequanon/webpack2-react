import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import optimizeCssAssets from 'optimize-css-assets-webpack-plugin'

// Plugin for using cssnext features
import postcssnext from 'postcss-cssnext'
// Use precss as replacement for sass lib due to apparent speed up and much 
// faster compilation using postcss
import precss from 'precss'
// Include postcss-import to fix a hot loading bug in imported css files
// import postcssImport from 'postcss-import'
// Reporter for postcss process
import postcssReporter from 'postcss-reporter'
import smartImport from 'postcss-smart-import'

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

export const cssLoaders = [
  {
    loader : 'style-loader'
  },
  {
    loader : 'css-loader',
    query : {
      sourceMap : true
    }
  },
  {
    loader : 'postcss-loader',
    query : {
      sourceMap : true
    }
  }
]

// Make a copy of the loaders array
const cssLoadersCopy = cssLoaders.slice()
// Remove the first item from the array. It will cause a window undefined error
// if you use it with the extract text plugin
cssLoadersCopy.shift()

export const commonConfig = {
  entry : {
    app: [
      path.resolve(__dirname, '../src', 'client.js'),
    ],
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
        // Disable react hot module loading in PROD
        loader : 'babel',
        options : babelOptions
      },
      {
        test   : /\.s?css$/,
        // use : cssLoaders
        loader : ExtractTextPlugin.extract({
          fallbackLoader : 'style-loader',
          loader : cssLoadersCopy//cssLoaders.slice().shift()  // remove the first element
        })
      },
    ]
  },
  target: 'web',
  plugins: [
    // only use in production
    // new webpack.optimize.DedupePlugin(),
    // Emits css file using naming pattern below
    new ExtractTextPlugin({ filename: '[name]-[contenthash].css'}),
    new webpack.LoaderOptionsPlugin({
      options : {
        context : '/',
        postcss : function (webpack) {
          return [ 
            // require('postcss-import')({ addDependencyTo: webpack }),
            // smartImport({ addDependencyTo: webpack }),
            smartImport(),
            //smartImport({ addDependencyTo: webpack }),
            // Allow sass syntax in css
            precss,
            // Allow next gen css syntax
            postcssnext(),
            // postcss logging
            postcssReporter({ clearMessages : true }),
          ]
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        minChunks: 2,
        name: 'common'
    }),
    new webpack.NamedModulesPlugin(),
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
    new optimizeCssAssets()
  ]
}
