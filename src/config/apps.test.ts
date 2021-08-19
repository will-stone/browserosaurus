import { getKeys } from '../shared/utils/get-keys'
import { apps } from './apps'

test.each(getKeys(apps))('%s should have name', (input) => {
  expect(apps[input]).toHaveProperty('name')
  expect(typeof apps[input].name).toBe('string')
})

test.each(getKeys(apps))(
  '%s should not include anything but allowed keys',
  (input) => {
    const allowedKeys = new Set(['name', 'urlTemplate', 'privateArg'])
    const unknownKeys = getKeys(apps[input]).filter(
      (key) => !allowedKeys.has(key),
    )
    expect(unknownKeys).toHaveLength(0)
    // expect([undefined, 'string']).toContain(typeof apps[input]['urlTemplate'])
    // expect(apps[input]['urlTemplate']).toBe('name')
    // expect(typeof apps[input].name).toBe('string')
  },
)
