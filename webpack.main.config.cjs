const CopyPlugin = require('copy-webpack-plugin')
const rules = require('./webpack.rules.cjs')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
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
        test: /\.(m?js|node)$/u,
        parser: { amd: false },
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
  // Do not create source maps
  devtool: false,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/shared/static', to: 'static' }],
    }),
  ],
}
