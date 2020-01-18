const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackRules = require('./webpack.rules')

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules: webpackRules,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main_window/style.css',
    }),
  ],
}
