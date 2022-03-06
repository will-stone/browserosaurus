import { getKeys } from '../shared/utils/get-keys'
import { apps } from './apps'

test.each(getKeys(apps))('%s should have name', (input) => {
  expect(apps[input]).toHaveProperty('name')
  expect(typeof apps[input].name).toBe('string')
})

test.each(getKeys(apps))('%s should have a logo', (input) => {
  expect(apps[input]).toHaveProperty('logo')
  expect(typeof apps[input].name).toBe('string')
})

test.each(getKeys(apps))(
  '%s should not include anything but allowed keys',
  (input) => {
    const allowedKeys = new Set(['name', 'logo', 'convertUrl', 'privateArg'])

    const unknownKeys = getKeys(apps[input]).filter(
      (key) => !allowedKeys.has(key),
    )

    expect(unknownKeys).toHaveLength(0)
  },
)

test('should have apps in alphabetical order by name', () => {
  const appNames = Object.values(apps).map((appDetails) =>
    appDetails.name.toLowerCase(),
  )

  const sortedAppNames = [...appNames].sort()
  expect(appNames).toStrictEqual(sortedAppNames)
})
