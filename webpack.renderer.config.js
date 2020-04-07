const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

rules.push({
  test: /\.css$/u,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: true,
      },
    },
  ],
})

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
