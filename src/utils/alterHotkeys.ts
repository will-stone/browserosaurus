import { Hotkeys } from '../main/store'
import { getHotkeyByAppId } from './getHotkeyByAppId'

// Update a hotkeys object based on incoming app ID and hotkey combo
export function alterHotkeys(
  hotkeys: Hotkeys,
  appId: string,
  hotkey: string,
): Hotkeys {
  // Do not alter original hotkeys object
  const hotkeysCopy = { ...hotkeys }
  // Find the previous key for this app
  const oldKey = getHotkeyByAppId(hotkeysCopy, appId)
  // If the new hotkey is empty, it's a deletion and so remove the current entry
  if (!hotkey) {
    delete hotkeysCopy[oldKey || '']
    return hotkeysCopy
  }

  // If the new key is allowed, delete the previous entry and add new entry
  const matchAlphaNumeric = hotkey.match(/^([A-Za-z0-9])$/u)
  if (matchAlphaNumeric) {
    delete hotkeysCopy[oldKey || '']
    return { ...hotkeysCopy, [hotkey]: appId }
  }

  // Else change nothing and return the original
  return hotkeys
}
