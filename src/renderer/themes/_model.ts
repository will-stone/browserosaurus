export interface Theme {
  sample: {
    a: string
    b: string
    c: string
  }
  url: {
    bg: string
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
    bg: string
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
    bg: string
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
