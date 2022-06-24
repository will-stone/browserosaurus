const rules = require('./webpack.rules.cjs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.(png|jpg|gif|svg)$/iu,
        use: 'url-loader',
      },
      {
        test: /\.css$/u,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  // Do not create source maps
  devtool: false,
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'shared/index.css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
