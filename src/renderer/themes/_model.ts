export interface Theme {
  sample: {
    a: string
    b: string
    c: string
  }
  bg: string
  url: {
    text: {
      base: string
      host: string
      sponsorBase: string
      sponsorHost: string
      disabled: string
    }
    border: {
      base: string
      sponsor: string
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
  tooltip: {
    bg: string
    text: string
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
