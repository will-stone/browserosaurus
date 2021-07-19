import type { Hotkeys } from '../../main/storage'
import type { App } from '../state/reducer.apps'

export function getHotkeyByAppId(
  hotkeys: Hotkeys,
  appId: App['id'],
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === appId)
}
