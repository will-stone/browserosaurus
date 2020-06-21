const mainPaddingY = 32
const mainBorderBottom = 1
const urlBarHeight = 40
const urlBarMarginB = 16
const rowHeight = 96
const rowGap = 16
const footerHeight = 64

export function calcWindowHeight(numberTileRows: number): number {
  return (
    mainPaddingY +
    mainBorderBottom +
    urlBarHeight +
    urlBarMarginB +
    numberTileRows * rowHeight +
    (numberTileRows - 1) * rowGap +
    footerHeight
  )
}
