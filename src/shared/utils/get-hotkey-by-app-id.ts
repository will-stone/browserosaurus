import type { AppId } from '../../config/apps'
import type { Hotkeys } from '../state/reducer.storage'

export function getHotkeyByAppId(
  hotkeys: Hotkeys,
  appId: AppId,
): string | undefined {
  return Object.keys(hotkeys).find((key) => hotkeys[key] === appId)
}
