import { Browser } from '../config/browsers'

const mainPaddingY = 32
const mainBorderBottom = 1
const urlBarHeight = 40
const urlBarMarginB = 16
const rowHeight = 96
const rowGap = 16
const footerHeight = 64

export function calcWindowHeight(
  installedBrowsers: Browser[],
  hiddenTileIds: string[],
): number {
  const visibleTiles = installedBrowsers.filter(
    (b) => !hiddenTileIds.includes(b.id),
  )
  // At least one row
  const numberOfTileRows = Math.ceil(visibleTiles.length / 5) || 1

  return (
    mainPaddingY +
    mainBorderBottom +
    urlBarHeight +
    urlBarMarginB +
    numberOfTileRows * rowHeight +
    (numberOfTileRows - 1) * rowGap +
    footerHeight
  )
}
