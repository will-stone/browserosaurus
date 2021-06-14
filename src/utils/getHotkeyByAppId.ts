import { Hotkeys } from '../main/store'
import type { App } from '../shared-state/apps.reducer'

export function getHotkeyByAppId(
  hotkeys: Hotkeys,
  appId: App['id'],
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === appId)
}
