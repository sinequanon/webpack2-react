import webpack from 'webpack'
import path from 'path'
import merge from 'webpack-merge'
import HtmlWebPackPlugin from 'html-webpack-plugin'

import commonConfig from './webpack.common'

export default merge(commonConfig)
