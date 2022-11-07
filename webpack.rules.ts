const rules = [
  {
    exclude: /(node_modules|\.webpack)/u,
    test: /\.tsx?$/u,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
]

export default rules
