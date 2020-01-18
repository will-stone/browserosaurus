const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  {
    test: /\.(js|jsx|ts|tsx)$/u,
    exclude: /node_modules/u,
    use: 'babel-loader',
  },
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
    test: /\.css$/u,
    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
  },
]
