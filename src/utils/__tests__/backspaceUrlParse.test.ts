import { backspaceUrlParse } from '../backspaceUrlParse'

test('should remove parts of url by steps', () => {
  const url =
    'https://example.com:4000/path/name/?search=param&another=param2#hash-thing'

  const url1 = backspaceUrlParse(url)
  expect(url1).toBe(
    'https://example.com:4000/path/name/?search=param&another=param2',
  )

  const url2 = backspaceUrlParse(url1)
  expect(url2).toBe('https://example.com:4000/path/name/?search=param')

  const url3 = backspaceUrlParse(url2)
  expect(url3).toBe('https://example.com:4000/path/name/')

  const url4 = backspaceUrlParse(url3)
  expect(url4).toBe('https://example.com:4000/path/')

  const url5 = backspaceUrlParse(url4)
  expect(url5).toBe('https://example.com:4000/')

  const url6 = backspaceUrlParse(url5)
  expect(url6).toBeUndefined()

  expect(backspaceUrlParse()).toBeUndefined()
})
