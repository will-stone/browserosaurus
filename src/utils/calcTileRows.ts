import { Browser } from '../config/browsers'

export function calcTileRows(
  installedBrowsers: Browser[],
  hiddenTileIds: string[],
): number {
  const visibleTiles = installedBrowsers.filter(
    (b) => !hiddenTileIds.includes(b.id),
  )
  // At least one row
  const numberOfTileRows = Math.ceil(visibleTiles.length / 5) || 1
  return numberOfTileRows
}
