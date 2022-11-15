import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import type { Configuration } from 'webpack'

import rules from './webpack.rules'

export const rendererConfig: Configuration = {
  // Do not create source maps
  devtool: false,
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
  plugins: [
    new ForkTsCheckerWebpackPlugin({ logger: 'webpack-infrastructure' }),
    new MiniCssExtractPlugin({
      filename: 'shared/index.css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
