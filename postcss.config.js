const atImport = require('postcss-import')
const discardComments = require('postcss-discard-comments')
const tailwindcss = require('tailwindcss')

// Whilst Tailwind now includes PurgeCSS, we need finer control so that we can
// purge other imported CSS.
const purgecss = require('@fullhuman/postcss-purgecss')({
  keyframes: true,

  content: ['./src/**/*.html', './src/**/*.tsx'],

  defaultExtractor: (content) => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/gu) || []

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/gu) || []

    return broadMatches.concat(innerMatches)
  },
})

module.exports = {
  plugins: [
    atImport,
    tailwindcss('./tailwind.config.js'),
    discardComments({ removeAll: true }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}
