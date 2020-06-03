const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/u,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/u,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.(png|jpg|gif|svg)$/iu,
    use: 'url-loader',
  },
  {
    test: /\.tsx?$/u,
    exclude: /(node_modules|\.webpack)/u,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.css$/u,
    use: [
      'style-loader',
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
]
