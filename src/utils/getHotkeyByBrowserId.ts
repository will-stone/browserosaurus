import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'

export function getHotkeyByBrowserId(
  hotkeys: Hotkeys,
  browserId: Browser['id'],
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === browserId)
}
