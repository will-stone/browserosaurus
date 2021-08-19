const CopyPlugin = require('copy-webpack-plugin')
const rules = require('./webpack.rules')
const path = require('path')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  // Do not create source maps
  devtool: false,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@browser-logos': false,
      [path.resolve(__dirname, './src/config/logos')]: false,
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/shared/static', to: 'static' }],
    }),
  ],
}
