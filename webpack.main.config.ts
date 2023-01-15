import CopyPlugin from 'copy-webpack-plugin'
import { type Configuration } from 'webpack'

import rules from './webpack.rules'

export const mainConfig: Configuration = {
  // Do not create source maps
  devtool: false,
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  externals: {
    'file-icon': 'file-icon',
  },
  module: {
    rules: [
      {
        // We're specifying native_modules in the test because the asset
        // relocator loader generates a "fake" .node file which is really
        // a cjs file.
        test: /native_modules\/.+\.node$/u,
        use: 'node-loader',
      },
      {
        parser: { amd: false },
        test: /\.(m?js|node)$/u,
        use: {
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      },
      ...rules,
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/shared/static', to: 'static' }],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
}
