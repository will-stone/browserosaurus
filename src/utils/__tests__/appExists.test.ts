import { appExists } from '../doesAppExist'

const cases: [string, boolean][] = [
  ['Safari', true],
  ['safari', true],
  ['does not exist', false],
]

test.each(cases)('given %p return %p', (input, expected) => {
  return expect(appExists(input)).resolves.toBe(expected)
})
