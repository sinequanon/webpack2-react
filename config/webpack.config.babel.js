import webpack from 'webpack'
import path from 'path'
import merge from 'webpack-merge'
import HtmlWebPackPlugin from 'html-webpack-plugin'

import { cssLoaders, commonConfig } from './webpack.common'

const merged = merge({
  entry: {
    app: [
      'react-hot-loader/patch'
    ]
  }
}, commonConfig)

console.log('merged', merged)
export default merged
