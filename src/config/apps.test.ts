import { getKeys } from '../shared/utils/get-keys.js'
import { apps } from './apps.js'

test.each(getKeys(apps))(
  '%s should not include anything but allowed keys',
  (input) => {
    const allowedKeys = new Set(['name', 'convertUrl', 'privateArg'])

    const unknownKeys = getKeys(apps[input]).filter(
      (key) => !allowedKeys.has(key),
    )

    expect(unknownKeys).toHaveLength(0)
  },
)

test('should have apps in alphabetical order by name', () => {
  const appNames = Object.keys(apps).map((appName) => appName.toLowerCase())
  const sortedAppNames = [...appNames].sort()
  expect(appNames).toStrictEqual(sortedAppNames)
})
