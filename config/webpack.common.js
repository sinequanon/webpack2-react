/*
  eslint import/no-extraneous-dependencies: 0
  no-console: 0
  */
import path from 'path'
import fs from 'fs'

import webpack from 'webpack'
// Emits html files injected with asset tags
import HtmlWebPackPlugin from 'html-webpack-plugin'
// Used to output css file in PROD build
import ExtractTextPlugin from 'extract-text-webpack-plugin'
// Fixes possible dupes in ExtractTextPlugin
import OptimizeCssAssets from 'optimize-css-assets-webpack-plugin'
// Plugin for using cssnext features
import postcssnext from 'postcss-cssnext'
// Linting for styles
import StylelintPlugin from 'stylelint-webpack-plugin'
// Hook into notification systems so we don't have to constantly monitor the
// terminal
import WebpackNotifierPlugin from 'webpack-notifier'
// Include postcss-smart-import to fix a hot loading bug in imported css files
import postcssImport from 'postcss-smart-import'
// Reporter for postcss process
import postcssReporter from 'postcss-reporter'
// Sass-like css variables
import postcssSimpleVars from 'postcss-simple-vars'
// Color functions
import postcssSassColorFunctions from 'postcss-sass-color-functions'
// Mixins
import postcssMixins from 'postcss-mixins'
// Nested css
import postcssNested from 'postcss-nested'
// Reference any ancestors in css
import postcssNestedAncestors from 'postcss-nested-ancestors'

// Webpack 2 now allows passing the -p parameter which auto sets NODE_ENV to
// 'production'. While convenient, it isn't explicit so we manually set the
// variable in the npm prod script
const IS_PROD = process.env.NODE_ENV === 'production'

export const appEntry = [].concat(
  !IS_PROD ? ['react-hot-loader/patch'] : [],
  [path.resolve(__dirname, '../src', 'client.js')])

const babelOptions = (() => {
  const babelPath = path.resolve(__dirname, '..', '.babelrc')
  const babelrc = fs.readFileSync(babelPath)
  let currentOptions = {}

  try {
    currentOptions = JSON.parse(babelrc)
  } catch (e) {
    console.error('==> Error parsing .babelrc') // eslint no-console: 0
    console.error(e) // eslint no-console: 0
  }

  // babelrc includes the ES2015 preset so we can write webpack config using
  // ES2015 code. However we can remove ES2015 once the file is loaded since
  // Chrome supports most ES2015 natively
  currentOptions.presets.shift()
  return currentOptions
})()

const styleLoader = (() => {
  // Style loaders normally used in DEVELOPMENT
  const styleLoaders = [
    {
      loader: 'style',
    },
    {
      loader: 'css',
      query: {
        sourceMap: true,
      },
    },
    {
      loader: 'postcss',
      query: {
        sourceMap: true,
      },
    },
  ]

  let currentLoader = styleLoaders
  if (IS_PROD) {
    // Remove the style loader (first loader in the styleLoaders array) from
    // the styleLoaders in a PROD build since having it present in the
    // ExtractTextPlugin will cause a window undefined error
    styleLoaders.shift()

    // In PRODUCTION extract the CSS
    currentLoader = ExtractTextPlugin.extract({
      fallbackLoader: 'style',
      loader: styleLoaders,
    })
  }
  return currentLoader
})()

export const plugins = (() => {
  let currentPlugins = [
    // Defines environment variable that will be trigger a pared down
    // version of React to be exercised during minification. NOTE: we
    // already specify the NODE_ENV=production in the package.json
    // script However that doesn't appear to trigger the minifier to
    // compress the production version which doesn't include debugging
    // info, so we must explicitly set the environment variable with the
    // plugin.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
        postcss: webpack => // eslint-disable-line
          [
            postcssImport({ addDependencyTo: webpack }),
            postcssMixins(),
            postcssSimpleVars(),
            postcssSassColorFunctions(),
            postcssNestedAncestors(),
            postcssNested(),
            // Allow next gen css syntax
            postcssnext({
              browsers: ['last 2 Chrome versions'],
            }),
            // postcss logging
            postcssReporter({ clearMessages: true }),
          ],
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: 2,
      name: 'common',
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebPackPlugin({
      // In prod we want to serve the HTML pre-rendered via the server
      // so we want to emit the file outside the final /dist directory
      // otherwise the emitted 'index.html' file will be used instead
      // of the server pre-rendered file from express
      filename: 'index.html',
      // Inject assets at the bottom of the body tag. Value can also
      // be 'body'
      inject: true,
      // emit the file only if it was changed
      cache: true,
      // Source template to use for the emitted asset
      template: 'src/app.html',
    }),
    new OptimizeCssAssets(),
  ]

  if (IS_PROD) {
    currentPlugins = currentPlugins.concat([
      // Emits css file using naming pattern below
      new ExtractTextPlugin('[name]-[contenthash].css'),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          screw_ie8: true,
          warnings: true,
        },
      }),
      // Prevents emitting assets that include errors in them
      // Do not include in non PROD environments otherwise lint
      // warnings will fail to emit anything to the build
      new webpack.NoErrorsPlugin(),
    ])
  } else {
    currentPlugins = currentPlugins.concat([
      // Add linting to CSS using stylelint. We are extending
      // stylelint-config-standard
      new StylelintPlugin({
        syntax: 'scss',
        files: ['**/*.css'],
      }),
      new WebpackNotifierPlugin(),
    ])
  }
  return currentPlugins
})()

export const rules = (() => {
  let currentRules = [
    // Loaders in webpack are read from right to left
    // Transpiles our JS files
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      options: babelOptions,
    },
    // Convert from sass -> postcss -> css -> style
    {
      test: /\.s?css$/,
      loader: styleLoader,
    },
    {
      // Image assets
      test: [/\.png/, /\.jpg$/, /\.gif$/],
      // Any image assets will be autoconverted to inline base64
      // unless they are over the limit specified in the query
      // parameter. If the assets is over the limit, the
      // file-loader takes over and will emit the file using the
      // naming pattern specified. name options include [path]
      // [name] [hash] [ext] In the case below, we are telling
      // the loader to emit the file in the static directory
      // using the file name followed by the hash and extension.
      loader: 'url?limit=1&name=static/[name]-[hash].[ext]',
    },
  ]

  if (!IS_PROD) {
    // Run js code through eslint
    currentRules = currentRules.concat([{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      enforce: 'pre',
      loader: 'eslint',
    }])
  }

  return currentRules
})()

// See https://webpack.github.io/docs/configuration.html#devtool for
// different options
export const devtool = IS_PROD ? 'cheap-module-source-map' : 'source-map'

export const devServer = {
  stats: {
    colors: true,
    reasons: true,
    warnings: true,
    publicPath: true,
    errors: true,
    errorDetails: true,
    source: false,
    children: false,
    modules: false,
    hash: false,
    version: false,
    timings: false,
    assets: true,
    chunks: false,
  },
}
