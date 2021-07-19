import type { App } from '../state/reducer.apps'
import type { Hotkeys } from '../state/reducer.storage'

export function getHotkeyByAppId(
  hotkeys: Hotkeys,
  appId: App['id'],
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === appId)
}
