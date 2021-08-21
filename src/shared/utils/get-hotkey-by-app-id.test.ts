import type { AppId } from '../../config/apps'
import type { Hotkeys } from '../state/reducer.storage'
import { getHotkeyByAppId } from './get-hotkey-by-app-id'

const cases: [Hotkeys, AppId, ReturnType<typeof getHotkeyByAppId>][] = [
  // Does not exist
  // @ts-expect-error -- missing app ID
  [{}, '', undefined],
  // @ts-expect-error -- unknown app ID
  [{}, 'com.example', undefined],
  [{ s: 'com.apple.Safari' }, 'com.microsoft.edgemac', undefined],
  // Exists
  [{ s: 'com.apple.Safari' }, 'com.apple.Safari', 's'],
  [
    { s: 'com.apple.Safari', e: 'com.microsoft.edgemac' },
    'com.apple.Safari',
    's',
  ],
  [
    { s: 'com.apple.Safari', e: 'com.microsoft.edgemac' },
    'com.microsoft.edgemac',
    'e',
  ],
]

test.each(cases)('given %p return %p', (hotkeys, appId, expected) => {
  expect(getHotkeyByAppId(hotkeys, appId)).toBe(expected)
})
