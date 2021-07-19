import type { Hotkeys } from '../state/reducer.storage'
import { getHotkeyByAppId } from './get-hotkey-by-app-id'

// Update a hotkeys object based on incoming app ID and hotkey combo
export function alterHotkeys(
  hotkeys: Hotkeys,
  appId: string,
  hotkey: string,
): Hotkeys {
  const lowerHotkey = hotkey.toLowerCase()

  // Do not alter original hotkeys object
  const hotkeysCopy = { ...hotkeys }

  // Find the previous key for this app
  const oldKey = getHotkeyByAppId(hotkeysCopy, appId)

  // If the new hotkey is empty, it's a deletion and so remove the current entry
  if (!lowerHotkey) {
    delete hotkeysCopy[oldKey || '']
    return hotkeysCopy
  }

  // If the new key is allowed, delete the previous entry and add new entry
  const matchAlphaNumeric = lowerHotkey.match(/^([a-z0-9])$/u)
  if (matchAlphaNumeric) {
    delete hotkeysCopy[oldKey || '']
    return { ...hotkeysCopy, [lowerHotkey]: appId }
  }

  // Else change nothing and return the original
  return hotkeys
}
