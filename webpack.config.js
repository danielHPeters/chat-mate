'use strict'

const path = require('path')

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
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
