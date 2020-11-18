export interface Theme {
  sample: {
    a: string
    b: string
    c: string
  }
  bg: string
  titleBarBg: string
  url: {
    text: {
      base: string
      host: string
      sponsorBase: string
      sponsorHost: string
      disabled: string
    }
  }
  tiles: {
    border: string
  }
  tile: {
    bg: {
      hover: string
    }
    text: string
  }
  settings: {
    text: string
    border: string
  }
  button: {
    bg: string
    text: {
      base: string
      disabled: string
      sponsor: string
      update: string
    }
  }
  icons: {
    star: string
    eye: string
    keyboard: string
  }
}
