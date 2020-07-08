import { App } from '../config/types'
import { Hotkeys } from '../main/store'

export function getHotkeyByAppId(
  hotkeys: Hotkeys,
  appId: App['id'],
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === appId)
}
