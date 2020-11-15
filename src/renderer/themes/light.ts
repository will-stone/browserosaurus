import { Theme } from './_model'

const grey6 = '#0D1117'
const grey5 = '#1A1D21'
const grey4 = '#2F333B'
const grey3 = '#848C9B'
const grey2 = '#A9B2C3'
const grey1 = '#C6CCD7'

const pink3 = '#97266D'
const pink2 = '#B83280'
const pink1 = '#D53F8C'

const blue = '#3182CE'

const yellow = '#4C51BF'

const purple = '#805AD5'

export const light: Theme = {
  sample: { a: grey1, b: grey2, c: grey4 },
  bg: grey1,
  url: {
    text: {
      base: grey4,
      host: grey6,
      sponsorBase: pink1,
      sponsorHost: pink2,
      disabled: grey3,
    },
    border: {
      base: grey2,
      sponsor: pink3,
    },
  },
  settings: {
    text: grey5,
    border: grey2,
  },
  tiles: {
    border: grey2,
  },
  tile: {
    bg: {
      hover: grey2,
    },
    text: grey6,
  },
  tooltip: {
    bg: grey6,
    text: grey1,
  },
  button: {
    bg: grey2,
    text: {
      disabled: grey3,
      base: grey6,
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
