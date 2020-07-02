import { backspaceUrlParse } from '../backspaceUrlParse'

test('should remove parts of url by steps', () => {
  // Kitchen sink
  expect(
    backspaceUrlParse(
      'https://example.com:4000/path/name/?search=param&another=param2#hash-thing',
    ),
  ).toBe('https://example.com:4000/path/name/?search=param&another=param2')

  expect(
    backspaceUrlParse(
      'https://example.com:4000/path/name/?search=param&another=param2',
    ),
  ).toBe('https://example.com:4000/path/name/?search=param')

  expect(
    backspaceUrlParse('https://example.com:4000/path/name/?search=param'),
  ).toBe('https://example.com:4000/path/name/')

  expect(backspaceUrlParse('https://example.com:4000/path/name/')).toBe(
    'https://example.com:4000/path/',
  )

  expect(backspaceUrlParse('https://example.com:4000/path/')).toBe(
    'https://example.com:4000/',
  )

  expect(backspaceUrlParse('https://example.com:4000/')).toBeUndefined()

  // No text
  expect(backspaceUrlParse()).toBeUndefined()

  // No port
  expect(backspaceUrlParse('https://example.com/')).toBeUndefined()
  expect(backspaceUrlParse('https://example.com')).toBeUndefined()

  // Just hash
  expect(backspaceUrlParse('https://example.com/#hash')).toBe(
    'https://example.com/',
  )
  expect(backspaceUrlParse('https://example.com#hash')).toBe(
    'https://example.com/',
  )

  // Just query params
  expect(backspaceUrlParse('https://example.com/?a=1&b=2')).toBe(
    'https://example.com/?a=1',
  )
  expect(backspaceUrlParse('https://example.com/?a=1')).toBe(
    'https://example.com/',
  )

  expect(backspaceUrlParse('https://example.com?a=1&b=2')).toBe(
    'https://example.com/?a=1',
  )
  expect(backspaceUrlParse('https://example.com?a=1')).toBe(
    'https://example.com/',
  )
})
