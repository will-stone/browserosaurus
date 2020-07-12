import { backspaceUrlParse } from './backspaceUrlParse'

const cases = [
  // Kitchen sink
  [
    'https://example.com:4000/path/name/?search=param&another=param2#hash-thing',
    'https://example.com:4000/path/name/?search=param&another=param2',
  ],
  [
    'https://example.com:4000/path/name/?search=param&another=param2',
    'https://example.com:4000/path/name/?search=param',
  ],
  [
    'https://example.com:4000/path/name/?search=param',
    'https://example.com:4000/path/name/',
  ],
  ['https://example.com:4000/path/name/', 'https://example.com:4000/path/'],
  ['https://example.com:4000/path/', 'https://example.com:4000/'],
  ['https://example.com:4000/', undefined],
  [undefined, undefined],
  // No port
  ['https://example.com/', undefined],
  // No trailing slash
  ['https://example.com', undefined],
  // Just hash
  ['https://example.com/#hash', 'https://example.com/'],
  ['https://example.com#hash', 'https://example.com/'],
  // Just query params
  ['https://example.com/?a=1&b=2', 'https://example.com/?a=1'],
  ['https://example.com/?a=1', 'https://example.com/'],
  ['https://example.com?a=1&b=2', 'https://example.com/?a=1'],
  // Hash hijacking
  [
    'https://example.com/a/b#comment:8/agdsf?sdfasdfasd&jhgsadf',
    'https://example.com/a/b',
  ],
]

test.each(cases)('given %p return %p', (input, expected) => {
  expect(backspaceUrlParse(input)).toBe(expected)
})
