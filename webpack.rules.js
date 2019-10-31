// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: 'babel-loader',
  },
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.(png|jpg|gif|svg)$/i,
    use: 'url-loader',
  },
  {
    test: /\.css$/,
    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
  },
]
