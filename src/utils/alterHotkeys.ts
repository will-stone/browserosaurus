import { Hotkeys } from '../main/store'
import { getHotkeyByBrowserId } from './getHotkeyByBrowserId'

// Update a hotkeys object based on incoming browser ID and hotkey combo
export function alterHotkeys(
  hotkeys: Hotkeys,
  browserId: string,
  hotkey: string,
): Hotkeys {
  // Do not alter original hotkeys object
  const hotkeysCopy = { ...hotkeys }
  // Find the previous key for this browser
  const oldKey = getHotkeyByBrowserId(hotkeysCopy, browserId)
  // If the new hotkey is empty, it's a deletion and so remove the current entry
  if (!hotkey) {
    delete hotkeysCopy[oldKey || '']
    return hotkeysCopy
  }

  // If the new key is allowed, delete the previous entry and add new entry
  const matchAlphaNumeric = hotkey.match(/^([A-Za-z0-9])$/u)
  if (matchAlphaNumeric) {
    delete hotkeysCopy[oldKey || '']
    return { ...hotkeysCopy, [hotkey]: browserId }
  }

  // Else change nothing and return the original
  return hotkeys
}
