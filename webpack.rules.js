module.exports = [
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
]
