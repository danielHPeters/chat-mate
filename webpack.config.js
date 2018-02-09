'use strict'

const path = require('path')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    chat: './src/client/app.ts',
    multimedia: './src/client/multimedia.ts'
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, './public/js'),
    filename: '[name].js'
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [new UglifyWebpackPlugin({
    sourceMap: true
  })]
}
