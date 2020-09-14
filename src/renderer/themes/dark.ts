import { Theme } from './_model'

const grey7 = '#0D1117'
const grey6 = '#1A1D21'
const grey4 = '#2F333B'
const grey3 = '#848C9B'
const grey2 = '#A9B2C3'
const grey1 = '#C6CCD7'

const pink3 = '#ED64A6'
const pink2 = '#F687B3'
const pink1 = '#FED7E2'

const blue = '#63B3ED'

const yellow = '#F6E05E'

const purple = '#9F7AEA'

export const dark: Theme = {
  sample: { a: grey6, b: grey4, c: grey1 },
  url: {
    bg: grey6,
    text: {
      base: grey3,
      host: grey1,
      sponsorBase: pink1,
      sponsorHost: pink2,
      disabled: grey4,
    },
    border: {
      base: grey4,
      sponsor: pink3,
    },
  },
  settings: {
    text: grey2,
    bg: grey6,
    border: grey4,
  },
  tiles: {
    bg: grey6,
    border: grey4,
  },
  tile: {
    bg: {
      hover: grey7,
    },
    text: grey1,
  },
  tooltip: {
    bg: grey7,
    text: grey1,
  },
  button: {
    bg: grey4,
    text: {
      disabled: grey4,
      base: grey1,
      sponsor: pink2,
      update: blue,
    },
  },
  icons: {
    star: yellow,
    eye: purple,
    keyboard: blue,
  },
}
