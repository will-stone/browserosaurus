import type { Hotkeys } from '../state/reducer.storage'
import { alterHotkeys } from './alter-hotkeys'

const cases: [Hotkeys, string, string, Hotkeys][] = [
  // Add Safari to empty hotkeys
  [{}, 'com.apple.Safari', 's', { s: 'com.apple.Safari' }],
  // Make sure case of hotkey is not relevant
  [{}, 'com.apple.Safari', 'S', { s: 'com.apple.Safari' }],
  // Change a hotkey
  [
    { s: 'com.apple.Safari' },
    'com.apple.Safari',
    'd',
    { d: 'com.apple.Safari' },
  ],
  // Remove a hotkey
  [{ s: 'com.apple.Safari' }, 'com.apple.Safari', '', {}],
  [
    { s: 'com.apple.Safari', f: 'org.mozilla.firefox' },
    'com.apple.Safari',
    '',
    { f: 'org.mozilla.firefox' },
  ],
  // Add to hotkeys
  [
    { s: 'com.apple.Safari' },
    'org.mozilla.firefox',
    'f',
    { s: 'com.apple.Safari', f: 'org.mozilla.firefox' },
  ],
  // Use a number as hotkey
  [
    { s: 'com.apple.Safari' },
    'com.apple.Safari',
    '2',
    { 2: 'com.apple.Safari' },
  ],
  // Move a hotkey over to a different app
  [
    { s: 'com.apple.Safari' },
    'org.mozilla.firefox',
    's',
    { s: 'org.mozilla.firefox' },
  ],
  // Move a hotkey over to a different app
  [
    { s: 'com.apple.Safari', f: 'org.mozilla.firefox' },
    'org.mozilla.firefox',
    's',
    { s: 'org.mozilla.firefox' },
  ],
  // Move a hotkey over to a different app
  [
    {
      s: 'com.apple.Safari',
      f: 'org.mozilla.firefox',
      c: 'org.chromium.Chromium',
    },
    'org.mozilla.firefox',
    'c',
    {
      s: 'com.apple.Safari',
      c: 'org.mozilla.firefox',
    },
  ],
  // Do nothing on non alphanumeric
  [
    { s: 'com.apple.Safari' },
    'com.apple.Safari',
    '-',
    { s: 'com.apple.Safari' },
  ],
  // Do nothing on more than a single character
  [
    { s: 'com.apple.Safari' },
    'com.apple.Safari',
    'aa',
    { s: 'com.apple.Safari' },
  ],
]

test.each(cases)(
  'given hotkeys %p, app ID %p, and hotkey %p return %p',
  (hotkeys, appId, hotkey, expected) => {
    return expect(alterHotkeys(hotkeys, appId, hotkey)).toEqual(expected)
  },
)
